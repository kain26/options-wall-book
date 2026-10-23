import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDirectory = join(projectRoot, 'dist');
const ssrDirectory = join(projectRoot, '.seo-ssr');
const templatePath = join(distDirectory, 'index.html');
const template = await readFile(templatePath, 'utf8');
const ssrFiles = await readdir(ssrDirectory, { recursive: true });
const ssrEntry = ssrFiles.find((file) => file === 'entry-server.js')
  ?? ssrFiles.find((file) => /^entry-server(?:-[\w-]+)?\.js$/.test(basename(file)));

if (!ssrEntry) throw new Error(`Prerender entry was not found in ${ssrDirectory}`);

const { getPrerenderRoutes, renderPage, getChapters, chapterImages } = await import(pathToFileURL(join(ssrDirectory, ssrEntry)).href);

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function meta(attribute, key, value) {
  return `    <meta ${attribute}="${escapeHtml(key)}" content="${escapeHtml(value)}" />`;
}

function renderSeoHead(seo) {
  const head = [
    '    <!-- SEO_HEAD_START -->',
    meta('name', 'description', seo.description),
    meta('name', 'author', '麦麦'),
    meta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'),
    meta('name', 'googlebot', 'index, follow, max-image-preview:large, max-snippet:-1'),
    meta('name', 'bingbot', 'index, follow, max-image-preview:large, max-snippet:-1'),
    meta('property', 'og:type', seo.type),
    meta('property', 'og:locale', seo.language === 'zh' ? 'zh_CN' : 'en_US'),
    meta('property', 'og:site_name', seo.language === 'zh' ? '期权墙' : 'Options Wall'),
    meta('property', 'og:title', seo.title),
    meta('property', 'og:description', seo.description),
    meta('property', 'og:url', seo.canonical),
  ];

  if (seo.image) {
    head.push(
      meta('property', 'og:image', seo.image),
      ...(seo.type === 'website' ? [meta('property', 'og:image:width', '1200'), meta('property', 'og:image:height', '675')] : []),
      meta('property', 'og:image:alt', seo.imageAlt),
    );
  }

  head.push(
    meta('name', 'twitter:card', seo.image ? 'summary_large_image' : 'summary'),
    meta('name', 'twitter:title', seo.title),
    meta('name', 'twitter:description', seo.description),
  );

  if (seo.image) {
    head.push(
      meta('name', 'twitter:image', seo.image),
      meta('name', 'twitter:image:alt', seo.imageAlt),
    );
  }

  if (seo.markdown) head.push(`    <link rel="alternate" type="text/markdown" href="${escapeHtml(seo.markdown)}" />`);
  head.push('    <link rel="describedby" type="application/json" href="/content-index.json" />');
  const structuredData = JSON.stringify(seo.jsonLd).replace(/</g, '\\u003c');
  head.push(
    `    <link rel="canonical" href="${escapeHtml(seo.canonical)}" />`,
    '    <link rel="icon" type="image/png" href="/icon.png" />',
    `    <link rel="alternate" hreflang="zh-CN" href="${escapeHtml(seo.alternateZh)}" />`,
    `    <link rel="alternate" hreflang="en" href="${escapeHtml(seo.alternateEn)}" />`,
    `    <link rel="alternate" hreflang="x-default" href="${escapeHtml(seo.alternateZh)}" />`,
    `    <script id="structured-data" type="application/ld+json">${structuredData}</script>`,
    `    <title>${escapeHtml(seo.title)}</title>`,
    '    <!-- SEO_HEAD_END -->',
  );
  return head.join('\n');
}

function renderDocument(path) {
  const { appHtml, seo } = renderPage(path);
  return {
    seo,
    html: template
      .replace(/<html lang="[^"]+">/, `<html lang="${seo.language === 'zh' ? 'zh-CN' : 'en'}">`)
      .replace(/    <!-- SEO_HEAD_START -->[\s\S]*?    <!-- SEO_HEAD_END -->/, renderSeoHead(seo))
      .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`),
  };
}

function outputPathFor(route) {
  if (route === '/') return templatePath;
  return join(distDirectory, route.replace(/^\//, ''), 'index.html');
}

const routes = getPrerenderRoutes();
const renderedRoutes = [];
for (const route of routes) {
  const outputPath = outputPathFor(route);
  const rendered = renderDocument(route);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, rendered.html);
  const images = [...new Set([...rendered.html.matchAll(/<img\b[^>]*src="(\/images\/[^"?#]+)"/g)].map((match) => match[1]))];
  renderedRoutes.push({ route, seo: rendered.seo, images });
}

const sitemapEntries = renderedRoutes.map(({ seo, images }) => [
  '  <url>',
  `    <loc>${escapeHtml(seo.canonical)}</loc>`,
  `    <xhtml:link rel="alternate" hreflang="zh-CN" href="${escapeHtml(seo.alternateZh)}" />`,
  `    <xhtml:link rel="alternate" hreflang="en" href="${escapeHtml(seo.alternateEn)}" />`,
  `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeHtml(seo.alternateZh)}" />`,
  ...images.map((src) => `    <image:image><image:loc>https://book.myspx.trade${escapeHtml(src)}</image:loc></image:image>`),
  '  </url>',
].join('\n')).join('\n');

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
  sitemapEntries,
  '</urlset>',
  '',
].join('\n');

const robots = [
  'User-agent: *',
  'Allow: /',
  '',
  'Sitemap: https://book.myspx.trade/sitemap.xml',
  '',
].join('\n');

await writeFile(join(distDirectory, 'sitemap.xml'), sitemap);
await writeFile(join(distDirectory, 'robots.txt'), robots);

console.log(`Prerendered ${routes.length} search-friendly routes.`);

// Public reading formats are generated from the same manuscript as the HTML.
const origin = 'https://book.myspx.trade';
const repository = 'https://github.com/kain26/options-wall-book';
const license = 'Original text: CC BY-NC-SA 4.0. Website code: MIT. Images/screenshots excluded unless separately marked; rights remain with their owners.';
const index = { version: 1, title: '期权墙 / Options Wall — Buyer Edition', repository, license, chapters: [] };
const llms = [
  '# 期权墙 / Options Wall — Buyer Edition', '',
  '> Bilingual educational book by 麦麦 (Maimai) about SPX 0DTE, GEX, Call Wall, Put Wall, Gamma Flip and market-maker hedging.', '',
  'Chinese is the original manuscript. English is an AI-assisted translation. Historical examples are not live signals or investment advice. Buyer edition: long calls and long puts.', '',
  license, '',
  `Repository: ${repository}`, '',
  'Community: [期權牆｜香港美股期權交流社群 / Hong Kong US Options Community](https://discord.gg/Yp9UrBaWe9). Discussions cover SPX, 0DTE, GEX, trade reviews and risk management for Hong Kong readers and beyond. Educational discussion, not trade calls.', '',
  `Machine-readable chapter, section and image catalog: ${origin}/content-index.json`, '',
  'Cite the canonical HTML page and section. Markdown mirrors the same text; it is not a separate edition. This optional discovery file is not a Google requirement or a grant of training rights.', '',
];
const headers = [];
for (const language of ['zh', 'en']) {
  llms.push(`## ${language === 'zh' ? '中文原文' : 'English translation'}`, '');
  for (const chapter of getChapters(language)) {
    const canonical = `${origin}${language === 'en' ? '/en' : ''}/read/${chapter.slug}/`;
    const markdownPath = `/content/${language}/${chapter.slug}.md`;
    const sourcePath = `content/${language === 'en' ? 'en/' : ''}chapters/${chapter.file}`;
    const markdown = `<!-- Canonical: ${canonical} -->\n<!-- Author: 麦麦 / Maimai. ${license} -->\n\n` + chapter.raw.replace(/(src|href)="(\/[^" ]*)"/g, (_, attribute, path) => `${attribute}="${origin}${path}"`);
    await mkdir(join(distDirectory, 'content', language), { recursive: true });
    await writeFile(join(distDirectory, markdownPath.slice(1)), markdown);
    index.chapters.push({ language, slug: chapter.slug, title: chapter.title, description: chapter.description, canonical,
      markdown: `${origin}${markdownPath}`, source: `${repository}/blob/main/${sourcePath}`,
      sections: chapter.outline.map(({ title, id }) => ({ title, url: `${canonical}#${id}` })),
      images: chapterImages(chapter).map(({ src, alt }) => ({ url: `${origin}${src}`, description: alt })),
    });
    llms.push(`- [${chapter.title}](${origin}${markdownPath}): ${chapter.description} HTML: ${canonical}`);
    headers.push(markdownPath, '  Content-Type: text/markdown; charset=utf-8', `  Link: <${canonical}>; rel="canonical"`, '');
  }
  llms.push('');
}
await writeFile(join(distDirectory, 'content-index.json'), JSON.stringify(index, null, 2) + '\n');
await writeFile(join(distDirectory, 'llms.txt'), llms.join('\n'));
await writeFile(join(distDirectory, '_headers'), headers.join('\n'));
