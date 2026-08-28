import { renderToString } from 'react-dom/server';
import App from './App';
import { getChapters } from './content';
import { localizedPath, type Language } from './i18n';
import { seoForPath } from './seo';

export function getPrerenderRoutes() {
  const languages: Language[] = ['zh', 'en'];
  return languages.flatMap((language) => [
    localizedPath(language, '/'),
    ...getChapters(language).map((chapter) => localizedPath(language, `/read/${chapter.slug}`)),
  ]);
}

export function renderPage(path: string) {
  return {
    appHtml: renderToString(<App initialPath={path} />),
    seo: seoForPath(path),
  };
}
