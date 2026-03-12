import { visit } from 'unist-util-visit';

export function rehypeFigure() {
  return function (tree) {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index === undefined) return;
      if (node.tagName !== 'p' || node.children.length !== 1) return;

      const child = node.children[0];
      if (child.type !== 'element' || child.tagName !== 'img') return;

      const caption = child.properties?.title || child.properties?.alt;
      if (!caption) return;

      parent.children[index] = {
        type: 'element',
        tagName: 'figure',
        properties: { className: ['content-figure'] },
        children: [
          child,
          {
            type: 'element',
            tagName: 'figcaption',
            properties: {},
            children: [{ type: 'text', value: String(caption) }]
          }
        ]
      };
    });
  };
}
