# Zihan Liang — Academic Website

Source for [zihan-liang.github.io](https://zihan-liang.github.io), an English-language academic portfolio focused on machine learning for time-series forecasting and sequential social-media risk assessment.

The site is statically generated with Astro, strict TypeScript, validated content collections, and vanilla CSS. GitHub Actions deploys `main` to GitHub Pages.

## Local development

```sh
npm install
npm run dev
```

## Verification

```sh
npm run qa
```

The verification suite checks all public routes, metadata, crawler files, privacy exclusions, responsive accessibility contracts, and the downloadable CV artifact.

Fonts are self-hosted. Newsreader and Inter are distributed under the SIL Open Font License; license texts are included with the font assets.

## DeepSeek maintenance

The canonical CV repository contains the shared DeepSeek maintenance launcher. Start a website-only session from that repository with:

```sh
./scripts/deepseek-maintain site
```

Use `both` instead when a factual change must be synchronized across the CV and website. The agent reads the CV evidence graph before editing public copy and must run this repository's QA suite before proposing a commit.

### Synchronize the public CV

The public download is always the canonical Academic Research CV. Copy a newly compiled PDF and update its regression-test hash in one command:

```sh
npm run sync:cv -- --source /path/to/Zihan_Liang_Academic_CV.pdf
npm run qa
```

You may set `CV_PDF_PATH` instead of passing `--source`. Review the PDF diff, hash, and test results before committing. Do not publish the Master CV unless explicitly requested.

Website maintenance remains local by default. A commit, push, and GitHub Pages deployment are separate actions and each requires the user's instruction.

### Visitor statistics

The footer loads the deferred Vercount script from `https://cn.vercount.one/js` and renders sitewide page-view and unique-visitor totals. Static HTML uses neutral placeholders, so blocking or losing the third-party script does not affect navigation or other content.
