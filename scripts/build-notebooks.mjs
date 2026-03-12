import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

const inputDir = path.resolve('src/notebooks');
const outputDir = path.resolve('src/generated/notebooks');

const sanitizeOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    'img',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'span',
    'figure',
    'figcaption',
    'math',
    'semantics',
    'mrow',
    'mi',
    'mn',
    'mo',
    'annotation'
  ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    '*': ['class', 'id'],
    a: ['href', 'name', 'target', 'rel'],
    img: ['src', 'alt', 'title'],
    span: ['class']
  }
};

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function getNotebookFiles(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const resolved = path.join(dir, entry.name);
        if (entry.isDirectory()) return getNotebookFiles(resolved);
        return resolved.endsWith('.ipynb') ? [resolved] : [];
      })
    );
    return files.flat();
  } catch {
    return [];
  }
}

function toText(source) {
  return Array.isArray(source) ? source.join('') : source || '';
}

function parseOutputs(outputs = []) {
  return outputs.flatMap((output) => {
    if (output.output_type === 'stream') {
      return [{ outputType: 'text', text: toText(output.text) }];
    }

    if (output.output_type === 'error') {
      return [{ outputType: 'error', text: (output.traceback || []).join('\n') || output.evalue || 'Execution error' }];
    }

    const data = output.data || {};
    if (data['text/plain']) {
      return [{ outputType: 'text', text: toText(data['text/plain']) }];
    }

    if (data['image/png']) {
      return [{ outputType: 'image', mimeType: 'image/png', data: toText(data['image/png']) }];
    }

    if (data['image/jpeg']) {
      return [{ outputType: 'image', mimeType: 'image/jpeg', data: toText(data['image/jpeg']) }];
    }

    return [];
  });
}

async function markdownToHtml(source) {
  const raw = await marked.parse(source);
  return sanitizeHtml(raw, sanitizeOptions);
}

async function buildNotebook(filePath) {
  const raw = JSON.parse(await fs.readFile(filePath, 'utf8'));
  const baseName = path.basename(filePath, '.ipynb');
  const slug = slugify(baseName);

  const notebook = {
    slug,
    title: baseName,
    description: '',
    date: undefined,
    tags: [],
    section: 'Notebook',
    cells: []
  };

  const cells = raw.cells || [];
  let frontmatterConsumed = false;

  for (const cell of cells) {
    const source = toText(cell.source);

    if (!frontmatterConsumed && cell.cell_type === 'markdown' && source.trim().startsWith('---')) {
      const parsed = matter(source);
      notebook.title = parsed.data.title || notebook.title;
      notebook.description = parsed.data.description || '';
      notebook.date = parsed.data.date || undefined;
      notebook.tags = parsed.data.tags || [];
      notebook.section = parsed.data.section || 'Notebook';
      frontmatterConsumed = true;

      const remaining = parsed.content.trim();
      if (remaining) {
        notebook.cells.push({
          cellType: 'markdown',
          html: await markdownToHtml(remaining)
        });
      }
      continue;
    }

    if (cell.cell_type === 'markdown') {
      notebook.cells.push({
        cellType: 'markdown',
        html: await markdownToHtml(source)
      });
      continue;
    }

    if (cell.cell_type === 'code') {
      notebook.cells.push({
        cellType: 'code',
        source,
        language: raw.metadata?.language_info?.name || 'python',
        outputs: parseOutputs(cell.outputs)
      });
    }
  }

  await fs.writeFile(path.join(outputDir, `${slug}.json`), JSON.stringify(notebook, null, 2), 'utf8');
}

await ensureDir(outputDir);

const files = await getNotebookFiles(inputDir);
await Promise.all(files.map(buildNotebook));
