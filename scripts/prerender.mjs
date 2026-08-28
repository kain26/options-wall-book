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

const { getPrerenderRoutes, renderPage } = await import(pathToFileURL(join(ssrDirectory, ssrEntry)).href);

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
      meta('property', 'og:image:width', '1200'),
      meta('property', 'og:image:height', '675'),
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
  renderedRoutes.push({ route, seo: rendered.seo });
}

const sitemapEntries = renderedRoutes.map(({ seo }) => [
  '  <url>',
  `    <loc>${escapeHtml(seo.canonical)}</loc>`,
  `    <xhtml:link rel="alternate" hreflang="zh-CN" href="${escapeHtml(seo.alternateZh)}" />`,
  `    <xhtml:link rel="alternate" hreflang="en" href="${escapeHtml(seo.alternateEn)}" />`,
  `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeHtml(seo.alternateZh)}" />`,
  '  </url>',
].join('\n')).join('\n');

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  sitemapEntries,
  '</urlset>',
  '',
].join('\n');

const robots = [
  'User-agent: *',
  'Allow: /',
  '',
  'Sitemap: https://options-wall-book.mmoptions.workers.dev/sitemap.xml',
  '',
].join('\n');

await writeFile(join(distDirectory, 'sitemap.xml'), sitemap);
await writeFile(join(distDirectory, 'robots.txt'), robots);

console.log(`Prerendered ${routes.length} search-friendly routes.`);
