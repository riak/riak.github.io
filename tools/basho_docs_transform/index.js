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

const drafts = [];
const redirects = [];
const no_front_matters = [];

async function createIndexFiles(dirents) {
  const directories = dirents.filter(({ dirent }) => dirent.isDirectory());
  const markdown_files = dirents.filter(({ f }) => extname(f) === '.md');

  for (const { f: file, } of markdown_files) {
    const file_name = parse(file).name;

    for (const { f: dir } of directories) {
      if (file_name !== basename(dir)) {
        continue;
      }

      console.log(`Moving ${file} to ${basename(dir)} (${join(dir, 'index.md')})`); 

      mv(file, join(dir, 'index.md'), { mkdirp: true }, () => {});
    }
  }
}

// Modified from this Stack Overflow answer: https://stackoverflow.com/a/45130990
async function* getMarkdownFiles(dir) {
  const dirents = (await readdir(dir, { withFileTypes: true }))
    .map(dirent => ({ dirent, f: resolve(dir, dirent.name) }));

  await createIndexFiles(dirents);

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

function transformCodeToTabs(tree) {
  return tree => {
    const repeated_code = [];

    let num_sections = 0;

    tree.children.forEach((child, i) => {
      if (child.type !== 'code') {
        if (repeated_code[num_sections] !== undefined) {
          num_sections++;
        }

        return;
      }

      repeated_code[num_sections] ??= [];

      repeated_code[num_sections].push({ node_index: i, node: child });
    });

    const new_tree = repeated_code.map(repeated_section => {
      const first_index = repeated_section[0].node_index;
      const last_index = repeated_section[repeated_section.length - 1].node_index;
      const nodes = repeated_section.map(({ node }) => node);
      const transformed = [{ type: 'html', value: '<Tabs>' }];

      nodes.forEach((node, i) => {
        const lang = node.lang;
        const label = lang !== null ? ` label='${lang[0].toUpperCase()}${lang.slice(1).toLowerCase()}"` : '';
        const value = lang !== null ? ` value="${lang.toLowerCase()}"` : '';
        const default_attribute = i === 0 ? ' default' : '';
        const heading = `<TabItem${label}${value}${default_attribute}>`;
        const opening = { type: 'html', value: heading };
        const closing = { type: 'html', value: '</TabItem>' };

        transformed.push(opening);

        transformed.push(node);

        transformed.push(closing);
      });

      transformed.push({ type: 'html', value: '</Tabs>' });

      return { transformed, first_index, last_index };
    });

    let previous_section_end = 0;

    const new_children = new_tree.map(({ transformed, first_index, last_index }) => {
      const previous_sections = tree.children
        .filter((_node, i) => i >= previous_section_end && i < first_index);

      previous_section_end = last_index + 1;

      return previous_sections.concat(transformed);
    }).flat();

    tree.children = new_children;
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

  for await (const { f, parsed } of getMarkdownFiles(output_docs_dir)) {
    const title = parsed.title;
    const version = parsed.project_version;
    const id = parsed.menu[`riak_kv-${version}`]?.identifier ?? title.toLocaleLowerCase().replace(/ /g, '_');
    const content = parsed.__content;
    const parsedContent = await remark()
        .use(shortcodes, shortcodeOptions)
        .use(transformShortcodes)
        .use(transformCodeToTabs)
        .process(content);
    const output = `---\ntitle: ${title}\nid: ${id}\n---\n${parsedContent}`;

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
