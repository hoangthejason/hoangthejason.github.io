import { visit } from 'unist-util-visit';

function flattenText(node) {
  if (!node) return '';
  if (node.type === 'text') return node.value;
  if (!Array.isArray(node.children)) return '';
  return node.children.map(flattenText).join('');
}

export function rehypeMermaid() {
  return function (tree) {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index === undefined) return;
      if (node.tagName !== 'pre') return;

      const code = node.children?.[0];
      if (!code || code.type !== 'element' || code.tagName !== 'code') return;

      const className = code.properties?.className || [];
      if (!Array.isArray(className) || !className.includes('language-mermaid')) return;

      parent.children[index] = {
        type: 'element',
        tagName: 'div',
        properties: {
          className: ['mermaid'],
          role: 'img',
          'aria-label': 'Mermaid diagram'
        },
        children: [{ type: 'text', value: flattenText(code).trim() }]
      };
    });
  };
}
