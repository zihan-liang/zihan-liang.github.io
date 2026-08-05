import { z } from 'astro/zod';

export const profileSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  institution: z.string().min(1),
  biography: z.string().min(1),
  researchThemes: z.array(z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  })).min(1),
  email: z.email(),
  github: z.url(),
  cvPath: z.string().startsWith('/'),
  portraitPath: z.string().startsWith('/'),
  portraitAlt: z.string().min(1),
});

export const profile = profileSchema.parse({
  name: 'Zihan Liang',
  title: 'Undergraduate AI Researcher at XJTLU',
  institution: "Xi'an Jiaotong-Liverpool University",
  biography: 'I work on machine learning for mixed-frequency financial time-series forecasting and sequential social-media risk assessment. My practice connects careful data processing with model implementation, evaluation, interpretability, and research communication.',
  researchThemes: [
    {
      title: 'Time-series and quantitative AI',
      description: 'Mixed-frequency fusion, multi-horizon forecasting, cross-attention, and attribution for financial time series.',
    },
    {
      title: 'NLP and social computing',
      description: 'Hierarchical sequence modeling for user-level mental-health risk assessment from longitudinal social-media histories.',
    },
    {
      title: 'Reproducible research engineering',
      description: 'Auditable pipelines that connect preprocessing, implementation, evaluation, visualization, and publication assets.',
    },
  ],
  email: 'Zihan.Liang24@student.xjtlu.edu.cn',
  github: 'https://github.com/zihan-liang',
  cvPath: '/assets/Zihan_Liang_Academic_CV.pdf',
  portraitPath: '/assets/portrait.jpg',
  portraitAlt: 'Portrait of Zihan Liang',
});
