const { resolve, extname, parse } = require('path');
const { readdir, readFile, writeFile } = require('fs').promises;
const yamlFront = require('yaml-front-matter');
const remark = require('remark');
const visit = require('unist-util-visit');

// Modified from this Stack Overflow answer: https://stackoverflow.com/a/45130990
async function* getMarkdownFiles(dir) {
  const dirents = (await readdir(dir, { withFileTypes: true }))
    .map(dirent => ({ dirent, f: resolve(dir, dirent.name) }));

  for (const { dirent, f } of dirents) {
    if (dirent.isDirectory()) {
        yield* getMarkdownFiles(f);
    }

    if (extname(f) === '.md') {
      const parsed = yamlFront.loadFront(f);

      yield { f, parsed };
    }
  }
}

function addDefinition(file_path, metadata, name, url) {
  metadata[file_path] ??= {};
  metadata[file_path].links ??= {};

  metadata[file_path].links[name] = url;
}

function gatherDefinitions({ file_path, metadata }) {
  return tree => {
    visit(tree, 'definition', node => 
      addDefinition(file_path, metadata, node.identifier, node.url));

    visit(tree, 'link', node => {
      const link_text = node.children[0]?.value;

      addDefinition(file_path, metadata, link_text, node.url);
    });
  };
}

(async () => {
  const metadata = {};

  for await (const { f, parsed } of getMarkdownFiles(resolve('../../docs'))) {
    const title = parsed.title;
    const id = parsed.id;
    const slug = parsed.slug;
    const sidebar_position = parsed.sidebar_position;
    const [, file_path] = f.split('riak_docs/docs');

    metadata[file_path] = { title, id, slug, sidebar_position };

    await remark().use(gatherDefinitions, { file_path, metadata }).process(parsed.__content); 
  }

  writeFile('docs_metadata.json', JSON.stringify(metadata)); 
})();
