# Vercount Visitor Statistics Design

## Goal

Add a compact sitewide visitor-statistics panel inspired by the reference academic homepage. The panel displays total page views and unique visitors without requiring a database or account.

## Approved approach

Use the same Vercount integration as the reference website:

- Load `https://cn.vercount.one/js` once with a deferred external script.
- Read total page views through `busuanzi_value_site_pv`.
- Read unique visitors through `busuanzi_value_site_uv`.
- Treat the values as sitewide counters for `zihan-liang.github.io`.

The counter must not copy the numerical values shown in the reference screenshot. Vercount supplies the live values for this site.

## User interface

Create a focused `VisitorStats.astro` component and render it above the existing footer identity row on every route.

The component contains two statistics:

1. An eye icon, the label `Total visits`, the live page-view value, and the suffix `times`.
2. A people icon, the label `Visitors`, the live unique-visitor value, and the suffix `people`.

Use inline SVG icons so the feature does not add an icon dependency. Adapt the screenshot's rounded counter treatment to the existing warm-white, navy, and teal design tokens. The panel should remain compact and avoid competing with the page content.

On wide screens, the two statistics appear side by side. On narrow screens, they stack without horizontal overflow. Values use tabular numerals to prevent visible width changes while loading.

## Loading and failure behavior

- Render a neutral dash before Vercount provides a value.
- Use the container IDs expected by Vercount.
- Do not show a fabricated zero while loading.
- If the external script is blocked or unavailable, leave the neutral placeholders visible.
- The rest of the footer and page must remain fully functional.

## Accessibility and privacy

- Give the group an accessible label describing it as website visitor statistics.
- Mark decorative icons as hidden from assistive technology.
- Let value changes be announced politely without interrupting navigation.
- Do not add cookies, local storage, fingerprinting code, personal identifiers, or a separate analytics dashboard.
- Document that the counter relies on the third-party Vercount script.

## Validation

Add regression coverage that confirms:

- The deferred Vercount script is emitted once per page.
- The sitewide page-view and unique-visitor IDs are present.
- Neutral placeholders are used in static HTML.
- The component has accessible labeling.
- The responsive CSS stacks the counters on small screens.
- Existing privacy exclusions and all current routes remain intact.

Run Astro diagnostics, a production build, and the complete Node test suite. Inspect the homepage at mobile and desktop widths before proposing integration.

## Delivery workflow

DeepSeek implements the feature in the isolated `codex/vercount-visitor-stats` branch. Codex independently reviews the diff and verification evidence. No push or deployment occurs without explicit user approval.
