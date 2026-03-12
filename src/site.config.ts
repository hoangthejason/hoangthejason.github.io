export const SITE = {
  title: 'Hoang The Jason',
  description: 'Personal academic blog and knowledge hub for research notes, papers, datasets, and technical writing.',
  url: 'https://hoangthejason.github.io',
  author: 'Hoang The Jason',
  locale: 'en-US',
  ogImage: '/social-card.png'
} as const;

export const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/courses', label: 'Courses' },
  { href: '/research', label: 'Research' },
  { href: '/papers', label: 'Papers' },
  { href: '/datasets', label: 'Datasets' },
  { href: '/tags', label: 'Tags' },
  { href: '/about', label: 'About' }
] as const;

export const COLLECTION_LABELS = {
  blog: 'Blog',
  courses: 'Course Note',
  research: 'Research Note',
  papers: 'Paper Note',
  datasets: 'Dataset Note'
} as const;
