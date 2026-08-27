import { useCallback, useEffect, useMemo, useRef, useState, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { getChapters, renderMarkdown, type Chapter } from './content';
import { copy, localizedPath, type Language } from './i18n';

type Navigate = (path: string) => void;
type ReaderLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string; navigate: Navigate; children: ReactNode };

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

function InteractiveBook({ language, href, action, navigate }: { language: Language; href: string; action: string; navigate: Navigate }) {
  const text = copy[language];
  const [opening, setOpening] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => () => { if (timer.current !== null) window.clearTimeout(timer.current); }, []);

  const openBook = () => {
    if (timer.current !== null) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { navigate(href); return; }
    setOpening(true);
    timer.current = window.setTimeout(() => navigate(href), 1080);
  };

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
        <span className="book-page-block"><span className="book-page-content"><small>{text.bookInsideKicker}</small><strong>{text.bookInsideTitle}</strong><span>{text.bookInsideCta}</span></span></span>
        <span className="book-spine" />
        <span className="book-cover-panel"><img className="book-cover-art" src="/images/cover.png" alt="" /><span className="book-cover-back" /></span>
      </span>
    </span>
    <span className="book-hint" aria-hidden="true">{text.bookHint}<b>↗</b></span>
  </button>;
}

function Home({ language, path, chapters, navigate, openMenu }: { language: Language; path: string; chapters: Chapter[]; navigate: Navigate; openMenu: () => void }) {
  const text = copy[language];
  const lastSlug = localStorage.getItem(`option-wall:last-chapter:${language}`);
  const startChapter = chapters.find((chapter) => chapter.slug === lastSlug) ?? chapters[0];
  const titlePattern = language === 'zh' ? /^第\s*\d+\s*章\s*/ : /^Chapter\s+\d+[:.]?\s*/i;

  return <div className={`site-shell language-${language}`}>
    <SiteHeader language={language} path={path} navigate={navigate} openMenu={openMenu} />
    <main>
      <section className="hero"><div className="hero-copy"><p className="eyebrow">{text.eyebrow}</p><h1><span className="hero-title-line">{text.heroLead}</span><em className="hero-title-line">{text.heroEm}</em></h1><p className="dek">{text.dek}</p><div className="hero-actions"><ReaderLink className="primary-action" href={localizedPath(language, `/read/${startChapter.slug}`)} navigate={navigate}>{lastSlug ? text.continueReading : text.startReading} <span>→</span></ReaderLink><span className="reading-time">{text.bookStats}</span></div></div><div className="cover-card"><InteractiveBook language={language} href={localizedPath(language, `/read/${startChapter.slug}`)} action={lastSlug ? text.continueReading : text.startReading} navigate={navigate} /></div></section>
      <section className="front-note" aria-label={language === 'zh' ? '卷首寄语' : 'Opening note'}><p>{text.frontBrand}</p><div>{text.frontWords.map((word) => <span key={word}>{word}</span>)}</div><strong>{text.frontWish}</strong></section>
      <section className="manifesto"><p className="section-kicker">{text.manifestoKicker}</p><blockquote>{text.manifestoQuote}</blockquote><div className="manifesto-grid"><p>{text.manifestoOne}</p><p>{text.manifestoTwo}</p></div></section>
      <section className="library" id="chapters"><div className="library-head"><div><p className="section-kicker">{text.libraryKicker}</p><h2>{text.libraryTitle}</h2></div><p>{text.libraryDek}</p></div><div className="chapter-grid">{chapters.map((chapter, index) => <ReaderLink className="chapter-card" href={localizedPath(language, `/read/${chapter.slug}`)} navigate={navigate} key={chapter.slug}><div className="chapter-card-top"><span>{String(index + 1).padStart(2, '0')}</span><small>{chapter.minutes} {text.minute}</small></div><p>{chapter.label}</p><h3>{chapter.title.replace(titlePattern, '')}</h3><div className="chapter-card-bottom"><span>{chapter.description}</span><b>↗</b></div></ReaderLink>)}</div></section>
      <section className="map-section"><figure className="map-preview"><img src="/images/gex-map.png" alt={text.mapAlt} /><figcaption>{text.mapCaption}</figcaption></figure><div><p className="section-kicker">{text.mapKicker}</p><h2>{text.mapTitle.split('\n').map((line, index) => <span key={line}>{line}{index === 0 && <br />}</span>)}</h2><p>{text.mapDek}</p><ReaderLink className="text-action" href={localizedPath(language, '/read/gex-guide')} navigate={navigate}>{text.readGuide} <span>→</span></ReaderLink></div></section>
    </main>
    <footer><span>{text.footerOne}</span><nav className="footer-links" aria-label={text.footerNav}><a href="https://x.com/mm_options" target="_blank" rel="noreferrer">{text.footerX}</a><a href="https://github.com/kain26/options-wall-book/issues" target="_blank" rel="noreferrer">{text.footerGithub}</a></nav><span>{text.footerTwo}</span></footer>
  </div>;
}

function Reader({ language, path, chapter, chapters, navigate, openMenu }: { language: Language; path: string; chapter: Chapter; chapters: Chapter[]; navigate: Navigate; openMenu: () => void }) {
  const text = copy[language];
  const index = chapters.findIndex((item) => item.slug === chapter.slug);
  const previous = chapters[index - 1];
  const next = chapters[index + 1];
  const html = useMemo(() => renderMarkdown(chapter.raw, language), [chapter.raw, language]);
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem('option-wall:theme') === 'dark' ? 'dark' : 'light');
  const [fontSize, setFontSize] = useState(() => { const stored = Number(localStorage.getItem('option-wall:font-size') ?? 1); return Number.isFinite(stored) ? Math.min(1.2, Math.max(.9, stored)) : 1; });
  const titlePattern = language === 'zh' ? /^第\s*\d+\s*章\s*/ : /^Chapter\s+\d+[:.]?\s*/i;

  useEffect(() => { localStorage.setItem(`option-wall:last-chapter:${language}`, chapter.slug); document.title = `${chapter.title} · ${text.siteName}`; window.scrollTo(0, 0); }, [chapter, language, text.siteName]);
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('option-wall:theme', theme); }, [theme]);
  useEffect(() => { document.documentElement.style.setProperty('--reader-scale', String(fontSize)); localStorage.setItem('option-wall:font-size', String(fontSize)); }, [fontSize]);
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
    <div className="mobile-reader-nav">{previous ? <ReaderLink href={localizedPath(language, `/read/${previous.slug}`)} navigate={navigate} aria-label={text.previous}>←</ReaderLink> : <span />}<button type="button" onClick={openMenu}>{index + 1} / {chapters.length} · {text.contents}</button>{next ? <ReaderLink href={localizedPath(language, `/read/${next.slug}`)} navigate={navigate} aria-label={text.next}>→</ReaderLink> : <span />}</div>
  </div>;
}

export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const language: Language = path === '/en' || path.startsWith('/en/') ? 'en' : 'zh';
  const chapters = useMemo(() => getChapters(language), [language]);
  const navigate: Navigate = useCallback((nextPath) => { if (nextPath === window.location.pathname) return; window.history.pushState({}, '', nextPath); setPath(nextPath); }, []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => { const onPopState = () => setPath(window.location.pathname); window.addEventListener('popstate', onPopState); return () => window.removeEventListener('popstate', onPopState); }, []);
  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    const home = path === '/' || path === '/en' || path === '/en/';
    if (home) document.title = copy[language].title;
    const description = language === 'zh'
      ? '《期权墙》买方篇——SPX 0DTE 期权墙、GEX 结构与个人实盘复盘的网页阅读版。'
      : 'Options Wall Buyer Edition: a bilingual web book on SPX 0DTE, GEX structure, market-maker hedging, and historical trade reviews.';
    const shortDescription = language === 'zh' ? '别急着猜涨跌，先看市场的性格。' : 'Stop guessing direction. Start reading structure.';
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', language === 'zh' ? 'zh_CN' : 'en_US');
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', shortDescription);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', document.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', shortDescription);
  }, [language, path]);

  const cleanPath = path.replace(/^\/en(?=\/|$)/, '') || '/';
  const slug = cleanPath.match(/^\/read\/([^/]+)\/?$/)?.[1];
  const chapter = chapters.find((item) => item.slug === slug);

  return <>{chapter ? <Reader language={language} path={path} chapter={chapter} chapters={chapters} navigate={navigate} openMenu={openDrawer} /> : <Home language={language} path={path} chapters={chapters} navigate={navigate} openMenu={openDrawer} />}<ChapterDrawer open={drawerOpen} close={closeDrawer} current={chapter?.slug} navigate={navigate} language={language} chapters={chapters} /></>;
}
