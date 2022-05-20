const fs = require('fs');
const remark = require('remark');
const visit = require('unist-util-visit');

function addInsert(inserts, node, counter) {
  const new_counter = counter + 1;

  //console.log({ node, str: `${counter} + 1 -> ${new_counter}` });

  inserts.push({ index: counter + 1, node });

  return counter + 1;
}

function transformCodeBlock() {
  return (tree) => {
    const inserts = [];
    const opening_tabs = { type: 'html', value: '<Tabs>' };
    const closing_tabs = { type: 'html', value: '</Tabs>' };
    const opening_tab_item = { type: 'html', value: '<TabItem>' };
    const closing_tab_item = { type: 'html', value: '</TabItem>' };

    let is_sequential = false;
    let counter = 0;

    for (const [i, node] of tree.children.entries()) {
      const previous_index = i - 1;
      const previous = tree.children[previous_index];

      if (node.type !== 'code' && is_sequential) {
        is_sequential = false;

        counter = addInsert(inserts, closing_tabs, counter) + 1;

        continue;
      }

      if (node.type === 'code' && previous?.type === 'code') {
        console.log(`here: ${counter}`);

        if (!is_sequential) {
          is_sequential = true;

          counter = addInsert(inserts, opening_tabs, counter);
        }

        // Insert for previous entry
        counter = addInsert(inserts, opening_tab_item, counter);

        counter = addInsert(inserts, closing_tab_item, counter + 1);

        // Insert for current entry
        counter = addInsert(inserts, opening_tab_item, counter);

        counter = addInsert(inserts, closing_tab_item, counter + 1);
      }
    }

    if (is_sequential) {
      counter = addInsert(inserts, closing_tabs, counter);
    }

    const sorted = inserts.sort(({ index: a, index: b }) => a - b);

    /*
    const sorted = [
      { index: 1, node: opening_tabs },
        { index: 2, node: opening_tab_item },
        { index: 4, node: closing_tab_item },
        { index: 5, node: opening_tab_item },
        { index: 7, node: closing_tab_item },
      { index: 8, node: closing_tabs },
      { index: 10, node: opening_tabs },
        { index: 11, node: opening_tab_item },
        { index: 13, node: closing_tab_item },
        { index: 14, node: opening_tab_item },
        { index: 16, node: closing_tab_item },
      { index: 17, node: closing_tabs },
    ];
    */

    console.log(sorted);

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
