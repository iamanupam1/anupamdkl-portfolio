import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    gradient: z
      .string()
      .default('linear-gradient(135deg, rgba(200,245,66,0.1), rgba(168,214,32,0.08))'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
