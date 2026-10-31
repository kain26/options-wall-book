import { readFile, readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const distDirectory = join(projectRoot, 'dist');
const origin = 'https://book.myspx.trade';

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

function routeForFile(file) {
  const path = relative(distDirectory, file).split(sep).join('/');
  return path === 'index.html' ? '/' : `/${path.replace(/index\.html$/, '')}`;
}

function matchOne(html, pattern, label, route) {
  const match = html.match(pattern);
  expect(match, `${route}: missing ${label}`);
  return match[1];
}

const files = (await readdir(distDirectory, { recursive: true }))
  .filter((file) => file === 'index.html' || file.endsWith(`${sep}index.html`) || file.endsWith('/index.html'))
  .map((file) => join(distDirectory, file))
  .sort();

expect(files.length === 30, `Expected 30 prerendered pages, found ${files.length}`);

const canonicals = new Set();
for (const file of files) {
  const route = routeForFile(file);
  const html = await readFile(file, 'utf8');
  const expectedCanonical = new URL(route, origin).toString();
  const canonical = matchOne(html, /<link rel="canonical" href="([^"]+)" \/>/, 'canonical URL', route);
  const title = matchOne(html, /<title>([^<]+)<\/title>/, 'title', route);
  const description = matchOne(html, /<meta name="description" content="([^"]+)" \/>/, 'description', route);
  const structuredData = matchOne(html, /<script id="structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/, 'JSON-LD', route);

  expect(canonical === expectedCanonical, `${route}: canonical does not match route`);
  expect(!canonicals.has(canonical), `${route}: duplicate canonical`);
  expect(title.length >= 8, `${route}: title is too short`);
  expect(description.length >= 40, `${route}: description is too short`);
  expect(html.includes(`hreflang="zh-CN"`), `${route}: missing zh-CN alternate`);
  expect(html.includes(`hreflang="en"`), `${route}: missing English alternate`);
  expect(html.includes(`hreflang="x-default"`), `${route}: missing x-default alternate`);
  expect(html.includes('name="googlebot"'), `${route}: missing Googlebot directive`);
  expect(html.includes('name="bingbot"'), `${route}: missing Bingbot directive`);
  expect(html.includes('name="google-site-verification" content="QGtjnK3u5aQK5SwLzrHjCXJe5wpaIOFD_rI9spDc-fE"'), `${route}: missing Google verification tag`);
  expect(html.includes('name="google-site-verification" content="AH4Xq-QPjy9Wmj-FRC4VdLbJMe4cub5PC11qu8x1rf4"'), `${route}: missing Google custom-domain verification tag`);
  expect(html.includes('name="msvalidate.01" content="0BF00965E467D2C3B2B4D1244E4383D0"'), `${route}: missing Microsoft verification tag`);
  expect(html.includes('<div id="root"><'), `${route}: missing server-rendered content`);
  JSON.parse(structuredData);

  if (route.includes('/read/')) {
    expect(html.includes('<article class="book-article">'), `${route}: missing prerendered chapter article`);
    expect(html.includes('property="og:type" content="article"'), `${route}: chapter is not marked as an article`);
    const data = JSON.parse(structuredData);
    const article = data['@graph'].find((item) => item['@type'] === 'Article');
    expect(!html.includes('property="og:image" content="https://book.myspx.trade/og.png"'), `${route}: generic chapter image`);
    expect(html.includes('type="text/markdown"'), `${route}: missing Markdown alternate`);
    for (const image of article.image) {
      expect(html.includes(image.contentUrl.replace(origin, '')), `${route}: structured image is not visible`);
      expect(image.caption.length > 0, `${route}: missing image description`);
    }
  } else {
    expect(html.includes('property="og:type" content="website"'), `${route}: home is not marked as a website`);
    expect(html.includes('property="og:image"'), `${route}: home is missing its social image`);
  }
  canonicals.add(canonical);
}

const sitemap = await readFile(join(distDirectory, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
expect(sitemapUrls.length === 30, `Expected 30 sitemap URLs, found ${sitemapUrls.length}`);
expect(new Set(sitemapUrls).size === 30, 'Sitemap contains duplicate URLs');
expect(sitemapUrls.every((url) => canonicals.has(url)), 'Sitemap and page canonical URLs differ');

const robots = await readFile(join(distDirectory, 'robots.txt'), 'utf8');
expect(robots.includes('User-agent: *\nAllow: /'), 'robots.txt does not allow crawlers');
expect(robots.includes(`${origin}/sitemap.xml`), 'robots.txt does not advertise the sitemap');

console.log('SEO verification passed: 30 prerendered pages, 30 canonical sitemap URLs, valid JSON-LD, Googlebot and Bingbot access.');

const index = JSON.parse(await readFile(join(distDirectory, 'content-index.json'), 'utf8'));
expect(index.chapters.length === 28, 'Expected 28 machine-readable chapters');
const llms = await readFile(join(distDirectory, 'llms.txt'), 'utf8');
const headers = await readFile(join(distDirectory, '_headers'), 'utf8');
for (const chapter of index.chapters) {
  expect(canonicals.has(chapter.canonical), 'Catalog canonical is not a rendered page');
  const markdownPath = new URL(chapter.markdown).pathname;
  const markdown = await readFile(join(distDirectory, markdownPath.slice(1)), 'utf8');
  expect(markdown.includes(chapter.canonical) && markdown.includes('# '), 'Markdown missing source or body');
  expect(llms.includes(chapter.markdown), 'llms index missing chapter');
  expect(headers.includes(`Link: <${chapter.canonical}>; rel="canonical"`), 'Missing Markdown canonical header');
  const page = await readFile(join(distDirectory, new URL(chapter.canonical).pathname, 'index.html'), 'utf8');
  for (const section of chapter.sections) expect(page.includes(`id="${new URL(section.url).hash.slice(1)}"`), 'Broken section anchor');
  for (const image of chapter.images) {
    await readFile(join(distDirectory, new URL(image.url).pathname));
    expect(sitemap.includes(`<image:loc>${image.url}</image:loc>`), 'Image absent from sitemap');
  }
}
console.log('Agent/image verification passed: 28 Markdown mirrors, catalog anchors, image files and sitemap entries.');
