const { resolve, extname, basename, dirname, parse, join } = require('path');
const { readdir, writeFile } = require('fs').promises;
const { copySync, ensureDir, remove } = require('fs-extra');
const util = require('util');
const args = require('minimist')(process.argv.slice(2), { boolean: 'keep_drafts' });
const mv = require('mv');
const yamlFront = require('yaml-front-matter');
const remark = require('remark');
const visit = require('unist-util-visit');
const { shortcodes } = require('remark-hugo-shortcodes');
const { transformCodeBlock } = require('./code_blocks.js');
const docs_metadata = require('./docs_metadata.json');
const config = require('./config.json');

const drafts = [];
const redirects = [];
const no_front_matters = [];

async function getDirEnts(dir) {
  return (await readdir(dir, { withFileTypes: true }))
    .map(dirent => ({ dirent, f: resolve(dir, dirent.name) }));
}

function getDocMetadata(output_docs_dir, f) {
  // Split on the output path and an option version number (MAJOR.MINOR.PATH)
  const path_match_regex = new RegExp(`${output_docs_dir}(?:\\d\\.\\d\\.\\d)?`);
  const [, file_path] = f.split(path_match_regex);

  return docs_metadata[file_path]; 
}

function generateMetadata(output_docs_dir, f, parsed) {
  const doc_metadata = getDocMetadata(output_docs_dir, f);

  console.log(`Generating matadata for ${f}`);

  if (doc_metadata !== undefined) {
    const title = `"${doc_metadata.title}"`;
    const id = doc_metadata.id;
    const slug = doc_metadata.slug;
    const sidebar_position = doc_metadata.sidebar_position;

    return {
      ...(title !== undefined && { title }),
      ...(id !== undefined && { id }),
      ...(slug !== undefined && { slug }),
      ...(sidebar_position !== undefined && { sidebar_position }),
    };
  }

  const version = parsed.project_version;
  const title = `"${parsed.title}"`;
  const id = parsed.menu[`riak_kv-${version}`]?.identifier ?? title.toLocaleLowerCase().replace(/ /g, '_');

  return { title, id };
}

async function createIndexFiles(dirents) {
  const directories = dirents.filter(({ dirent }) => dirent.isDirectory());
  const markdown_files = dirents.filter(({ f }) => extname(f) === '.md');

  for (const { f: file, } of markdown_files) {
    const file_name = parse(file).name;

    for (const { f: dir } of directories) {
      if (file_name !== basename(dir)) {
        continue;
      }

      const moved_file_name = join(dir, 'index.md');

      console.log(`Moving ${file} to ${basename(dir)} (${moved_file_name})`);

      mv(file, moved_file_name, { mkdirp: true }, () => {});
    }
  }
}

async function configFileTreeChanges(dir) {
  const renames = config.to_rename.map(async ({ from, to }) => { 
    const from_path = join(dir, from);
    const to_path = join(dir, to);

    console.log(`Renaming ${from_path} to ${to_path}`);

    mv(from_path, to_path, { mkdirp: true }, () => {});
  });

  return Promise.all(config.to_delete.map(async file_path => { 
    console.log(`Deleting ${file_path}`);

    await remove(join(dir, file_path));
  }));
}

function fixLink(f, node, name, doc_metadata) {
  if (doc_metadata?.links === undefined) {
    return;
  }

  const found_definition = doc_metadata.links[name];

  if (found_definition !== undefined) {
    console.log(`Link ${f}[${name}]: ${node.url} -> ${found_definition}`);

    node.url = found_definition;

  } else {
    console.log(`Unknown changd link ${f}[${name}]: ${node.url}`);
  }
}

// Modified from this Stack Overflow answer: https://stackoverflow.com/a/45130990
async function* getMarkdownFiles(dir) {
  // We need the intial dirents before moving
  await createIndexFiles(await getDirEnts(dir));

  // We need the updated dirents after moving files around
  const dirents = await getDirEnts(dir);

  for (const { dirent, f } of dirents) {
    if (dirent.isDirectory()) {
        yield* getMarkdownFiles(f);
    }

    if (extname(f) === '.md') {
      const parsed = yamlFront.loadFront(f);
      const no_front_matter = Object.keys(parsed).length <= 1;
      const is_draft = parsed?.draft;
      const is_redirect = parsed?.layout === 'redirect';

      // Skip draft files (for now?), redirect files or files which only have content
      if (no_front_matter || is_redirect || is_draft) {
        if (no_front_matter) {
          no_front_matters.push(f);
        }

        if (is_redirect) {
          redirects.push(f);
        }

        if (is_draft) {
          drafts.push(f);

          if (args.keep_drafts) {
            continue;
          }
        }

        await remove(f);

        continue;
      }

      yield { f, parsed };
    }
  }
}

function transformShortcodes(tree) {
  return tree => {
    visit(tree, 'shortcode', node => {
      node.type = 'text';

      if (node.closing) {
        node.value = ':::';

        return;
      }

      const title = node.attributes?.[0]?.[1] ?? '';
      const title_fmt = ` ${title}`;

      node.value = `:::note${title_fmt}`;
    });
  };
}

function transformLinks({ output_docs_dir, f }) {
  const doc_metadata = getDocMetadata(output_docs_dir, f);

  return tree => {
    if (doc_metadata === undefined) {
      return tree;
    }

    visit(tree, 'definition', node => fixLink(f, node, node.identifier, doc_metadata));

    visit(tree, 'link', node => {
      const name = node.children[0]?.value; 

      fixLink(f, node, name, doc_metadata);
    });
  };
}

function transformNodeLang() {
  return tree => {
    visit(tree, 'code', node => {
      const new_block_lang = config.languages.to_rename?.[node.lang];

      if (new_block_lang !== undefined) {
        console.log(`Renaming language ${node.lang} -> ${new_block_lang}`);

        node.lang = new_block_lang;
      }
    });
  };
}

(async () => {
  const output_docs_dir = args.output_docs_dir;
  const shortcodeOptions = {
    tokens: [['{{%', '%}}']],
    inlineMode: true,
    markdownAttributes: ['title']
  };

  await ensureDir(output_docs_dir);

  copySync(args.input_docs_dir, output_docs_dir);

  await configFileTreeChanges(output_docs_dir);

  for await (const { f, parsed } of getMarkdownFiles(output_docs_dir)) {
    const metadata = Object.entries(generateMetadata(output_docs_dir, f, parsed))
      .map(([meta_item, value]) => `${meta_item}: ${value}`)
      .join('\n');
    const content = parsed.__content;
    const parsedContent = await remark()
        .data('settings', { bullet: '*', emphasis: '*', strong: '*', listItemIndent: '1' })
        .use(shortcodes, shortcodeOptions)
        .use(transformShortcodes)
        .use(transformCodeBlock)
        .use(transformLinks, { output_docs_dir, f })
        .use(transformNodeLang)
        .process(content);
    const output = `---\n${metadata}\n---\n\n${parsedContent}`;

    await writeFile(f, output);
  }

  if (args.name_ignored_files !== undefined) {
    // Print full arrays
    util.inspect.defaultOptions.maxArrayLength = null;

    console.log('Drafts:');

    console.log(drafts);

    console.log('Redirects:');

    console.log(redirects);

    console.log('No Front Matters:');

    console.log(no_front_matters);

    console.log(`Num drafts: ${drafts.length}, Num redirects: ${redirects.length}, Num no front matter: ${no_front_matters.length}`);
  }
})();
