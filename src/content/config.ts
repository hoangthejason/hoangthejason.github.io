import { defineCollection, z } from 'astro:content';

const baseContentSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.coerce.date().optional(),
  updatedDate: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  toc: z.boolean().default(true),
  comments: z.boolean().default(false),
  readingTime: z.number().optional(),
  wordCount: z.number().optional(),
  heroImage: z.string().optional(),
  bibliography: z.string().optional(),
  csl: z.string().optional(),
  lang: z.string().default('en-US')
});

const blog = defineCollection({
  type: 'content',
  schema: baseContentSchema.extend({
    category: z.enum(['machine-learning', 'programming', 'research', 'personal']).default('research'),
    comments: z.boolean().default(true)
  })
});

const courses = defineCollection({
  type: 'content',
  schema: baseContentSchema.extend({
    course: z.string(),
    kind: z.enum(['lecture-notes', 'assignment', 'summary']).default('lecture-notes')
  })
});

const research = defineCollection({
  type: 'content',
  schema: baseContentSchema.extend({
    topic: z.string()
  })
});

const papers = defineCollection({
  type: 'content',
  schema: baseContentSchema.extend({
    authors: z.array(z.string()).default([]),
    paperLink: z.string().url(),
    problem: z.string(),
    method: z.string(),
    results: z.string(),
    limitations: z.string(),
    notes: z.string().optional()
  })
});

const datasets = defineCollection({
  type: 'content',
  schema: baseContentSchema.extend({
    size: z.string(),
    tasks: z.array(z.string()).default([]),
    downloadLinks: z
      .array(
        z.object({
          label: z.string(),
          url: z.string().url()
        })
      )
      .default([]),
    notes: z.string().optional()
  })
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    intro: z.string().optional(),
    researchInterests: z.array(z.string()).default([]),
    skills: z.array(z.string()).default([]),
    links: z
      .array(
        z.object({
          label: z.string(),
          url: z.string().url()
        })
      )
      .default([])
  })
});

export const collections = {
  blog,
  courses,
  research,
  papers,
  datasets,
  pages
};
