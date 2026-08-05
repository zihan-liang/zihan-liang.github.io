import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://zihan-liang.github.io',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => page !== 'https://zihan-liang.github.io/404.html',
      namespaces: {
        news: false,
        video: false,
      },
    }),
  ],
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
