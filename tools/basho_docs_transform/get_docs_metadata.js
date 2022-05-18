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

function gatherDefinitions({ file_path, metadata }) {
  return tree => {
    visit(tree, 'definition', node => {
      metadata[file_path].definitions ??= {};
      /*
      if (metadata[file_path]?.definitions === undefined) {
        metadata[file_path].definitions = {};
      }
      */

      metadata[file_path].definitions[node.identifier] = node.url;
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
