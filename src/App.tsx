import { useCallback, useEffect, useMemo, useState, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { chapters, renderMarkdown, totalMinutes, type Chapter } from './content';

type Navigate = (path: string) => void;
type ReaderLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  navigate: Navigate;
  children: ReactNode;
};

function ReaderLink({ href, navigate, children, ...props }: ReaderLinkProps) {
  return (
    <a
      {...props}
      href={href}
      onClick={(event) => {
        props.onClick?.(event);
        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        navigate(href);
      }}
    >
      {children}
    </a>
  );
}

function Mark({ navigate }: { navigate: Navigate }) {
  return (
    <ReaderLink className="wordmark" href="/" navigate={navigate} aria-label="期权墙首页">
      <span className="wordmark-symbol" aria-hidden="true"><i /><i /></span>
      <span>期权墙</span>
    </ReaderLink>
  );
}

function ChapterDrawer({ open, close, current, navigate }: { open: boolean; close: () => void; current?: string; navigate: Navigate }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && close();
    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('drawer-open');
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('drawer-open');
    };
  }, [open, close]);

  return (
    <div className={`drawer-layer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <button className="drawer-scrim" onClick={close} aria-label="关闭目录" />
      <aside className="chapter-drawer" aria-label="全书目录">
        <div className="drawer-head">
          <div><small>买方篇</small><strong>全书目录</strong></div>
          <button className="icon-button" type="button" onClick={close} aria-label="关闭目录">×</button>
        </div>
        <nav>
          {chapters.map((chapter, index) => (
            <ReaderLink
              className={current === chapter.slug ? 'is-current' : ''}
              href={`/read/${chapter.slug}`}
              navigate={(path) => { close(); navigate(path); }}
              key={chapter.slug}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div><small>{chapter.label}</small><strong>{chapter.title.replace(/^第\s*\d+\s*章\s*/, '')}</strong></div>
            </ReaderLink>
          ))}
        </nav>
      </aside>
    </div>
  );
}

function SiteHeader({ navigate, openMenu, reading }: { navigate: Navigate; openMenu: () => void; reading?: Chapter }) {
  return (
    <header className="topbar">
      <Mark navigate={navigate} />
      <span className="topbar-note">{reading ? reading.label : 'SPX · 0DTE · 买方篇'}</span>
      <button className="quiet-button" type="button" onClick={openMenu}>目录 <span>☰</span></button>
    </header>
  );
}

function Home({ navigate, openMenu }: { navigate: Navigate; openMenu: () => void }) {
  const lastSlug = localStorage.getItem('option-wall:last-chapter');
  const startChapter = chapters.find((chapter) => chapter.slug === lastSlug) ?? chapters[0];

  return (
    <div className="site-shell">
      <SiteHeader navigate={navigate} openMenu={openMenu} />
      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">一本写给真实交易者的结构手记</p>
            <h1>别急着猜涨跌。<br /><em>先看市场的性格。</em></h1>
            <p className="dek">从期权墙与 GEX 地图出发，读懂做市商对冲、0DTE 的时间压力，以及那些“方向看对了，利润却没留下”的交易日。</p>
            <div className="hero-actions">
              <ReaderLink className="primary-action" href={`/read/${startChapter.slug}`} navigate={navigate}>
                {lastSlug ? '继续阅读' : '开始阅读'} <span>→</span>
              </ReaderLink>
              <span className="reading-time">9 章 · 7 个复盘日 · 约 {Math.round(totalMinutes / 60)} 小时</span>
            </div>
          </div>
          <figure className="cover-card">
            <img src="/images/cover.png" alt="《期权墙》买方篇封面" />
          </figure>
        </section>

        <section className="front-note" aria-label="卷首寄语">
          <p>期 权 墙</p>
          <div><span>读盘</span><span>读结构</span><span>读风险</span><span>也读人性</span></div>
          <strong>愿你少交一点学费</strong>
        </section>

        <section className="manifesto">
          <p className="section-kicker">这本书是什么</p>
          <blockquote>“不是喊单，也不是收益展示。写我怎么看结构，也写我怎么下单、怎么出场、怎么亏。”</blockquote>
          <div className="manifesto-grid">
            <p>先判断今天偏减震，还是偏加速；再谈方向，最后才轮到下单。</p>
            <p>墙会动、会塌、会被穿。真正要练的，是结构失效时那只按得住的手。</p>
          </div>
        </section>

        <section className="library" id="chapters">
          <div className="library-head">
            <div><p className="section-kicker">完整买方篇</p><h2>从一张图，走到一套判断。</h2></div>
            <p>正文、七个历史交易日复盘、术语与一页纸速查，按“先识图、再读结构、最后练执行”的顺序展开。</p>
          </div>
          <div className="chapter-grid">
            {chapters.map((chapter, index) => (
              <ReaderLink className="chapter-card" href={`/read/${chapter.slug}`} navigate={navigate} key={chapter.slug}>
                <div className="chapter-card-top"><span>{String(index + 1).padStart(2, '0')}</span><small>{chapter.minutes} 分钟</small></div>
                <p>{chapter.label}</p>
                <h3>{chapter.title.replace(/^第\s*\d+\s*章\s*/, '')}</h3>
                <div className="chapter-card-bottom"><span>{chapter.description}</span><b>↗</b></div>
              </ReaderLink>
            ))}
          </div>
        </section>

        <section className="map-section">
          <figure className="map-preview">
            <img src="/images/gex-map.png" alt="GEX 期权墙示意图" />
            <figcaption>GEX 图谱：先看厚柱，再看价格站在哪一侧。</figcaption>
          </figure>
          <div><p className="section-kicker">先学会看图</p><h2>三根线，<br />一种市场性格。</h2><p>Call Wall、Gamma Flip、Put Wall 不是机械买卖点。它们是坐标，是市场对冲压力留下的地形。</p><ReaderLink className="text-action" href="/read/gex-guide" navigate={navigate}>读导读 <span>→</span></ReaderLink></div>
        </section>
      </main>
      <footer><span>麦麦 · 个人交易笔记与历史复盘</span><span>期权可能归零 · 不构成投资建议</span></footer>
    </div>
  );
}

function Reader({ chapter, navigate, openMenu }: { chapter: Chapter; navigate: Navigate; openMenu: () => void }) {
  const index = chapters.findIndex((item) => item.slug === chapter.slug);
  const previous = chapters[index - 1];
  const next = chapters[index + 1];
  const html = useMemo(() => renderMarkdown(chapter.raw), [chapter.raw]);
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem('option-wall:theme') === 'dark' ? 'dark' : 'light');
  const [fontSize, setFontSize] = useState(() => {
    const stored = Number(localStorage.getItem('option-wall:font-size') ?? 1);
    return Number.isFinite(stored) ? Math.min(1.2, Math.max(.9, stored)) : 1;
  });

  useEffect(() => {
    localStorage.setItem('option-wall:last-chapter', chapter.slug);
    localStorage.setItem('option-wall:last-path', `/read/${chapter.slug}`);
    document.title = `${chapter.title} · 期权墙`;
    window.scrollTo(0, 0);
  }, [chapter]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('option-wall:theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--reader-scale', String(fontSize));
    localStorage.setItem('option-wall:font-size', String(fontSize));
  }, [fontSize]);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const available = document.documentElement.scrollHeight - window.innerHeight;
        const nextProgress = available > 0 ? Math.round(Math.min(100, (window.scrollY / available) * 100)) : 0;
        setProgress((current) => current === nextProgress ? current : nextProgress);
      });
    };
    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', measure); window.removeEventListener('resize', measure); };
  }, [chapter]);

  return (
    <div className="reader-shell">
      <div className="reading-progress" style={{ transform: `scaleX(${progress / 100})` }} />
      <SiteHeader navigate={navigate} openMenu={openMenu} reading={chapter} />

      <div className="reader-layout">
        <aside className="reader-chapters">
          <p>买方篇 · 目录</p>
          <nav>{chapters.map((item, itemIndex) => (
            <ReaderLink className={item.slug === chapter.slug ? 'is-current' : ''} href={`/read/${item.slug}`} navigate={navigate} key={item.slug}>
              <span>{String(itemIndex + 1).padStart(2, '0')}</span><b>{item.label}</b>
            </ReaderLink>
          ))}</nav>
        </aside>

        <main className="reader-main">
          <div className="chapter-meta"><span>{chapter.label}</span><span>约 {chapter.minutes} 分钟</span><span>{Math.round(progress)}%</span></div>
          <article className="book-article" dangerouslySetInnerHTML={{ __html: html }} />
          <nav className="chapter-pagination" aria-label="章节翻页">
            {previous ? <ReaderLink href={`/read/${previous.slug}`} navigate={navigate}><small>上一篇</small><strong>← {previous.label}</strong><span>{previous.title.replace(/^第\s*\d+\s*章\s*/, '')}</span></ReaderLink> : <span />}
            {next ? <ReaderLink href={`/read/${next.slug}`} navigate={navigate}><small>下一篇</small><strong>{next.label} →</strong><span>{next.title.replace(/^第\s*\d+\s*章\s*/, '')}</span></ReaderLink> : <span />}
          </nav>
        </main>

        <aside className="reader-tools">
          <div className="tool-panel">
            <p>本章</p>
            <nav>{chapter.outline.slice(0, 14).map((item) => <a className={item.depth === 3 ? 'is-sub' : ''} href={`#${item.id}`} key={item.id}>{item.title}</a>)}</nav>
          </div>
          <div className="display-tools">
            <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} type="button" aria-label="切换明暗主题">{theme === 'light' ? '◐' : '☀'}</button>
            <button onClick={() => setFontSize(Math.max(.9, Number((fontSize - .1).toFixed(1))))} type="button" aria-label="缩小字号">A−</button>
            <button onClick={() => setFontSize(Math.min(1.2, Number((fontSize + .1).toFixed(1))))} type="button" aria-label="放大字号">A+</button>
          </div>
        </aside>
      </div>

      <div className="mobile-reader-nav">
        {previous ? <ReaderLink href={`/read/${previous.slug}`} navigate={navigate} aria-label="上一篇">←</ReaderLink> : <span />}
        <button type="button" onClick={openMenu}>{index + 1} / {chapters.length} · 目录</button>
        {next ? <ReaderLink href={`/read/${next.slug}`} navigate={navigate} aria-label="下一篇">→</ReaderLink> : <span />}
      </div>
    </div>
  );
}

export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate: Navigate = useCallback((nextPath) => {
    if (nextPath === window.location.pathname) return;
    window.history.pushState({}, '', nextPath);
    setPath(nextPath);
  }, []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (path === '/') document.title = '期权墙 · SPX 日内实战入门（买方篇）';
  }, [path]);

  const slug = path.match(/^\/read\/([^/]+)\/?$/)?.[1];
  const chapter = chapters.find((item) => item.slug === slug);

  return (
    <>
      {chapter ? <Reader chapter={chapter} navigate={navigate} openMenu={openDrawer} /> : <Home navigate={navigate} openMenu={openDrawer} />}
      <ChapterDrawer open={drawerOpen} close={closeDrawer} current={chapter?.slug} navigate={navigate} />
    </>
  );
}
