import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

function replaceExactlyOnce(text, pattern, replacement, label) {
  const matches = text.match(pattern) ?? [];
  if (matches.length !== 1) {
    throw new Error(`Expected exactly one ${label} contract, found ${matches.length}.`);
  }
  return text.replace(pattern, replacement);
}

async function writeTemporary(file, contents) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, contents, { flag: 'wx' });
}

export async function sha256(file) {
  return createHash('sha256').update(await readFile(file)).digest('hex');
}

export async function synchronizeCv({ source, destination, contract }) {
  const pdf = await readFile(source);
  if (!pdf.subarray(0, 5).equals(Buffer.from('%PDF-'))) {
    throw new Error(`Source is not a valid PDF: ${source}`);
  }

  const digest = createHash('sha256').update(pdf).digest('hex');
  const bytes = pdf.byteLength;
  const originalContract = await readFile(contract, 'utf8');
  let updatedContract = replaceExactlyOnce(
    originalContract,
    /const approvedCvSha256 = '[^']*';/g,
    `const approvedCvSha256 = '${digest}';`,
    'approvedCvSha256',
  );
  updatedContract = replaceExactlyOnce(
    updatedContract,
    /const approvedCvBytes = \d+;/g,
    `const approvedCvBytes = ${bytes};`,
    'approvedCvBytes',
  );

  const destinationTemporary = `${destination}.tmp-${process.pid}`;
  const contractTemporary = `${contract}.tmp-${process.pid}`;
  try {
    await writeTemporary(destinationTemporary, pdf);
    await writeTemporary(contractTemporary, updatedContract);
    await rename(contractTemporary, contract);
    await rename(destinationTemporary, destination);
  } finally {
    await rm(destinationTemporary, { force: true });
    await rm(contractTemporary, { force: true });
  }

  return { sha256: digest, bytes };
}
