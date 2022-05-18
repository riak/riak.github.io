const fs = require('fs');
const remark = require('remark');
const visit = require('unist-util-visit');

const NUM_IMPORTS = 2;
//const NUM_INSERTED_BEFORE_BLOCK = 3 + NUM_IMPORTS;
const NUM_INSERTED_BEFORE_BLOCK = 3;
//const NUM_INSERTED_BEFORE_BLOCK = 2;

function calculateIndex(tree_index, block_index, section_sum) {
  return (tree_index + (NUM_INSERTED_BEFORE_BLOCK * block_index)) + (NUM_INSERTED_BEFORE_BLOCK * section_sum);
}

function transformCodeBlock(tree) {
  return tree => {
    const code_blocks = [];
    const sections = 
      tree.children
        .map((node, i) => ({ node, i }))
        .filter(({ node }) => node.type === 'code')
        .reduce((sections, { node, i: node_index }) => {
          // When multiple fenced code elements appear next to each other, group them together. 
          const num_sections = sections.length;
          const previous_section_index = num_sections - 1;
          const last_block = sections[previous_section_index];
          const new_block = { node, i: node_index };

          if (last_block === undefined) {
            sections.push([new_block]);

            return sections;
          }

          const { i: previous_i } = last_block[last_block.length - 1];

          if (node_index - 1 === previous_i) {
            sections[previous_section_index].push(new_block);

          } else {
            sections[num_sections] = [new_block];
          }

          return sections;
        }, []); 

    // If no repeated code sections found, return early
    if (sections.length === 0) {
      return;
    }

    //sections.map(blocks => console.log(blocks));

    /*
    const tab_imports = [
      { type: 'text', value: 'import Tabs from \'@theme/Tabs\';\n' },
      { type: 'text', value: 'import TabItem from \'@theme/TabItem\';\n' },
    ];

    //tree.children.splice(0, 0, ...tab_imports); 
    */

    let section_sum = 0;

    sections.forEach((blocks, section_i) => {
      const opening = { type: 'html', value: `<Tabs (section=${section_i})>` };
      const closing = { type: 'html', value: `</Tabs (section=${section_i})>` };

      // Calculate the number of repeated code sections and maintain the sum as we go. 
      // This ensures as we insert tab elements the initial tree indicies from sections are not 
      // out of date (as the tree is an array we insert elements into)

      // Add one to include this iteration 
      const previous_index = section_i === 0 ? 0 : section_i + 1;
      const thing = sections.slice(0, previous_index).length;
      const num_previous_sections = section_i === 0 ? 0 : sections[section_i - 1].length;

      section_sum += num_previous_sections;

      const last_block = blocks.length - 1;
      const section_start_index = calculateIndex(blocks[0].i - 1, 0, section_sum); 
      const section_end_index = calculateIndex(blocks[last_block].i, last_block, section_sum) + NUM_INSERTED_BEFORE_BLOCK;

      tree.children.splice(section_start_index, 0, opening); 

      blocks.forEach(({ code, i: tree_index }, block_i) => {
        const insert_index = calculateIndex(tree_index, block_i, section_sum);
        const opening_item = { type: 'html', value: `<TabItem(section=${section_i} - block=${block_i} - tree=${tree_index})>` };
        const closing_item = { type: 'html', value: `</TabItem(section=${section_i} - block=${block_i} - tree=${tree_index})>` };

        //console.log({ section_i, block_i, tree_index, num_previous_sections, insert_index });

        tree.children.splice(insert_index, 0, opening_item); 

        tree.children.splice(insert_index + NUM_INSERTED_BEFORE_BLOCK, 0, closing_item); 
      });

      tree.children.splice(section_end_index, 0, closing); 
    });

    tree.children.map((node, i) => console.log({ i: i, node }));
  };
}

(async () => {
  const content = fs.readFileSync('codeblock.md', 'utf8');

  const parsed = await remark()
    .use(transformCodeBlock)
    .process(content);

  //console.log(parsed);
})();
