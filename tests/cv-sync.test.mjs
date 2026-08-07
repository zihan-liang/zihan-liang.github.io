import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { pathToFileURL } from 'node:url';

const root = path.resolve(import.meta.dirname, '..');
const modulePath = path.join(root, 'scripts', 'cv-sync.mjs');

async function loadSynchronizer() {
  assert.ok(existsSync(modulePath), 'CV synchronization module must exist');
  return import(pathToFileURL(modulePath));
}

test('synchronizeCv copies a valid PDF and updates the approved hash and size', async () => {
  const { synchronizeCv } = await loadSynchronizer();
  const fixture = await mkdtemp(path.join(tmpdir(), 'cv-sync-'));
  try {
    const source = path.join(fixture, 'source.pdf');
    const destination = path.join(fixture, 'public', 'assets', 'Zihan_Liang_Academic_CV.pdf');
    const contract = path.join(fixture, 'tests', 'site.test.mjs');
    await mkdir(path.dirname(destination), { recursive: true });
    await mkdir(path.dirname(contract), { recursive: true });
    await writeFile(source, Buffer.from('%PDF-1.4\nfixture'));
    await writeFile(destination, Buffer.from('%PDF-1.4\nold'));
    await writeFile(
      contract,
      "const approvedCvSha256 = 'old';\nconst approvedCvBytes = 1;\n",
    );

    const result = await synchronizeCv({ source, destination, contract });

    assert.equal(await readFile(destination, 'utf8'), '%PDF-1.4\nfixture');
    assert.deepEqual(result, {
      sha256: '7dfd2b80df499f12a5740d2f0ac27c27549ca76b03158339618d4f7d2b22d233',
      bytes: 16,
    });
    assert.equal(
      await readFile(contract, 'utf8'),
      "const approvedCvSha256 = '7dfd2b80df499f12a5740d2f0ac27c27549ca76b03158339618d4f7d2b22d233';\nconst approvedCvBytes = 16;\n",
    );
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test('synchronizeCv rejects non-PDF input without changing public files', async () => {
  const { synchronizeCv } = await loadSynchronizer();
  const fixture = await mkdtemp(path.join(tmpdir(), 'cv-sync-invalid-'));
  try {
    const source = path.join(fixture, 'source.pdf');
    const destination = path.join(fixture, 'public.pdf');
    const contract = path.join(fixture, 'site.test.mjs');
    await writeFile(source, 'not a PDF');
    await writeFile(destination, '%PDF-1.4\nexisting');
    await writeFile(
      contract,
      "const approvedCvSha256 = 'existing';\nconst approvedCvBytes = 17;\n",
    );

    await assert.rejects(
      synchronizeCv({ source, destination, contract }),
      /valid PDF/i,
    );
    assert.equal(await readFile(destination, 'utf8'), '%PDF-1.4\nexisting');
    assert.match(await readFile(contract, 'utf8'), /approvedCvSha256 = 'existing'/);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});
