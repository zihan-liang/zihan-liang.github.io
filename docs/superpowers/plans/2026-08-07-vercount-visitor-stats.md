# Vercount Visitor Statistics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an accessible sitewide panel that displays live Vercount page-view and unique-visitor totals above the existing footer.

**Architecture:** A focused Astro component owns the counter markup and inline SVG icons. `BaseLayout.astro` loads the deferred Vercount script exactly once per rendered page, while `SiteFooter.astro` places the component consistently across all routes. Existing global design tokens provide the responsive visual treatment.

**Tech Stack:** Astro 7, TypeScript strict mode, vanilla CSS, Node test runner, Vercount external counter script

## Global Constraints

- Load only `https://cn.vercount.one/js` as the counter dependency.
- Use Vercount's sitewide IDs `busuanzi_container_site_pv`, `busuanzi_value_site_pv`, `busuanzi_container_site_uv`, and `busuanzi_value_site_uv`.
- Do not copy numerical values from the reference screenshot.
- Render a neutral em dash until live values arrive.
- Add no icon package, cookie, local-storage entry, fingerprinting code, account integration, or analytics dashboard.
- Keep every existing route, factual claim, privacy exclusion, CV artifact, and accessibility behavior unchanged.
- Do not push or deploy without explicit user approval.
- Use the bundled Node executable at `/Users/liangzihan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node` because `node` is not on the default shell path.

---

## File Structure

- Create `src/components/VisitorStats.astro`: semantic visitor-statistics markup and decorative inline SVG icons.
- Modify `src/components/SiteFooter.astro`: render the visitor panel above the existing footer identity row.
- Modify `src/layouts/BaseLayout.astro`: load the Vercount script once with `defer`.
- Modify `src/styles/global.css`: desktop and mobile visitor-panel styling using existing tokens.
- Modify `tests/site.test.mjs`: generated-HTML, accessibility, loading-state, script-count, and responsive-style contracts.
- Modify `README.md`: document the external counter dependency and local failure behavior.

---

### Task 1: Sitewide counter markup and script contract

**Files:**
- Create: `src/components/VisitorStats.astro`
- Modify: `src/components/SiteFooter.astro`
- Modify: `src/layouts/BaseLayout.astro`
- Test: `tests/site.test.mjs`

**Interfaces:**
- Consumes: `BaseLayout.astro` on every route and the existing `SiteFooter.astro` layout.
- Produces: one `VisitorStats.astro` instance per page and the four Vercount DOM IDs required by `https://cn.vercount.one/js`.

- [ ] **Step 1: Write the failing generated-HTML test**

Append this test to `tests/site.test.mjs`:

```js
test('sitewide visitor statistics use one deferred Vercount script and accessible placeholders', async () => {
  for (const [route, file] of routeFiles) {
    const html = await fileText(file);
    const counterScripts = html.match(
      /<script[^>]+src="https:\/\/cn\.vercount\.one\/js"[^>]*><\/script>/g,
    ) ?? [];
    assert.equal(counterScripts.length, 1, `${route} should load Vercount exactly once`);
    assert.match(counterScripts[0], /\bdefer(?:\s|>|=)/);
    assert.match(html, /aria-label="Website visitor statistics"/);
    assert.match(html, /id="busuanzi_container_site_pv"/);
    assert.match(html, /id="busuanzi_value_site_pv"[^>]*aria-live="polite"[^>]*>—<\/span>/);
    assert.match(html, /id="busuanzi_container_site_uv"/);
    assert.match(html, /id="busuanzi_value_site_uv"[^>]*aria-live="polite"[^>]*>—<\/span>/);
    assert.match(html, /Total visits/);
    assert.match(html, /Visitors/);
    assert.doesNotMatch(html, />24137<|>17601</);
  }
});
```

- [ ] **Step 2: Build and run the new test to verify it fails**

Run:

```bash
ASTRO_TELEMETRY_DISABLED=1 /Users/liangzihan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/.bin/astro build
/Users/liangzihan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test --test-name-pattern="sitewide visitor statistics" tests/site.test.mjs
```

Expected: FAIL because the Vercount script, component, and IDs do not exist.

- [ ] **Step 3: Create the semantic counter component**

Create `src/components/VisitorStats.astro` with this structure:

```astro
<section class="visitor-stats" aria-label="Website visitor statistics">
  <div class="visitor-stat" id="busuanzi_container_site_pv">
    <svg class="visitor-stat-icon" aria-hidden="true" viewBox="0 0 24 24">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.75" />
    </svg>
    <span class="visitor-stat-label">Total visits</span>
    <span class="visitor-stat-value" id="busuanzi_value_site_pv" aria-live="polite">—</span>
    <span class="visitor-stat-unit">times</span>
  </div>
  <div class="visitor-stat" id="busuanzi_container_site_uv">
    <svg class="visitor-stat-icon" aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="9" cy="8" r="3" />
      <circle cx="16.5" cy="9" r="2.5" />
      <path d="M3.5 19c.4-4 2.2-6 5.5-6s5.1 2 5.5 6M14 14c3.6 0 5.6 1.7 6.2 5" />
    </svg>
    <span class="visitor-stat-label">Visitors</span>
    <span class="visitor-stat-value" id="busuanzi_value_site_uv" aria-live="polite">—</span>
    <span class="visitor-stat-unit">people</span>
  </div>
</section>
```

Keep both SVGs decorative with `aria-hidden="true"`. Use `fill="none"`, `stroke="currentColor"`, `stroke-linecap="round"`, and `stroke-linejoin="round"` on each SVG so the icons inherit the accent color.

- [ ] **Step 4: Render the component and load Vercount once**

In `src/components/SiteFooter.astro`, import `VisitorStats` and render `<VisitorStats />` immediately inside `<footer>` before `.footer-inner`.

In the `<head>` of `src/layouts/BaseLayout.astro`, add:

```astro
<script is:inline defer src="https://cn.vercount.one/js"></script>
```

Do not add a second script tag inside the component or footer.

- [ ] **Step 5: Build and run the focused test**

Run:

```bash
ASTRO_TELEMETRY_DISABLED=1 /Users/liangzihan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/.bin/astro build
/Users/liangzihan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test --test-name-pattern="sitewide visitor statistics" tests/site.test.mjs
```

Expected: PASS with one script and both counters on every route.

- [ ] **Step 6: Commit the markup and integration**

```bash
git add src/components/VisitorStats.astro src/components/SiteFooter.astro src/layouts/BaseLayout.astro tests/site.test.mjs
git commit -m "feat: add sitewide visitor statistics"
```

---

### Task 2: Responsive academic styling

**Files:**
- Modify: `src/styles/global.css`
- Test: `tests/site.test.mjs`

**Interfaces:**
- Consumes: `.visitor-stats`, `.visitor-stat`, `.visitor-stat-icon`, `.visitor-stat-label`, `.visitor-stat-value`, and `.visitor-stat-unit` from `VisitorStats.astro`.
- Produces: a two-column desktop panel, a one-column mobile layout, and tabular live values without horizontal overflow.

- [ ] **Step 1: Extend the failing test with style contracts**

Inside the visitor-statistics test, read `src/styles/global.css` and add:

```js
const cssSource = await readFile(path.join(root, 'src', 'styles', 'global.css'), 'utf8');
assert.match(cssSource, /\.visitor-stats\s*\{[\s\S]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
assert.match(cssSource, /\.visitor-stat-value\s*\{[\s\S]*font-variant-numeric:\s*tabular-nums/);
assert.match(cssSource, /@media\s*\(max-width:\s*48rem\)[\s\S]*\.visitor-stats\s*\{[\s\S]*grid-template-columns:\s*1fr/);
```

- [ ] **Step 2: Run the focused test to verify the style contract fails**

Run:

```bash
/Users/liangzihan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test --test-name-pattern="sitewide visitor statistics" tests/site.test.mjs
```

Expected: FAIL because the visitor-statistics CSS selectors do not exist.

- [ ] **Step 3: Add minimal desktop styling**

Add `.visitor-stats` to the existing shared container-width selector with `.header-inner` and `.footer-inner`. Before `.site-footer`, add rules with these exact responsibilities:

```css
.visitor-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.visitor-stat {
  display: flex;
  gap: 0.7rem;
  align-items: center;
  justify-content: center;
  min-width: 0;
  padding: 0.85rem 1rem;
  border: 1px solid var(--rule);
  border-radius: 999px;
  background: var(--surface);
  box-shadow: var(--shadow);
}

.visitor-stat-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex: 0 0 auto;
  color: var(--teal);
}

.visitor-stat-label,
.visitor-stat-unit {
  color: var(--muted);
  font-size: 0.9rem;
  font-weight: 650;
}

.visitor-stat-value {
  min-width: 4ch;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  color: var(--navy);
  background: var(--paper);
  font-weight: 750;
  font-variant-numeric: tabular-nums;
  text-align: center;
}
```

- [ ] **Step 4: Add the mobile rule**

Inside the existing `@media (max-width: 48rem)` block, add:

```css
.visitor-stats {
  grid-template-columns: 1fr;
}
```

Do not add fixed widths. The existing `body` overflow protection must remain unchanged.

- [ ] **Step 5: Run the focused test and complete website QA**

Run:

```bash
ASTRO_TELEMETRY_DISABLED=1 /Users/liangzihan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/.bin/astro check
ASTRO_TELEMETRY_DISABLED=1 /Users/liangzihan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/.bin/astro build
/Users/liangzihan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/*.test.mjs
```

Expected: 0 Astro diagnostics, successful seven-route build, and all Node tests passing.

- [ ] **Step 6: Commit responsive styling**

```bash
git add src/styles/global.css tests/site.test.mjs
git commit -m "style: integrate responsive visitor counters"
```

---

### Task 3: Document and visually review the external counter

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: the Vercount integration completed in Tasks 1 and 2.
- Produces: a maintenance note that explains the external dependency and its quiet failure behavior.

- [ ] **Step 1: Add the maintenance documentation**

Under the website maintenance or development guidance in `README.md`, add:

```markdown
### Visitor statistics

The footer loads the deferred Vercount script from `https://cn.vercount.one/js` and renders sitewide page-view and unique-visitor totals. Static HTML uses neutral placeholders, so blocking or losing the third-party script does not affect navigation or other content.
```

- [ ] **Step 2: Verify dependency and privacy boundaries**

Run:

```bash
rg -n "vercount|busuanzi|visitor-stat" src README.md tests
rg -n "localStorage|document.cookie|fingerprint" src
```

Expected: one Vercount script source, the four approved IDs, and no matches for cookies, local storage, or fingerprinting.

- [ ] **Step 3: Run final automated QA**

Run:

```bash
ASTRO_TELEMETRY_DISABLED=1 /Users/liangzihan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/.bin/astro check
ASTRO_TELEMETRY_DISABLED=1 /Users/liangzihan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/.bin/astro build
/Users/liangzihan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/*.test.mjs
git diff --check
```

Expected: 0 Astro diagnostics, successful production build, all tests passing, and no whitespace errors.

- [ ] **Step 4: Perform responsive visual review**

Serve the production build locally and inspect `/` at 360, 768, and 1440 CSS pixels. Confirm that both counters are readable, the mobile layout stacks, the external-script failure leaves dashes, and no horizontal scrollbar appears.

- [ ] **Step 5: Commit documentation**

```bash
git add README.md
git commit -m "docs: document visitor statistics dependency"
```

- [ ] **Step 6: Present the completed branch for Codex review**

Report the commit list, changed files, Astro diagnostics, build result, test count, and any limitation observed when Vercount is blocked. Do not push or deploy.
