export function formatDate(value?: Date) {
  if (!value) return '';
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium'
  }).format(value);
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
