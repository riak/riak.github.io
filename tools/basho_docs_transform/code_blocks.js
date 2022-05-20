const fs = require('fs');
const remark = require('remark');
const visit = require('unist-util-visit');

function addInsert(inserts, node, counter) {
  const new_counter = counter + 1;

  inserts.push({ index: new_counter, node });

  return new_counter;
}

function transformCodeBlock() {
  const import_tab = { type: 'text', value: 'import Tabs from \'@theme/Tabs\';\n' };
  const import_tab_item = { type: 'text', value: 'import TabItem from \'@theme/TabItem\';\n' };
  const opening_tabs = { type: 'html', value: '<Tabs>' };
  const closing_tabs = { type: 'html', value: '</Tabs>' };
  const opening_tab_item = { type: 'html', value: '<TabItem>' };
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
          counter = addInsert(inserts, opening_tabs, counter);
          
          // Insert for previous entry
          counter = addInsert(inserts, opening_tab_item, counter);

          counter = addInsert(inserts, closing_tab_item, counter + 1);

          is_sequential = true;
        }

        // Insert for current entry
        counter = addInsert(inserts, opening_tab_item, counter);

        counter = addInsert(inserts, closing_tab_item, counter + 1);
      }
    }

    if (is_sequential) {
      counter = addInsert(inserts, closing_tabs, counter);
    }

    const sorted = inserts.sort(({ index: a, index: b }) => b - a);

    /*
    const sorted = [
      { index: 0, node: import_tab },
      { index: 1, node: import_tab_item },
      { index: 3, node: opening_tabs },
        { index: 4, node: opening_tab_item },
        { index: 6, node: closing_tab_item },
        { index: 7, node: opening_tab_item },
        { index: 9, node: closing_tab_item },
      { index: 10, node: closing_tabs },
      { index: 12, node: opening_tabs },
        { index: 13, node: opening_tab_item },
        { index: 15, node: closing_tab_item },
        { index: 16, node: opening_tab_item },
        { index: 18, node: closing_tab_item },
      { index: 19, node: closing_tabs },
    ];
    */

    sorted.forEach(({ index, node }) => tree.children.splice(index, 0, node));
  };
}


(async () => {
  const content = fs.readFileSync('codeblock.md', 'utf8');

  const parsed = await remark()
    .use(transformCodeBlock)
    .process(content);

  console.log(parsed.contents);
})();
