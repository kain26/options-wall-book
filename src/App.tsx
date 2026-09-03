import { useCallback, useEffect, useMemo, useRef, useState, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { getChapters, renderMarkdown, type Chapter } from './content';
import { copy, localizedPath, type Language } from './i18n';
import { applySeoToDocument, seoForPath } from './seo';

type Navigate = (path: string) => void;
type ReaderLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string; navigate: Navigate; children: ReactNode };
type PageViewResponse = { count: number };

let pageViewRequest: Promise<number> | null = null;

function recordPageView() {
  if (pageViewRequest) return pageViewRequest;

  pageViewRequest = fetch('/api/page-views', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
    keepalive: true,
  }).then(async (response) => {
    if (!response.ok) throw new Error(`Page-view request failed with ${response.status}`);
    const data = await response.json() as PageViewResponse;
    if (!Number.isSafeInteger(data.count) || data.count < 0) throw new Error('Page-view response was invalid');
    return data.count;
  });

  return pageViewRequest;
}

function ReaderLink({ href, navigate, children, ...props }: ReaderLinkProps) {
  return <a {...props} href={href} onClick={(event) => {
    props.onClick?.(event);
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(href);
  }}>{children}</a>;
}

function Mark({ language, navigate }: { language: Language; navigate: Navigate }) {
  const text = copy[language];
  return <ReaderLink className="wordmark" href={localizedPath(language, '/')} navigate={navigate} aria-label={text.homeLabel}>
    <span className="wordmark-symbol" aria-hidden="true"><i /><i /></span><span>{text.siteName}</span>
  </ReaderLink>;
}

function LanguageSwitch({ language, path, navigate }: { language: Language; path: string; navigate: Navigate }) {
  const nextLanguage: Language = language === 'zh' ? 'en' : 'zh';
  const cleanPath = path.replace(/^\/en(?=\/|$)/, '') || '/';
  return <button className="language-switch" type="button" onClick={() => navigate(localizedPath(nextLanguage, cleanPath))} aria-label={copy[language].languageAria}>{copy[language].languageLabel}</button>;
}

function ChapterDrawer({ open, close, current, navigate, language, chapters }: { open: boolean; close: () => void; current?: string; navigate: Navigate; language: Language; chapters: Chapter[] }) {
  const text = copy[language];
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && close();
    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('drawer-open');
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.classList.remove('drawer-open'); };
  }, [open, close]);

  return <div className={`drawer-layer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
    <button className="drawer-scrim" onClick={close} aria-label={text.closeContents} />
    <aside className="chapter-drawer" aria-label={text.fullContents}>
      <div className="drawer-head"><div><small>{text.edition}</small><strong>{text.fullContents}</strong></div><button className="icon-button" type="button" onClick={close} aria-label={text.closeContents}>×</button></div>
      <nav>{chapters.map((chapter, index) => <ReaderLink className={current === chapter.slug ? 'is-current' : ''} href={localizedPath(language, `/read/${chapter.slug}`)} navigate={(next) => { close(); navigate(next); }} key={chapter.slug}>
        <span>{String(index + 1).padStart(2, '0')}</span><div><small>{chapter.label}</small><strong>{chapter.title.replace(language === 'zh' ? /^第\s*\d+\s*章\s*/ : /^Chapter\s+\d+[:.]?\s*/i, '')}</strong></div>
      </ReaderLink>)}</nav>
    </aside>
  </div>;
}

function SiteHeader({ language, path, navigate, openMenu, reading }: { language: Language; path: string; navigate: Navigate; openMenu: () => void; reading?: Chapter }) {
  const text = copy[language];
  return <header className="topbar">
    <Mark language={language} navigate={navigate} />
    <span className="topbar-note">{reading ? reading.label : text.topNote}</span>
    <div className="topbar-actions"><LanguageSwitch language={language} path={path} navigate={navigate} /><button className="quiet-button" type="button" onClick={openMenu}>{text.contents} <span>☰</span></button></div>
  </header>;
}

function SocialIcon({ name }: { name: 'x' | 'github' }) {
  return name === 'x'
    ? <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" /></svg>
    : <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.59 2 12.253c0 4.53 2.865 8.374 6.839 9.73.5.095.682-.222.682-.494 0-.244-.009-.888-.014-1.744-2.782.62-3.369-1.374-3.369-1.374-.455-1.185-1.11-1.5-1.11-1.5-.908-.637.069-.624.069-.624 1.003.073 1.531 1.057 1.531 1.057.892 1.566 2.341 1.114 2.91.852.091-.663.35-1.114.635-1.37-2.221-.259-4.556-1.14-4.556-5.068 0-1.12.39-2.034 1.029-2.752-.103-.26-.446-1.303.098-2.714 0 0 .84-.276 2.75 1.051A9.35 9.35 0 0 1 12 6.977a9.35 9.35 0 0 1 2.504.346c1.909-1.327 2.748-1.051 2.748-1.051.546 1.411.202 2.454.1 2.714.64.718 1.027 1.632 1.027 2.752 0 3.938-2.339 4.806-4.566 5.06.359.317.678.943.678 1.9 0 1.371-.012 2.477-.012 2.814 0 .274.18.594.688.493C19.138 20.624 22 16.782 22 12.253 22 6.59 17.523 2 12 2Z" /></svg>;
}

function Footer({ language, pageViews }: { language: Language; pageViews: number | null }) {
  const text = copy[language];
  const formattedPageViews = pageViews === null ? '—' : new Intl.NumberFormat(language === 'zh' ? 'zh-CN' : 'en-US').format(pageViews);

  return <footer>
    <span>{text.footerOne}</span>
    <div className="footer-center">
      <span className="page-view-count" aria-live="polite">
        <span className="page-view-mark" aria-hidden="true"><i /><i /></span>
        <span>{text.pageViews}</span><strong>{formattedPageViews}</strong><small>{text.pageViewUnit}</small>
      </span>
      <nav className="footer-links" aria-label={text.footerNav}><a href="https://x.com/mm_options" target="_blank" rel="noreferrer" aria-label={text.footerX}><SocialIcon name="x" /></a><a href="https://github.com/kain26/options-wall-book/issues" target="_blank" rel="noreferrer" aria-label={text.footerGithub}><SocialIcon name="github" /></a></nav>
    </div>
    <span>{text.footerTwo}</span>
  </footer>;
}

function InteractiveBook({ language, action, opening, openBook }: { language: Language; action: string; opening: boolean; openBook: () => void }) {
  const text = copy[language];

  return <button
    className={`book-launch ${opening ? 'is-opening' : ''}`}
    type="button"
    onClick={openBook}
    onPointerMove={(event) => {
      if (opening || event.pointerType === 'touch') return;
      const rect = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      event.currentTarget.style.setProperty('--book-tilt-x', `${2 - y * 5}deg`);
      event.currentTarget.style.setProperty('--book-tilt-y', `${-11 + x * 9}deg`);
    }}
    onPointerLeave={(event) => {
      event.currentTarget.style.removeProperty('--book-tilt-x');
      event.currentTarget.style.removeProperty('--book-tilt-y');
    }}
    aria-label={`${text.bookOpenLabel}：${action}`}
    aria-busy={opening}
  >
    <span className="book-stage" aria-hidden="true">
      <span className="book-object">
        <span className="book-page-block" />
        <span className="book-spine" />
        <span className="book-cover-panel"><img className="book-cover-art" src="/images/cover.png" alt="" /><span className="book-cover-back" /></span>
      </span>
    </span>
  </button>;
}

function Home({ language, path, chapters, navigate, openMenu, bookOpening, openBook, pageViews }: { language: Language; path: string; chapters: Chapter[]; navigate: Navigate; openMenu: () => void; bookOpening: boolean; openBook: Navigate; pageViews: number | null }) {
  const text = copy[language];
  const [lastSlug, setLastSlug] = useState<string | null>(null);
  useEffect(() => setLastSlug(localStorage.getItem(`option-wall:last-chapter:${language}`)), [language]);
  const startChapter = chapters.find((chapter) => chapter.slug === lastSlug) ?? chapters[0];
  const titlePattern = language === 'zh' ? /^第\s*\d+\s*章\s*/ : /^Chapter\s+\d+[:.]?\s*/i;

  return <div className={`site-shell language-${language}`}>
    <SiteHeader language={language} path={path} navigate={navigate} openMenu={openMenu} />
    <main>
      <section className="hero"><div className="hero-copy"><p className="eyebrow">{text.eyebrow}</p><h1><span className="hero-title-line">{text.heroLead}</span><em className="hero-title-line">{text.heroEm}</em></h1><p className="dek">{text.dek}</p><div className="hero-actions"><ReaderLink className="primary-action" href={localizedPath(language, `/read/${startChapter.slug}`)} navigate={navigate}>{lastSlug ? text.continueReading : text.startReading} <span>→</span></ReaderLink><span className="reading-time">{text.bookStats}</span></div></div><div className="cover-card"><InteractiveBook language={language} action={lastSlug ? text.continueReading : text.startReading} opening={bookOpening} openBook={() => openBook(localizedPath(language, `/read/${startChapter.slug}`))} /></div></section>
      <section className="front-note" aria-label={language === 'zh' ? '卷首寄语' : 'Opening note'}><p>{text.frontBrand}</p><div>{text.frontWords.map((word) => <span key={word}>{word}</span>)}</div><strong>{text.frontWish}</strong></section>
      <section className="manifesto"><p className="section-kicker">{text.manifestoKicker}</p><blockquote>{text.manifestoQuote}</blockquote><div className="manifesto-grid"><p>{text.manifestoOne}</p><p>{text.manifestoTwo}</p></div></section>
      <section className="library" id="chapters"><div className="library-head"><div><p className="section-kicker">{text.libraryKicker}</p><h2>{text.libraryTitle}</h2></div><p>{text.libraryDek}</p></div><div className="chapter-grid">{chapters.map((chapter, index) => <ReaderLink className="chapter-card" href={localizedPath(language, `/read/${chapter.slug}`)} navigate={navigate} key={chapter.slug}><div className="chapter-card-top"><span>{String(index + 1).padStart(2, '0')}</span><small>{chapter.minutes} {text.minute}</small></div><p>{chapter.label}</p><h3>{chapter.title.replace(titlePattern, '')}</h3><div className="chapter-card-bottom"><span>{chapter.description}</span><b>↗</b></div></ReaderLink>)}</div></section>
      <section className="map-section"><figure className="map-preview"><img src="/images/gex-map.png" alt={text.mapAlt} /><figcaption>{text.mapCaption}</figcaption></figure><div><p className="section-kicker">{text.mapKicker}</p><h2>{text.mapTitle.split('\n').map((line, index) => <span key={line}>{line}{index === 0 && <br />}</span>)}</h2><p>{text.mapDek}</p><ReaderLink className="text-action" href={localizedPath(language, '/read/gex-guide')} navigate={navigate}>{text.readGuide} <span>→</span></ReaderLink></div></section>
    </main>
    <Footer language={language} pageViews={pageViews} />
  </div>;
}

function Reader({ language, path, chapter, chapters, navigate, openMenu, pageViews }: { language: Language; path: string; chapter: Chapter; chapters: Chapter[]; navigate: Navigate; openMenu: () => void; pageViews: number | null }) {
  const text = copy[language];
  const index = chapters.findIndex((item) => item.slug === chapter.slug);
  const previous = chapters[index - 1];
  const next = chapters[index + 1];
  const html = useMemo(() => renderMarkdown(chapter.raw, language), [chapter.raw, language]);
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [fontSize, setFontSize] = useState(1);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const titlePattern = language === 'zh' ? /^第\s*\d+\s*章\s*/ : /^Chapter\s+\d+[:.]?\s*/i;

  useEffect(() => {
    const storedFontSize = Number(localStorage.getItem('option-wall:font-size') ?? 1);
    setTheme(localStorage.getItem('option-wall:theme') === 'dark' ? 'dark' : 'light');
    setFontSize(Number.isFinite(storedFontSize) ? Math.min(1.2, Math.max(.9, storedFontSize)) : 1);
    setSettingsLoaded(true);
  }, []);
  useEffect(() => { localStorage.setItem(`option-wall:last-chapter:${language}`, chapter.slug); window.scrollTo(0, 0); }, [chapter, language]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (settingsLoaded) localStorage.setItem('option-wall:theme', theme);
  }, [theme, settingsLoaded]);
  useEffect(() => {
    document.documentElement.style.setProperty('--reader-scale', String(fontSize));
    if (settingsLoaded) localStorage.setItem('option-wall:font-size', String(fontSize));
  }, [fontSize, settingsLoaded]);
  useEffect(() => {
    let frame = 0;
    const measure = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { const available = document.documentElement.scrollHeight - window.innerHeight; const nextProgress = available > 0 ? Math.round(Math.min(100, (window.scrollY / available) * 100)) : 0; setProgress((current) => current === nextProgress ? current : nextProgress); }); };
    measure(); window.addEventListener('scroll', measure, { passive: true }); window.addEventListener('resize', measure);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', measure); window.removeEventListener('resize', measure); };
  }, [chapter]);

  return <div className={`reader-shell language-${language}`}><div className="reading-progress" style={{ transform: `scaleX(${progress / 100})` }} /><SiteHeader language={language} path={path} navigate={navigate} openMenu={openMenu} reading={chapter} />
    <div className="reader-layout"><aside className="reader-chapters"><p>{text.chapterToc}</p><nav>{chapters.map((item, itemIndex) => <ReaderLink className={item.slug === chapter.slug ? 'is-current' : ''} href={localizedPath(language, `/read/${item.slug}`)} navigate={navigate} key={item.slug}><span>{String(itemIndex + 1).padStart(2, '0')}</span><b>{item.label}</b></ReaderLink>)}</nav></aside>
      <main className="reader-main"><div className="chapter-meta"><span>{chapter.label}</span><span>{text.approx} {chapter.minutes} {text.minute}</span><span>{Math.round(progress)}%</span></div><article className="book-article" dangerouslySetInnerHTML={{ __html: html }} /><nav className="chapter-pagination" aria-label={language === 'zh' ? '章节翻页' : 'Chapter navigation'}>{previous ? <ReaderLink href={localizedPath(language, `/read/${previous.slug}`)} navigate={navigate}><small>{text.previous}</small><strong>← {previous.label}</strong><span>{previous.title.replace(titlePattern, '')}</span></ReaderLink> : <span />}{next ? <ReaderLink href={localizedPath(language, `/read/${next.slug}`)} navigate={navigate}><small>{text.next}</small><strong>{next.label} →</strong><span>{next.title.replace(titlePattern, '')}</span></ReaderLink> : <span />}</nav></main>
      <aside className="reader-tools"><div className="tool-panel"><p>{text.thisChapter}</p><nav>{chapter.outline.slice(0, 14).map((item) => <a className={item.depth === 3 ? 'is-sub' : ''} href={`#${item.id}`} key={item.id}>{item.title}</a>)}</nav></div><div className="display-tools"><button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} type="button" aria-label={text.theme}>{theme === 'light' ? '◐' : '☀'}</button><button onClick={() => setFontSize(Math.max(.9, Number((fontSize - .1).toFixed(1))))} type="button" aria-label={text.smaller}>A−</button><button onClick={() => setFontSize(Math.min(1.2, Number((fontSize + .1).toFixed(1))))} type="button" aria-label={text.larger}>A+</button></div></aside>
    </div>
    <Footer language={language} pageViews={pageViews} />
    <div className="mobile-reader-nav">{previous ? <ReaderLink href={localizedPath(language, `/read/${previous.slug}`)} navigate={navigate} aria-label={text.previous}>←</ReaderLink> : <span />}<button type="button" onClick={openMenu}>{index + 1} / {chapters.length} · {text.contents}</button>{next ? <ReaderLink href={localizedPath(language, `/read/${next.slug}`)} navigate={navigate} aria-label={text.next}>→</ReaderLink> : <span />}</div>
  </div>;
}

export default function App({ initialPath }: { initialPath?: string }) {
  const [path, setPath] = useState(() => initialPath ?? window.location.pathname);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bookTransition, setBookTransition] = useState(false);
  const [pageViews, setPageViews] = useState<number | null>(null);
  const bookTransitioning = useRef(false);
  const transitionTimers = useRef<number[]>([]);
  const language: Language = path === '/en' || path.startsWith('/en/') ? 'en' : 'zh';
  const chapters = useMemo(() => getChapters(language), [language]);
  const navigate: Navigate = useCallback((nextPath) => { if (nextPath === window.location.pathname) return; window.history.pushState({}, '', nextPath); setPath(nextPath); }, []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const openBook: Navigate = useCallback((nextPath) => {
    if (bookTransitioning.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { navigate(nextPath); return; }
    bookTransitioning.current = true;
    setBookTransition(true);
    transitionTimers.current = [
      window.setTimeout(() => navigate(nextPath), 980),
      window.setTimeout(() => {
        setBookTransition(false);
        bookTransitioning.current = false;
        transitionTimers.current = [];
      }, 1080),
    ];
  }, [navigate]);

  useEffect(() => { const onPopState = () => setPath(window.location.pathname); window.addEventListener('popstate', onPopState); return () => window.removeEventListener('popstate', onPopState); }, []);
  useEffect(() => () => transitionTimers.current.forEach((timer) => window.clearTimeout(timer)), []);
  useEffect(() => {
    let active = true;
    recordPageView().then((count) => { if (active) setPageViews(count); }).catch(() => {});
    return () => { active = false; };
  }, []);
  useEffect(() => {
    applySeoToDocument(seoForPath(path));
  }, [path]);

  const cleanPath = path.replace(/^\/en(?=\/|$)/, '') || '/';
  const slug = cleanPath.match(/^\/read\/([^/]+)\/?$/)?.[1];
  const chapter = chapters.find((item) => item.slug === slug);

  return <>{chapter ? <Reader language={language} path={path} chapter={chapter} chapters={chapters} navigate={navigate} openMenu={openDrawer} pageViews={pageViews} /> : <Home language={language} path={path} chapters={chapters} navigate={navigate} openMenu={openDrawer} bookOpening={bookTransition} openBook={openBook} pageViews={pageViews} />}<ChapterDrawer open={drawerOpen} close={closeDrawer} current={chapter?.slug} navigate={navigate} language={language} chapters={chapters} /><div className={`route-fade ${bookTransition ? 'is-active' : ''}`} aria-hidden="true" /></>;
}
