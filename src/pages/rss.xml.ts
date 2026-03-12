import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../site.config';

export async function GET() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: SITE.url,
    items: posts
      .sort((a, b) => (b.data.date?.getTime() || 0) - (a.data.date?.getTime() || 0))
      .map((post) => ({
        title: post.data.title,
        description: post.data.description || '',
        pubDate: post.data.date,
        link: `/blog/${post.slug}`
      })),
    customData: `<language>${SITE.locale}</language>`
  });
}
