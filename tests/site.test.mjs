import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const approvedCvSha256 = 'fc9deaa65e40562b6edaa11298d8738a854b93d6940ec6dbf8404e4bf382a43c';
const approvedCvBytes = 98647;
const previousPortraitSha256 = 'dad61c09339a8cc76d3dee1e0c9d5fd8199e393c5657cb7ff105a399a6212375';

const routeFiles = new Map([
  ['/', 'index.html'],
  ['/research/', 'research/index.html'],
  ['/outputs/', 'outputs/index.html'],
  ['/projects/', 'projects/index.html'],
  ['/honors/', 'honors/index.html'],
  ['/cv/', 'cv/index.html'],
  ['/404.html', '404.html'],
]);

const forbiddenPatterns = [
  /date of birth|\bDOB\b/i,
  /phone|telephone|mobile number/i,
  /material\/award|material\/paper/i,
  /\bCyberC\b/i,
  /personal Au20 GNN|Au20 GNN authorship|GNN model authorship/i,
  /(?:accepted[^<\n]{0,80}poster|poster[^<\n]{0,80}accepted)/i,
];

const forbiddenFingerprints = [
  [7, '1050c70e59f5ca823c85432ff72b3dc916b0085ea2b00ef7ab7537334678ae3d'],
  [19, '7e6d26b7f32e383ec172b31628206f9e299254ccd797b26ab90b0df855ca972b'],
  [9, '88f4a7c721833e59b04fada115120ad93df02818acdcfc7c68a500332cf4babe'],
  [15, 'd978cf5e1e3a0e89208e22a98b6c75268900637a9b35a5e3f49d3b9f0ed521ae'],
  [10, 'a93dafb9f7e49a0d9f3d316b4fc015e94dda0ab8c6d8801f2d02c51d2a9ad015'],
  [23, 'ca70c5bbd909a04184ad135bc04a2be4241c29fd093ea292ce69ee073cf967ab'],
];

const expectedClaimBindings = new Map([
  ['outputs/fx-volatility-preprint.md', ['fx-preprint']],
  ['outputs/suicide-risk-poster.md', ['suicide-poster']],
  ['outputs/suicide-risk-technical-report.md', ['suicide-technical-report']],
  ['projects/au20-visualization.md', ['au20-visualization']],
  ['projects/home-repair-assistant.md', ['home-repair-robotics']],
  ['projects/nipt-modeling.md', ['cumcm-nipt']],
  ['projects/xjtlu-timetable-converter.md', ['xjtlu-timetable-converter']],
  ['projects/python-learning-rpg.md', ['python-learning-rpg']],
  ['projects/ai-agent-exercise-generator.md', ['ai-agent-exercise-generator']],
  ['projects/skillnet-graph-coordination.md', ['sjtu-ai-action-summer-school-completion', 'sjtu-skillnet-experiment']],
  ['honors/cumcm-second-prize.md', ['cumcm-nipt']],
  ['honors/icsc-poster-presentation.md', ['suicide-poster', 'icsc-presentation']],
  ['honors/mcm-finalist.md', ['mcm-finalist']],
  ['honors/rlls-au20-grand-prize.md', ['rlls-project-awards', 'rlls-au20-grand-prize']],
  ['honors/rlls-fx-second-prize.md', ['rlls-project-awards']],
  ['honors/rlls-nipt-first-prize.md', ['rlls-project-awards']],
  ['honors/rlls-oral-presentation.md', ['rlls-suicide-presentation']],
  ['honors/rlls-suicide-second-prize.md', ['rlls-project-awards']],
  ['honors/robotics-provincial-third-prize.md', ['robotics-provincial-third-prize']],
  ['honors/surf-excellent-poster.md', ['surf-excellent-poster-award']],
  ['honors/sjtu-skillnet-social-impact.md', ['sjtu-skillnet-social-impact-first-prize']],
  ['updates/2025-08-ssrn.md', ['fx-preprint']],
  ['updates/2025-11-rlls.md', ['rlls-project-awards']],
  ['updates/2025-iccs-poster.md', ['icsc-presentation']],
  ['updates/2026-mcm-finalist.md', ['mcm-finalist']],
  ['updates/2026-ibec.md', ['fx-ibec-presentation']],
  ['updates/2026-07-sjtu-skillnet.md', ['sjtu-ai-action-summer-school-completion', 'sjtu-skillnet-experiment', 'sjtu-skillnet-social-impact-first-prize']],
]);

async function fileText(relativePath) {
  return readFile(path.join(dist, relativePath), 'utf8');
}

async function allFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? allFiles(full) : [full];
  }))).flat();
}

async function sha256(file) {
  return createHash('sha256').update(await readFile(file)).digest('hex');
}

async function claimIds(relativePath) {
  const source = await readFile(path.join(root, 'src', 'content', relativePath), 'utf8');
  const frontmatter = source.match(/\A?---\s*\n([\s\S]*?)\n---/);
  assert.ok(frontmatter, `${relativePath} must contain frontmatter`);
  const field = frontmatter[1].match(/^claimIds:\s*\n((?:\s+-\s+[^\n]+\n?)+)/m);
  assert.ok(field, `${relativePath} must contain a nonempty claimIds list`);
  return [...field[1].matchAll(/^\s+-\s+(.+)$/gm)].map((match) => match[1].trim());
}

function assertNoFingerprints(value) {
  const normalized = value.toLowerCase();
  for (const [length, forbiddenHash] of forbiddenFingerprints) {
    for (let index = 0; index <= normalized.length - length; index += 1) {
      const candidateHash = createHash('sha256').update(normalized.slice(index, index + length)).digest('hex');
      assert.notEqual(candidateHash, forbiddenHash, 'A fingerprinted private or unsupported value entered the public build.');
    }
  }
}

test('build emits every required route with unique canonical metadata', async () => {
  for (const [route, file] of routeFiles) {
    const html = await fileText(file);
    assert.match(html, /<html lang="en"/);
    assert.match(html, /<meta name="description" content="[^"]+"/);
    assert.match(html, /<meta property="og:title" content="[^"]+"/);
    assert.match(html, /<meta property="og:image" content="https:\/\/zihan-liang\.github\.io\/og-card\.png"/);
    assert.match(html, new RegExp(`<link rel="canonical" href="https://zihan-liang\\.github\\.io${route === '/404.html' ? '/404.html' : route}"`));
    assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `${route} should have one h1`);
  }
});

test('homepage contains authorized positioning, research result, and Person data', async () => {
  const html = await fileText('index.html');
  assert.match(html, /Undergraduate AI Researcher at XJTLU/);
  assert.match(html, /weighted F1[^<]*0\.46[^<]*0\.43[^<]*five-fold user-level evaluation/i);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /"@type":"Person"/);
  assert.match(html, /Zihan\.Liang24@student\.xjtlu\.edu\.cn/);
  assert.match(html, /https:\/\/github\.com\/zihan-liang/);
  assert.match(html, /team research presented at IBEC 2026/i);
  assert.match(html, /A co-author presented the team’s USD\/CNH volatility-forecasting research at IBEC 2026/i);
  assert.doesNotMatch(html, /I presented[^<\n]{0,80}IBEC|Zihan[^<\n]{0,80}presented[^<\n]{0,80}IBEC/i);
});

test('education surfaces include the confirmed first-place programme ranking', async () => {
  for (const file of ['index.html', 'cv/index.html']) {
    const html = await fileText(file);
    assert.match(html, /Ranked 1st in the programme based on a Stage 2 weighted average of 78\/100/);
    assert.match(html, /Overall weighted average: 74\/100/);
  }
});

test('homepage milestone dates use the verified event months', async () => {
  const html = await fileText('index.html');
  assert.match(html, /<time datetime="2026-01-03">Jan 2026<\/time>[\s\S]*IBEC 2026/);
  assert.match(html, /<time datetime="2026-05-08">May 2026<\/time>[\s\S]*MCM Finalist/);
  assert.match(html, /<time datetime="2025-12-12">Dec 2025<\/time>[\s\S]*ICSC poster presented/);
});

test('homepage is a complete ordered academic portal with anchor navigation', async () => {
  const html = await fileText('index.html');
  const sectionIds = ['about', 'research', 'news', 'outputs', 'projects', 'software', 'honors', 'presentations', 'education', 'cv'];
  let previousIndex = -1;
  for (const id of sectionIds) {
    const index = html.indexOf(`id="${id}"`);
    assert.ok(index > previousIndex, `#${id} must appear in the approved section order`);
    previousIndex = index;
  }
  for (const id of ['about', 'research', 'outputs', 'projects', 'honors', 'education', 'cv']) {
    assert.match(html, new RegExp(`href="#${id}"`));
  }
  assert.match(html, /Mixed-Frequency Transformer/);
  assert.match(html, /Sequential Social-Media Suicide-Risk Assessment/);
  assert.match(html, /Python Learning RPG/);
  assert.match(html, /AI Agent Exercise Generator/);
  assert.match(html, /SURF Excellent Poster Award/);
  assert.match(html, /RLLS Grand Prize, Top 1 out of 50\+/);
  assert.match(html, /Second Prize, Jiangsu Division \(Undergraduate Group\)/);
});

test('detail-route navigation returns to homepage anchors', async () => {
  const html = await fileText('research/index.html');
  for (const id of ['about', 'research', 'outputs', 'projects', 'honors', 'education', 'cv']) {
    assert.match(html, new RegExp(`href="/#${id}"`));
  }
});

test('every factual content entry has the approved route claim bindings', async () => {
  for (const [relativePath, expected] of expectedClaimBindings) {
    assert.deepEqual(await claimIds(relativePath), expected, relativePath);
  }
  const contentFiles = (await allFiles(path.join(root, 'src', 'content')))
    .filter((file) => /\.(?:md|mdx)$/.test(file));
  assert.equal(contentFiles.length, expectedClaimBindings.size);
});

test('outputs distinguish preprint, poster, and technical report', async () => {
  const html = await fileText('outputs/index.html');
  assert.match(html, /SSRN preprint/i);
  assert.match(html, /Conference poster/i);
  assert.match(html, /Technical report/i);
  assert.match(html, /A Hierarchical Neural Network for Suicide Risk Prediction/);
  assert.match(html, /A Hierarchical Neural Network for Suicide Risk Prediction[\s\S]*?Ruixi Xu, Zihan Liang, Ren Zhao/);
  assert.doesNotMatch(html, /A Hierarchical Neural Network for Suicide Risk Prediction[\s\S]*?Zihan Liang, Ruixi Xu, Ren Zhao/);
  assert.match(html, /Technical report \/ IEEE BigData Challenge submission/);
  assert.match(html, /zihan-liang\/ICSC2025-poster/);
  assert.match(html, /zihan-liang\/public-mental-health-monitoring/);
});

test('projects include the concrete XJTLU timetable converter repository', async () => {
  const html = await fileText('projects/index.html');
  assert.match(html, /XJTLU Timetable Converter/);
  assert.match(html, /Developer/);
  assert.match(html, /Feb 2026/);
  assert.match(html, /HTML-to-iCalendar converter for XJTLU e-Bridge timetable exports/i);
  assert.match(html, /https:\/\/github\.com\/zihan-liang\/xjtlu-ebridge-html-to-ics/);
  assert.doesNotMatch(html, /Open Research Software/);
});

test('projects include the approved Python RPG and AI agent software summaries', async () => {
  const html = await fileText('projects/index.html');
  assert.match(html, /coursework Python learning RPG with CLI and Pygame frontends/i);
  assert.match(html, /save-backed progression/i);
  assert.match(html, /topic-based question combat/i);
  assert.match(html, /Learning Center/i);
  assert.match(html, /automated tests/i);
  assert.match(html, /https:\/\/github\.com\/zihan-liang\/python-learning-rpg/);
  assert.match(html, /multi-agent workflow for generating, solving, verifying, deduplicating, and exporting practice exercises to LaTeX and XML/i);
});

test('SkillNet project and SJTU social-impact award match the final CV', async () => {
  const projects = await fileText('projects/index.html');
  assert.match(projects, /SkillNet: Graph-Guided Coordination for Enterprise AI Agents/);
  assert.match(projects, /46 atomic skills and 21 Gold Tasks/);
  assert.match(projects, /89\.13% Skill F1/);
  assert.match(projects, /98\.10%/);
  assert.match(projects, /https:\/\/github\.com\/zihan-liang\/skill-net/);

  for (const file of ['index.html', 'honors/index.html']) {
    const html = await fileText(file);
    assert.match(html, /First Prize for Social Impact/);
    assert.match(html, /AI Action Summer School, Shanghai Jiao Tong University/);
    assert.match(html, /SkillNet: Organizing Skills at Scale/);
  }
});

test('robotics provincial third prize is project-labeled on the homepage and honors route', async () => {
  for (const file of ['index.html', 'honors/index.html']) {
    const html = await fileText(file);
    assert.match(html, /Jiangsu Provincial Third Prize/);
    assert.match(html, /“Keyou Cup” 4th Jiangsu Provincial University Intelligent Robot Creativity Competition/);
    assert.match(html, /Home Repair Assistant/);
    assert.match(html, /2025/);
  }
});

test('generated public artifacts contain no forbidden private or unsupported claims', async () => {
  const files = (await allFiles(dist)).filter((file) => /\.(?:html|xml|txt|css|js|md|json)$/i.test(file));
  const corpus = (await Promise.all(files.map((file) => readFile(file, 'utf8')))).join('\n');
  for (const pattern of forbiddenPatterns) assert.doesNotMatch(corpus, pattern);
  assertNoFingerprints(corpus);
});

test('downloadable CV is byte-identical to the approved three-page Academic Research CV', async () => {
  const publishedCv = path.join(dist, 'assets', 'Zihan_Liang_Academic_CV.pdf');
  assert.equal(await sha256(publishedCv), approvedCvSha256);
  assert.equal((await stat(publishedCv)).size, approvedCvBytes);
});

test('homepage serves the new optimized responsive portrait', async () => {
  const html = await fileText('index.html');
  const portrait640 = path.join(dist, 'assets', 'portrait-640.jpg');
  const portrait960 = path.join(dist, 'assets', 'portrait-960.jpg');
  assert.notEqual(await sha256(portrait960), previousPortraitSha256);
  assert.ok((await stat(portrait640)).size > 0);
  assert.ok((await stat(portrait960)).size > 0);
  assert.match(html, /src="\/assets\/portrait-960\.jpg"/);
  assert.match(html, /srcset="\/assets\/portrait-640\.jpg 640w, \/assets\/portrait-960\.jpg 960w"/);
  assert.match(html, /alt="Formal portrait of Zihan Liang against a red background"/);
});

test('sitemap, robots, 404, social card, and portrait are present', async () => {
  const sitemap = await fileText('sitemap-0.xml');
  const sitemapIndex = await fileText('sitemap-index.xml');
  const robots = await fileText('robots.txt');
  assert.match(sitemap, /https:\/\/zihan-liang\.github\.io\/(?:<\/loc>|research\/)/);
  assert.match(sitemapIndex, /sitemap-0\.xml/);
  assert.match(robots, /Allow: \/[\s\S]*Sitemap: https:\/\/zihan-liang\.github\.io\/sitemap-index\.xml/);
  await stat(path.join(dist, '404.html'));
  await stat(path.join(dist, 'og-card.png'));
  await stat(path.join(dist, 'assets', 'portrait-960.jpg'));
});

test('custom Pages workflow grants deploy-pages fifteen minutes', async () => {
  const workflow = await readFile(path.join(root, '.github', 'workflows', 'deploy.yml'), 'utf8');
  assert.match(workflow, /uses:\s*actions\/deploy-pages@v4\s*\n\s*with:\s*\n\s*timeout:\s*900000(?:\s|$)/);
});

test('mobile navigation and responsive accessibility contracts are rendered', async () => {
  const html = await fileText('index.html');
  const cssFiles = (await allFiles(path.join(dist, '_astro'))).filter((file) => file.endsWith('.css'));
  const css = (await Promise.all(cssFiles.map((file) => readFile(file, 'utf8')))).join('\n');
  assert.match(html, /<button[^>]+aria-controls="primary-navigation"[^>]+aria-expanded="false"/);
  assert.match(html, /event\.key\s*===\s*["']Escape["']/);
  assert.match(css, /@media\s*\((?:[^)]*max-width:\s*48rem|width\s*<=\s*48rem)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /overflow-wrap:\s*anywhere/);
});

test('repository maintenance instructions enforce evidence, privacy, and deployment gates', async () => {
  const instructionsPath = path.join(root, 'AGENTS.md');
  const exists = await stat(instructionsPath).then(() => true, () => false);
  assert.ok(exists, 'AGENTS.md must define website maintenance constraints');
  const instructions = await readFile(instructionsPath, 'utf8');
  assert.match(instructions, /evidence\/claims\.yml/);
  assert.match(instructions, /npm run qa/);
  assert.match(instructions, /npm run sync:cv/);
  assert.match(instructions, /phone number/i);
  assert.match(instructions, /student ID/i);
  assert.match(instructions, /certificate identifier/i);
  assert.match(instructions, /private repository/i);
  assert.match(instructions, /explicit[^\n]+(?:push|deploy)/i);
});
