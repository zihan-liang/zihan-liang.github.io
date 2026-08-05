# Zihan Liang Academic Website v1 — Approved Design

## Purpose

Publish an English-only academic portfolio for Zihan Liang at `https://zihan-liang.github.io`. The site positions Zihan as an undergraduate AI researcher at Xi’an Jiaotong-Liverpool University whose work focuses on machine learning for time-series forecasting and sequential social-media risk assessment.

## Information architecture

The site contains seven directly addressable routes: `/`, `/research/`, `/outputs/`, `/projects/`, `/honors/`, `/cv/`, and `/404.html`. A shared header exposes the six primary pages through an accessible desktop navigation and keyboard/touch mobile menu. A shared footer repeats essential contact and navigation links without duplicating factual content.

## Content model

Astro content collections provide validated records for outputs, projects, honors, and updates. A validated profile data module is the single source for identity, biography, research themes, contact details, portrait, and CV path. Pages query these sources and arrange them for their route; factual prose is not copied into multiple components.

Only claims marked `verified` or `qualified` and authorized for the website in the private evidence register may appear. Qualified team contributions remain explicitly qualified. The SSRN preprint and ICSC poster are separate outputs. The suicide-risk result is reported as weighted F1 0.46 versus 0.43 for a RoBERTa baseline under five-fold user-level evaluation. Au20 work is limited to scientific visualization and reporting support. Disallowed personal data, private paths and repositories, unsupported awards, and unsupported rankings never enter public source or generated HTML.

## Visual system

The visual direction is editorial and restrained: warm off-white surfaces, charcoal and navy typography, teal accents, thin rules, compact cards, and subtle shadows without gradients. A self-hosted open-source serif display face is paired with a readable self-hosted sans face. The approved portrait anchors the homepage identity area. Layout and type scale fluidly across 360, 768, and 1440 pixel viewports.

## Components and behavior

`BaseLayout` owns canonical metadata, Open Graph data, the social preview image, structured `Person` data, the shared header/footer, and the only navigation script. The mobile menu uses a real button, synchronizes `aria-expanded`, closes on Escape or link activation, and resets when the desktop breakpoint is reached. Reduced-motion preferences remove nonessential transitions.

Reusable components render section headings, output cards, project cards, honor rows, update rows, and external-link affordances. Pages remain statically generated and require no client framework.

## Search and recovery

Astro’s official sitemap integration emits the sitemap from the canonical site URL. `robots.txt` points crawlers to it. The branded 404 page offers recovery links and is emitted as `/404.html`. Every page receives a canonical URL, description, Open Graph card, and ordered semantic headings.

## Delivery and verification

An npm lockfile is committed. The official Astro GitHub Pages workflow builds with `withastro/action@v3` and deploys with `actions/deploy-pages@v4` from `main`. Automated acceptance checks inspect the production output for all routes, metadata, sitemap/robots, byte-identical CV, privacy exclusions, and authorized content. Browser QA covers responsive overflow, navigation, focus, links, and representative page rendering. After publication, every route and key asset is verified against the live origin.
