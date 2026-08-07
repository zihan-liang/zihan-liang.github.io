#!/usr/bin/env node

import { access } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { synchronizeCv } from './cv-sync.mjs';

const root = path.resolve(import.meta.dirname, '..');

function sourceArgument(argv) {
  const index = argv.indexOf('--source');
  if (index !== -1) {
    if (!argv[index + 1]) throw new Error('--source requires a PDF path.');
    return argv[index + 1];
  }
  if (process.env.CV_PDF_PATH) return process.env.CV_PDF_PATH;
  return path.resolve(root, '..', 'CV', 'CV_EN_LZH', 'Zihan_Liang_Academic_CV.pdf');
}

async function main() {
  const source = path.resolve(sourceArgument(process.argv.slice(2)));
  const destination = path.join(root, 'public', 'assets', 'Zihan_Liang_Academic_CV.pdf');
  const contract = path.join(root, 'tests', 'site.test.mjs');
  try {
    await access(source);
  } catch {
    throw new Error(
      `CV source does not exist: ${source}. Pass --source or set CV_PDF_PATH.`,
    );
  }
  const result = await synchronizeCv({ source, destination, contract });
  console.log(`CV source: ${source}`);
  console.log(`Published CV: ${destination}`);
  console.log(`SHA-256: ${result.sha256}`);
  console.log(`Bytes: ${result.bytes}`);
}

main().catch((error) => {
  console.error(`error: ${error.message}`);
  process.exitCode = 1;
});
