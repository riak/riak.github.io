const fs = require('fs');
const remark = require('remark');
const yamlFront = require('yaml-front-matter');
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
  const lang = config_name || node_lang;
  const label = ` label="${lang}"`;
  const value = ` value="${lang.toLowerCase()}"`;

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
  const closing_tab_item = { type: 'html', value: '</TabItem>' };

  return (tree) => {
    const inserts = [];

    // Set counter 2 in order to skip the imports

    let counter = 2;
    let non_code_sequence_gap = -1; // Set to -1 so that the gap is 0-indexed instead of 1
    let is_sequential = false;
    let any_sequences = false;

    for (const [i, node] of tree.children.entries()) {
      const previous = tree.children[i - 1];

      if (node?.type !== 'code') {
        non_code_sequence_gap += 1;

        if (is_sequential) {
          is_sequential = false;
        }
      }

      // Increment non-sequence code blocks
      if (node.type === 'code' && previous?.type !== 'code') {
        non_code_sequence_gap += 1;
      }

      if (node.type === 'code' && previous?.type === 'code') {
        if (!any_sequences) {
          // Always insert the imports on the first and second line
          inserts.push({ index: 0, node: import_tab });

          inserts.push({ index: 1, node: import_tab_item });

          any_sequences = true;
        }

        if (!is_sequential) {
          const opening_tab_item = createTabItem(previous, true);

          counter += non_code_sequence_gap - 1;

          non_code_sequence_gap = 0;

          counter = addInsert(inserts, opening_tabs, counter);

          // Insert for previous entry
          counter = addInsert(inserts, opening_tab_item, counter);

          counter = addInsert(inserts, closing_tab_item, counter + 1);

          is_sequential = true;
        }

        const opening_tab_item = createTabItem(node, false);
        const next = tree.children[i + 1];

        // Insert for current entry
        counter = addInsert(inserts, opening_tab_item, counter);

        if (next?.type !== 'code') {
          counter = addInsert(inserts, closing_tab_item, counter + 1);
          counter = addInsert(inserts, closing_tabs, counter);

          is_sequential = false;
        } else {
          counter = addInsert(inserts, closing_tab_item, counter + 1);
        }
      }
    }

    const sorted = inserts.sort(({ index: a, index: b }) => a - b);

    sorted.forEach(({ index, node }) => tree.children.splice(index, 0, node));
  };
}

exports.transformCodeBlock = transformCodeBlock;
