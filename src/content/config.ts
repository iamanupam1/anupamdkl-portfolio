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
      .default('linear-gradient(135deg, rgba(99,102,241,0.3), rgba(168,85,247,0.3))'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
