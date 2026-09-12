import { getChapters, type Chapter } from './content';
import { copy, localizedPath, type Language } from './i18n';

export const SITE_URL = 'https://book.myspx.trade';

export type SeoData = {
  language: Language;
  title: string;
  description: string;
  canonical: string;
  alternateZh: string;
  alternateEn: string;
  type: 'website' | 'article';
  image?: string;
  imageAlt?: string;
  jsonLd: unknown;
};

function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

function routeDetails(path: string) {
  const language: Language = path === '/en' || path.startsWith('/en/') ? 'en' : 'zh';
  const cleanPath = path.replace(/^\/en(?=\/|$)/, '') || '/';
  const slug = cleanPath.match(/^\/read\/([^/]+)\/?$/)?.[1];
  const chapter = slug ? getChapters(language).find((item) => item.slug === slug) : undefined;
  return { language, cleanPath: chapter ? `/read/${chapter.slug}` : '/', chapter };
}

function homeDescription(language: Language) {
  return language === 'zh'
    ? '期权墙中文入门与实战指南：系统讲解 SPX 0DTE、GEX、Call Wall、Put Wall、Gamma Flip、做市商对冲与历史交易复盘。'
    : 'Options Wall is a bilingual field guide to SPX 0DTE, GEX, call and put walls, gamma flips, market-maker hedging, and historical trade reviews.';
}

function chapterDescription(chapter: Chapter, language: Language) {
  return language === 'zh'
    ? `${chapter.description} 本章选自《期权墙》SPX 0DTE、GEX 与做市商对冲中文实战指南。`
    : `${chapter.description} A chapter from Options Wall, the SPX 0DTE, GEX, and market-maker hedging field guide.`;
}

function author() {
  return {
    '@type': 'Person',
    name: '麦麦',
    alternateName: 'Maimai',
    sameAs: ['https://x.com/mm_options'],
  };
}

function bookReference(language: Language) {
  return {
    '@type': 'Book',
    '@id': `${absoluteUrl(localizedPath(language, '/'))}#book`,
    name: language === 'zh' ? '期权墙 · SPX 日内实战入门（买方篇）' : 'Options Wall · An SPX Intraday Field Guide (Buyer Edition)',
    inLanguage: language === 'zh' ? 'zh-CN' : 'en',
    url: absoluteUrl(localizedPath(language, '/')),
  };
}

function homeStructuredData(language: Language, description: string) {
  const chapters = getChapters(language);
  const homeUrl = absoluteUrl(localizedPath(language, '/'));
  const book = bookReference(language);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${homeUrl}#website`,
        name: language === 'zh' ? '期权墙' : 'Options Wall',
        url: homeUrl,
        description,
        inLanguage: language === 'zh' ? 'zh-CN' : 'en',
      },
      {
        ...book,
        alternateName: language === 'zh' ? 'Options Wall Buyer Edition' : '期权墙 · 买方篇',
        description,
        image: absoluteUrl('/og.png'),
        author: author(),
        isAccessibleForFree: true,
        about: ['SPX 0DTE', 'GEX', 'Options Wall', 'Market-maker hedging', 'Call Wall', 'Put Wall', 'Gamma Flip'],
        hasPart: chapters.map((chapter) => ({
          '@type': 'Chapter',
          name: chapter.title,
          url: absoluteUrl(localizedPath(language, `/read/${chapter.slug}`)),
          inLanguage: language === 'zh' ? 'zh-CN' : 'en',
        })),
      },
    ],
  };
}

function chapterStructuredData(chapter: Chapter, language: Language, canonical: string, description: string) {
  const homeUrl = absoluteUrl(localizedPath(language, '/'));
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${canonical}#article`,
        headline: chapter.title,
        description,
        url: canonical,
        mainEntityOfPage: canonical,
        inLanguage: language === 'zh' ? 'zh-CN' : 'en',
        author: author(),
        isPartOf: bookReference(language),
        about: ['SPX 0DTE', 'GEX', 'Options Wall', 'Market-maker hedging'],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: language === 'zh' ? '期权墙' : 'Options Wall',
            item: homeUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: chapter.title,
            item: canonical,
          },
        ],
      },
    ],
  };
}

export function seoForPath(path: string): SeoData {
  const { language, cleanPath, chapter } = routeDetails(path);
  const route = localizedPath(language, cleanPath);
  const canonical = absoluteUrl(route);
  const description = chapter ? chapterDescription(chapter, language) : homeDescription(language);
  const descriptiveChapterTitle = chapter && chapter.title.length < 8
    ? `${chapter.title}${language === 'zh' ? '：' : ': '}${chapter.description.replace(/[。.!?]$/, '')}`
    : chapter?.title;
  const title = chapter ? `${descriptiveChapterTitle}｜${copy[language].siteName}` : copy[language].title;
  const isHome = !chapter;

  return {
    language,
    title,
    description,
    canonical,
    alternateZh: absoluteUrl(localizedPath('zh', cleanPath)),
    alternateEn: absoluteUrl(localizedPath('en', cleanPath)),
    type: chapter ? 'article' : 'website',
    image: isHome ? absoluteUrl('/og.png') : undefined,
    imageAlt: isHome
      ? language === 'zh'
        ? '《期权墙》SPX 0DTE 与 GEX 中文交易指南'
        : 'Options Wall: an SPX 0DTE and GEX field guide'
      : undefined,
    jsonLd: chapter
      ? chapterStructuredData(chapter, language, canonical, description)
      : homeStructuredData(language, description),
  };
}

function setMeta(attribute: 'name' | 'property', key: string, value?: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!value) {
    element?.remove();
    return;
  }
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.append(element);
  }
  element.content = value;
}

function setLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    if (hreflang) element.hreflang = hreflang;
    document.head.append(element);
  }
  element.href = href;
}

export function applySeoToDocument(seo: SeoData) {
  document.documentElement.lang = seo.language === 'zh' ? 'zh-CN' : 'en';
  document.title = seo.title;
  setMeta('name', 'description', seo.description);
  setMeta('name', 'author', '麦麦');
  setMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  setMeta('name', 'googlebot', 'index, follow, max-image-preview:large, max-snippet:-1');
  setMeta('name', 'bingbot', 'index, follow, max-image-preview:large, max-snippet:-1');
  setMeta('property', 'og:type', seo.type);
  setMeta('property', 'og:locale', seo.language === 'zh' ? 'zh_CN' : 'en_US');
  setMeta('property', 'og:site_name', seo.language === 'zh' ? '期权墙' : 'Options Wall');
  setMeta('property', 'og:title', seo.title);
  setMeta('property', 'og:description', seo.description);
  setMeta('property', 'og:url', seo.canonical);
  setMeta('property', 'og:image', seo.image);
  setMeta('property', 'og:image:width', seo.image ? '1200' : undefined);
  setMeta('property', 'og:image:height', seo.image ? '675' : undefined);
  setMeta('property', 'og:image:alt', seo.imageAlt);
  setMeta('name', 'twitter:card', seo.image ? 'summary_large_image' : 'summary');
  setMeta('name', 'twitter:title', seo.title);
  setMeta('name', 'twitter:description', seo.description);
  setMeta('name', 'twitter:image', seo.image);
  setMeta('name', 'twitter:image:alt', seo.imageAlt);
  setLink('canonical', seo.canonical);
  setLink('alternate', seo.alternateZh, 'zh-CN');
  setLink('alternate', seo.alternateEn, 'en');
  setLink('alternate', seo.alternateZh, 'x-default');

  let structuredData = document.head.querySelector<HTMLScriptElement>('#structured-data');
  if (!structuredData) {
    structuredData = document.createElement('script');
    structuredData.id = 'structured-data';
    structuredData.type = 'application/ld+json';
    document.head.append(structuredData);
  }
  structuredData.textContent = JSON.stringify(seo.jsonLd);
}
