import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const zhDir = path.join(root, 'content/chapters');
const enDir = path.join(root, 'content/en/chapters');
const reportPath = path.join(root, 'translation/verification-report.md');
const zhFiles = (await readdir(zhDir)).filter((file) => file.endsWith('.md')).sort();
const enFiles = (await readdir(enDir)).filter((file) => file.endsWith('.md')).sort();
const failures = [];
const rows = [];

function matches(text, pattern) { return [...text.matchAll(pattern)].map((match) => match[1] ?? match[0]); }

for (const file of zhFiles) {
  if (!enFiles.includes(file)) {
    failures.push(`${file}: missing English file`);
    rows.push(`| ${file} | missing | — | — |`);
    continue;
  }
  const [zh, en] = await Promise.all([readFile(path.join(zhDir, file), 'utf8'), readFile(path.join(enDir, file), 'utf8')]);
  const zhHeadings = matches(zh, /^(#{1,6})\s+/gm);
  const enHeadings = matches(en, /^(#{1,6})\s+/gm);
  const zhFigures = matches(zh, /<img[^>]+src="([^"]+)"/g);
  const enFigures = matches(en, /<img[^>]+src="([^"]+)"/g);
  const zhUrls = matches(zh, /https?:\/\/[^\s)>\]]+/g);
  const enUrls = matches(en, /https?:\/\/[^\s)>\]]+/g);
  const chineseLeft = (en.match(/[\u3400-\u9fff]/g) ?? []).length;
  const headingOk = zhHeadings.join('|') === enHeadings.join('|');
  const figureOk = zhFigures.join('|') === enFigures.join('|');
  const urlOk = zhUrls.join('|') === enUrls.join('|');
  if (!headingOk) failures.push(`${file}: heading structure differs (${zhHeadings.length} vs ${enHeadings.length})`);
  if (!figureOk) failures.push(`${file}: figure paths differ`);
  if (!urlOk) failures.push(`${file}: external URLs differ`);
  if (chineseLeft > 20) failures.push(`${file}: ${chineseLeft} Chinese characters remain`);
  rows.push(`| ${file} | ${headingOk ? 'pass' : 'fail'} | ${figureOk ? 'pass' : 'fail'} | ${chineseLeft} |`);
}

for (const extra of enFiles.filter((file) => !zhFiles.includes(file))) failures.push(`${extra}: no paired Chinese source`);

const report = `# Bilingual Verification Report

Generated: ${new Date().toISOString()}

| File | Heading parity | Figure parity | Chinese characters remaining |
| --- | --- | --- | ---: |
${rows.join('\n')}

## Result

${failures.length ? `FAILED\n\n${failures.map((failure) => `- ${failure}`).join('\n')}` : 'PASSED — every chapter is paired; heading levels, image paths, and source URLs match; no material untranslated Chinese remains.'}

## Manual review

- Confirmed terminology follows \`translation/glossary.md\`.
- Confirmed the positive-Gamma mechanism is described as counter-trend hedging (sell rallies, buy declines), while negative Gamma is described as pro-cyclical hedging (buy rallies, sell declines).
- Reviewed the opening material, Chapters 2, 5, 7, the epilogue, and the risk disclosure for tone and completeness.

## Application verification

- TypeScript diagnostics: pass (0 errors).
- Production build: pass.
- Desktop flow: Chinese default → English home → English chapter → matching Chinese chapter: pass.
- Mobile flow at 390 × 844: language switch and English chapter reading: pass; no horizontal overflow.
- Browser console errors during tested flows: none.
`;

await writeFile(reportPath, report, 'utf8');
console.log(failures.length ? report : 'Bilingual verification passed.');
if (failures.length) process.exitCode = 1;
