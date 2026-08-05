# Zihan Liang Academic Website v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build, publish, and verify Zihan Liang’s validated Astro academic website at `https://zihan-liang.github.io`.

**Architecture:** Astro statically generates seven routes from validated content collections and a typed profile module. Shared Astro components and vanilla CSS provide the editorial visual system, while a single progressive-enhancement navigation script supplies the only client behavior.

**Tech Stack:** Astro, strict TypeScript, Zod-backed content collections, vanilla CSS, Node’s test runner, npm, GitHub Actions Pages.

## Global Constraints

- English only in v1.
- Use only website-authorized verified or qualified claims from the private evidence register.
- Never publish the evidence register, its private source paths, private repositories, student ID, DOB, phone number, certificate identifiers, or explicitly excluded claims.
- Use the GitHub username `zihan-liang` everywhere.
- Report weighted F1 0.46 versus 0.43 RoBERTa baseline under five-fold user-level evaluation.
- Keep SSRN preprint and ICSC poster distinct; qualify MCM as team/co-authored work; describe Au20 only as scientific visualization/reporting support.
- Use npm and commit `package-lock.json`.
- Deploy from `main` with Astro’s official GitHub Pages workflow.

---

### Task 1: Establish testable Astro foundation

**Files:**
- Create: `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig.json`
- Create: `tests/site.test.mjs`
- Create: `.gitignore`

**Interfaces:**
- Produces: npm scripts `build`, `check`, `test`, and `qa`; a production-output acceptance suite reading `dist/`.

- [ ] Write acceptance tests for required route files, canonical metadata, privacy exclusions, sitemap/robots, structured data, responsive CSS contracts, the downloadable CV hash, and mobile-navigation semantics.
- [ ] Run `npm test` and confirm failure because the production site does not exist.
- [ ] Install Astro, the official sitemap integration, and type checking dependencies with npm; configure strict TypeScript and the canonical `site` URL.
- [ ] Run `npm run check` and fix configuration errors.

### Task 2: Implement validated content and assets

**Files:**
- Create: `src/content.config.ts`, `src/data/profile.ts`
- Create: `src/content/outputs/*.md`, `src/content/projects/*.md`, `src/content/honors/*.md`, `src/content/updates/*.md`
- Create: `public/assets/portrait.jpg`, `public/assets/Zihan_Liang_Academic_CV.pdf`, `public/assets/fonts/*`

**Interfaces:**
- Produces: validated `outputs`, `projects`, `honors`, and `updates` collections plus `profile` for all routes.

- [ ] Add collection schemas matching every required content interface and a typed profile schema.
- [ ] Populate only the authorized website claims and public links.
- [ ] Copy the approved portrait and final two-page CV into public assets.
- [ ] Add self-hosted open-source serif and sans font files with license notices.
- [ ] Run `npm run check` and resolve schema or type failures.

### Task 3: Build the shared presentation system

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/{SiteHeader,SiteFooter,SectionHeading,OutputCard,ProjectCard,HonorRow,UpdateRow}.astro`
- Create: `src/styles/global.css`
- Create: `public/og-card.png`

**Interfaces:**
- Consumes: `profile` and collection entry types.
- Produces: metadata-rich page shell, responsive navigation, and reusable content renderers.

- [ ] Implement the semantic shared layout with canonical, Open Graph, sitemap, and JSON-LD Person metadata.
- [ ] Implement the accessible desktop/mobile navigation with `aria-expanded`, Escape close, focus visibility, and reduced-motion support.
- [ ] Implement tokens and responsive layout styles for 360, 768, and 1440 pixel widths.
- [ ] Create and inspect one bespoke sitewide social card, then wire it into metadata.
- [ ] Run `npm run check` and correct component/type issues.

### Task 4: Implement the seven routes

**Files:**
- Create: `src/pages/index.astro`, `src/pages/research.astro`, `src/pages/outputs.astro`, `src/pages/projects.astro`, `src/pages/honors.astro`, `src/pages/cv.astro`, `src/pages/404.astro`, `src/pages/robots.txt.ts`

**Interfaces:**
- Consumes: shared layout/components, profile, and all collections.
- Produces: `/`, `/research/`, `/outputs/`, `/projects/`, `/honors/`, `/cv/`, `/404.html`, and `/robots.txt`.

- [ ] Build the homepage identity, biography, research themes, featured outputs, recent milestones, and contact actions from data.
- [ ] Build research, outputs, projects, honors, and CV pages from validated data.
- [ ] Build branded recovery and robots routes.
- [ ] Run `npm run build`, then run `npm test` and fix failures until green.

### Task 5: Perform local browser and artifact QA

**Files:**
- Modify only files implicated by verified QA defects.

**Interfaces:**
- Consumes: local production/development server.
- Produces: visual and interaction evidence at 360, 768, and 1440 pixels.

- [ ] Start the local site and inspect every route visually.
- [ ] Test keyboard and touch menu interaction, heading order, focus states, CV download, outbound links, and horizontal overflow.
- [ ] Run Lighthouse when available and iterate on actionable findings.
- [ ] Re-run `npm run qa` after any change.

### Task 6: Publish and verify GitHub Pages

**Files:**
- Create: `.github/workflows/deploy.yml`, `README.md`

**Interfaces:**
- Produces: public repository `zihan-liang/zihan-liang.github.io`, `main` commit, Pages workflow, and live site.

- [ ] Add the current official Astro Pages workflow and concise public README.
- [ ] Run the full fresh verification suite and inspect the exact Git diff.
- [ ] Initialize/commit on `main`, create the public GitHub repository if absent, and push the validated tree.
- [ ] Set Pages source to GitHub Actions if required and wait for the workflow to finish.
- [ ] Verify all live routes, assets, metadata, links, sitemap, robots, and 404 behavior; record any unverified acceptance item.
