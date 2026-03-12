import { getCollection, type CollectionEntry } from 'astro:content';
import { slugify } from './format';
import { COLLECTION_LABELS } from '../site.config';

export const collectionNames = ['blog', 'courses', 'research', 'papers', 'datasets'] as const;
export type ContentCollectionName = (typeof collectionNames)[number];

export type ContentEntryUnion =
  | CollectionEntry<'blog'>
  | CollectionEntry<'courses'>
  | CollectionEntry<'research'>
  | CollectionEntry<'papers'>
  | CollectionEntry<'datasets'>;

export interface TaggedEntry {
  collection: ContentCollectionName;
  entry: ContentEntryUnion;
}

function sortByDateDesc<T extends { data: { date?: Date } }>(entries: T[]) {
  return [...entries].sort((a, b) => {
    const left = a.data.date ? new Date(a.data.date).getTime() : 0;
    const right = b.data.date ? new Date(b.data.date).getTime() : 0;
    return right - left;
  });
}

export async function getSortedCollection(name: ContentCollectionName) {
  const entries = await getCollection(name, ({ data }) => !data.draft);
  return sortByDateDesc(entries);
}

export async function getLatestBlogPosts(limit = 5) {
  const entries = await getSortedCollection('blog');
  return entries.slice(0, limit);
}

export async function getFeaturedNotes(limit = 4) {
  const results = await Promise.all(
    collectionNames
      .filter((collection) => collection !== 'blog')
      .map(async (collection) => {
        const entries = await getSortedCollection(collection);
        return entries.filter((entry) => entry.data.featured).map((entry) => ({ collection, entry }));
      })
  );

  const featured = results.flat();
  if (featured.length >= limit) return featured.slice(0, limit);

  const fallback = await Promise.all(
    collectionNames
      .filter((collection) => collection !== 'blog')
      .map(async (collection) => {
        const entries = await getSortedCollection(collection);
        return entries.slice(0, 2).map((entry) => ({ collection, entry }));
      })
  );

  const merged = [...featured, ...fallback.flat()];
  const deduped = merged.filter(
    (item, index, array) =>
      array.findIndex(
        (candidate) =>
          candidate.collection === item.collection && candidate.entry.slug === item.entry.slug
      ) === index
  );

  return deduped.slice(0, limit);
}

export function getNeighbors<T extends { slug: string }>(entries: T[], slug: string) {
  const index = entries.findIndex((entry) => entry.slug === slug);
  if (index === -1) return { previous: null, next: null };

  return {
    previous: entries[index + 1] ?? null,
    next: entries[index - 1] ?? null
  };
}

export async function getAllTags() {
  const allEntries = await Promise.all(
    collectionNames.map(async (collection) => {
      const entries = await getCollection(collection, ({ data }) => !data.draft);
      return entries.map((entry) => ({ collection, entry }));
    })
  );

  const tagMap = new Map<string, number>();

  for (const item of allEntries.flat()) {
    for (const tag of item.entry.data.tags ?? []) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }
  }

  return [...tagMap.entries()]
    .map(([name, count]) => ({ name, slug: slugify(name), count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getEntriesByTag(tagSlug: string): Promise<TaggedEntry[]> {
  const tagged = await Promise.all(
    collectionNames.map(async (collection) => {
      const entries = await getCollection(collection, ({ data }) => !data.draft);
      return entries
        .filter((entry) => (entry.data.tags ?? []).some((tag) => slugify(tag) === tagSlug))
        .map((entry) => ({ collection, entry }) as TaggedEntry);
    })
  );

  return tagged.flat().sort((a, b) => {
    const left = a.entry.data.date ? new Date(a.entry.data.date).getTime() : 0;
    const right = b.entry.data.date ? new Date(b.entry.data.date).getTime() : 0;
    return right - left;
  });
}

export function getCollectionLabel(collection: ContentCollectionName) {
  return COLLECTION_LABELS[collection];
}
