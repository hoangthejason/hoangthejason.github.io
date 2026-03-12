import { visit } from 'unist-util-visit';

const titles = {
  note: 'Note',
  info: 'Info',
  tip: 'Tip',
  important: 'Important',
  warning: 'Warning',
  caution: 'Caution'
};

export function remarkCallouts() {
  return function (tree) {
    visit(tree, (node) => {
      if (node.type !== 'containerDirective') return;
      if (!Object.hasOwn(titles, node.name)) return;

      const title = node.attributes?.title || titles[node.name];
      node.data ||= {};
      node.data.hName = 'aside';
      node.data.hProperties = {
        className: ['callout', `callout-${node.name}`],
        'data-callout-type': node.name,
        'data-callout-title': title,
        'aria-label': `${title} callout`
      };
    });
  };
}
