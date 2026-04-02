import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    gradient: z.string().default('linear-gradient(135deg, rgba(200,245,66,0.1), rgba(168,214,32,0.08))'),
    draft: z.boolean().default(false),
  }),
});

const sections = defineCollection({
  type: 'content',
  schema: z.object({
    // site.md
    name: z.string().optional(),
    handle: z.string().optional(),
    jobTitle: z.string().optional(),
    siteUrl: z.string().optional(),
    // hero.md
    label: z.string().optional(),
    titleLine1: z.string().optional(),
    titleAccent: z.string().optional(),
    subtitle: z.string().optional(),
    // about.md
    title: z.string().optional(),
    // contact.md
    footerText: z.string().optional(),
    social: z
      .array(
        z.object({
          platform: z.string(),
          label: z.string(),
          url: z.string(),
          ariaLabel: z.string(),
        }),
      )
      .optional(),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    order: z.number(),
    tag: z.string(),
    title: z.string(),
    summary: z.string(),
    techStack: z.array(z.string()),
    gradient: z.string(),
    liveUrl: z.string().optional(),
    githubUrl: z.string().optional(),
  }),
});

export const collections = { blog, sections, projects };
