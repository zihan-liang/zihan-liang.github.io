export interface ResearchProject {
  slug: string;
  title: string;
  period: string;
  role: string;
  category: string;
  summary: string;
  homepageSummary: string;
  contributions: string[];
  methods: string[];
  results: string[];
  links: Array<{ label: string; url: string }>;
  detailClaimIds: string[];
  homepageClaimIds: string[];
}

export const researchProjects: ResearchProject[] = [
  {
    slug: 'mixed-frequency-transformer',
    title: 'Mixed-Frequency Transformer for USD/CNH Volatility Forecasting',
    period: 'Aug 2025 – Jan 2026',
    role: 'Model developer and third author',
    category: 'Time-series AI',
    summary: 'A multi-stream Transformer that aligns daily technical signals with lower-frequency macroeconomic and geopolitical information for multi-horizon volatility forecasting.',
    homepageSummary: 'A mixed-frequency Transformer study presented by the team at IBEC 2026 and released as an SSRN preprint.',
    contributions: [
      'Implemented temporal and positional encodings.',
      'Proposed cross-attention between daily technical and lower-frequency macroeconomic and geopolitical streams.',
      'Evaluated 1-, 5-, and 10-day forecast horizons.',
      'Produced Integrated Gradients analyses.',
    ],
    methods: ['Mixed-frequency learning', 'Cross-attention', 'Multi-horizon forecasting', 'Integrated Gradients'],
    results: [
      'The team presented the research at IBEC 2026.',
      'Contributed model-development and evaluation work to the SSRN preprint.',
    ],
    links: [
      { label: 'IBEC 2026', url: 'https://ibec-info.org/2026/' },
      { label: 'Preprint', url: 'https://ssrn.com/abstract=5418894' },
    ],
    detailClaimIds: ['fx-preprint', 'fx-project-contributions', 'fx-ibec-presentation'],
    homepageClaimIds: ['fx-preprint', 'fx-ibec-presentation'],
  },
  {
    slug: 'sequential-suicide-risk',
    title: 'Sequential Social-Media Suicide-Risk Assessment',
    period: '2025',
    role: 'Lead student researcher',
    category: 'NLP & social computing',
    summary: 'A hierarchical Twitter-RoBERTa, Bi-GRU, and attention model for user-level risk assessment from longitudinal social-media histories.',
    homepageSummary: 'A hierarchical user-level model that achieved weighted F1 0.46 versus 0.43 for a RoBERTa baseline under five-fold user-level evaluation.',
    contributions: [
      'Built the data pipeline and preprocessing workflow.',
      'Developed the hierarchical sequence model.',
      'Evaluated the model with five-fold user-level splits.',
      'Communicated the work through a technical report and an ICSC 2025 poster.',
    ],
    methods: ['Twitter-RoBERTa', 'Bi-GRU sequence modeling', 'Hierarchical attention', 'Five-fold user-level evaluation'],
    results: ['Achieved weighted F1 0.46 versus 0.43 for a RoBERTa baseline.'],
    links: [
      { label: 'Code', url: 'https://github.com/zihan-liang/public-mental-health-monitoring' },
      { label: 'Poster', url: 'https://github.com/zihan-liang/ICSC2025-poster' },
    ],
    detailClaimIds: ['suicide-poster', 'suicide-technical-report', 'suicide-model-result'],
    homepageClaimIds: ['suicide-poster', 'suicide-model-result'],
  },
];
