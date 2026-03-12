import { visit } from 'unist-util-visit';

export function remarkReadingTime() {
  return function (tree, file) {
    let text = '';

    visit(tree, 'text', (node) => {
      text += ` ${node.value}`;
    });

    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 220));

    file.data.astro ??= {};
    file.data.astro.frontmatter ??= {};
    file.data.astro.frontmatter.readingTime = minutes;
    file.data.astro.frontmatter.wordCount = words;
  };
}
