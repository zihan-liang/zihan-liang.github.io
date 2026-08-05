import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const linkSchema = z.object({
  label: z.string().min(1),
  url: z.url(),
});

const outputs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/outputs' }),
  schema: z.object({
    type: z.enum(['preprint', 'poster', 'technical-report']),
    title: z.string().min(1),
    authors: z.array(z.string().min(1)).min(1),
    year: z.number().int().min(2000),
    venue: z.string().min(1),
    status: z.string().min(1),
    summary: z.string().min(1),
    links: z.array(linkSchema),
    featured: z.boolean(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string().min(1),
    period: z.string().min(1),
    role: z.string().min(1),
    category: z.enum(['time-series', 'nlp-social-computing', 'mathematical-modeling', 'robotics', 'scientific-visualization', 'software']),
    summary: z.string().min(1),
    contributions: z.array(z.string().min(1)).min(1),
    methods: z.array(z.string().min(1)).min(1),
    results: z.array(z.string().min(1)).min(1),
    links: z.array(linkSchema),
    featured: z.boolean(),
  }),
});

const honors = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/honors' }),
  schema: z.object({
    title: z.string().min(1),
    organization: z.string().min(1),
    year: z.number().int().min(2000),
    project: z.string().min(1),
    kind: z.enum(['award', 'presentation']),
    featured: z.boolean(),
  }),
});

const updates = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/updates' }),
  schema: z.object({
    date: z.string().regex(/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/),
    title: z.string().min(1),
    description: z.string().min(1),
    link: z.url().optional(),
  }),
});

export const collections = { outputs, projects, honors, updates };
