const fs = require('fs');
const remark = require('remark');
const visit = require('unist-util-visit');
const config = require('./config.json');

function addInsert(inserts, node, counter) {
  const new_counter = counter + 1;

  inserts.push({ index: new_counter, node });

  return new_counter;
}

function formatLanguage(node_lang) {
  if (node_lang === null) {
    return { label: '', value: '' };
  }

  const lowered = node_lang.toLowerCase();
  const config_name = config.languages[node_lang];
  const lang = config_name !== undefined ? config_name : node_lang;  
  const label = ` label="${lang[0].toUpperCase()}${lang.slice(1)}"`;
  const value = ` value="${lang}"`;

  return { label, value }; 
}

function createTabItem(node, is_first) {
  const { label, value } = formatLanguage(node.lang);
  const default_attribute = is_first ? ' default' : '';

  return { type: 'html', value: `<TabItem${label}${value}${default_attribute}>` };
}

function transformCodeBlock() {
  const import_tab = { type: 'text', value: 'import Tabs from \'@theme/Tabs\';\n' };
  const import_tab_item = { type: 'text', value: 'import TabItem from \'@theme/TabItem\';\n' };
  const opening_tabs = { type: 'html', value: '<Tabs>' };
  const closing_tabs = { type: 'html', value: '</Tabs>' };
  //const opening_tab_item = { type: 'html', value: '<TabItem>' };
  const closing_tab_item = { type: 'html', value: '</TabItem>' };

  return (tree) => {
    const inserts = [];
    const insert_imports = tree.children.some(node => node.type === 'code');

    if (insert_imports) {
      // Always insert the imports on the first and second line
      inserts.push({ index: 0, node: import_tab });

      inserts.push({ index: 1, node: import_tab_item });
    }

    // Set counter 2 in order to skip the imports
    let counter = 2;
    let is_sequential = false;

    for (const [i, node] of tree.children.entries()) {
      const previous = tree.children[i - 1];

      if (node.type !== 'code' && is_sequential) {
        is_sequential = false;

        counter = addInsert(inserts, closing_tabs, counter) + 1;

        continue;
      }

      if (node.type === 'code' && previous?.type === 'code') {
        if (!is_sequential) {
          // is_default as the previous node is a code but not marked as sequential 
          // (i.e., the first code block in a sequence)
          const opening_tab_item = createTabItem(previous, true);

          counter = addInsert(inserts, opening_tabs, counter);
          
          // Insert for previous entry
          counter = addInsert(inserts, opening_tab_item, counter);

          counter = addInsert(inserts, closing_tab_item, counter + 1);

          is_sequential = true;
        }

        const opening_tab_item = createTabItem(node, false);

        // Insert for current entry
        counter = addInsert(inserts, opening_tab_item, counter);

        counter = addInsert(inserts, closing_tab_item, counter + 1);
      }
    }

    if (is_sequential) {
      counter = addInsert(inserts, closing_tabs, counter);
    }

    inserts
      .sort(({ index: a, index: b }) => b - a)
      .forEach(({ index, node }) => tree.children.splice(index, 0, node));
  };
}

(async () => {
  const content = fs.readFileSync('codeblock.md', 'utf8');

  const parsed = await remark()
    .use(transformCodeBlock)
    .process(content);

  console.log(parsed.contents);
})();
