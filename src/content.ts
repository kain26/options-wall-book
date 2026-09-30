import { Marked } from 'marked';
import { copy, type Language } from './i18n';

export type OutlineItem = { depth: number; id: string; title: string };
export type Chapter = {
  file: string;
  slug: string;
  label: string;
  title: string;
  description: string;
  raw: string;
  minutes: number;
  outline: OutlineItem[];
};

const zhModules = import.meta.glob('../content/chapters/*.md', { eager: true, import: 'default', query: '?raw' }) as Record<string, string>;
const enModules = import.meta.glob('../content/en/chapters/*.md', { eager: true, import: 'default', query: '?raw' }) as Record<string, string>;

const chapterMeta = [
  ['00-disclaimer.md', 'before-you-read', ['写在前面', 'Before You Read'], ['这本书是什么，以及它明确不是什么。', 'What this book is—and what it explicitly is not.']],
  ['00-prologue.md', 'prologue', ['序章', 'Prologue'], ['看盘之前，先问自己。', 'Before you read the market, question yourself.']],
  ['00-guide-gex.md', 'gex-guide', ['导读', 'Guide'], ['用半小时看懂一张 GEX 地图。', 'Learn to read a GEX map in half an hour.']],
  ['01-hook-0604.md', 'gamma-breakout', ['第 1 章', 'Chapter 1'], ['Gamma 很强时，为什么市场里仍有人逆势。', 'Why traders still fade the move when gamma is strong.']],
  ['02-market-makers-gex.md', 'market-makers-gex', ['第 2 章', 'Chapter 2'], ['做市商、对冲反馈与 GEX 的底层机制。', 'Market makers, hedging feedback, and the mechanics behind GEX.']],
  ['03-structure-0dte.md', 'structure-0dte', ['第 3 章', 'Chapter 3'], ['三价位、会动的墙，以及 0DTE 时钟。', 'Three key levels, moving walls, and the 0DTE clock.']],
  ['04-stories-0213-0217.md', 'wall-breaks', ['第 4 章', 'Chapter 4'], ['墙边的两种走法：假跌破与真突破。', 'Two paths at the wall: a false break and a true breakout.']],
  ['05-premarket-resonance.md', 'premarket-resonance', ['第 5 章', 'Chapter 5'], ['盘前功课：期权墙、VWAP 与价格行为。', 'Premarket preparation: options walls, VWAP, and price action.']],
  ['06-stories-mid.md', 'market-regimes', ['第 6 章', 'Chapter 6'], ['深 V、共振与墙塌：三种市场性格。', 'Deep V reversals, confluence, and failed walls: three market regimes.']],
  ['07-exit-events-sizing.md', 'exits-events-sizing', ['第 7 章', 'Chapter 7'], ['出场、事件与仓位：活着比赢一把重要。', 'Exits, events, and sizing: survival matters more than one big win.']],
  ['08-story-0123.md', 'liquidity-sweep', ['第 8 章', 'Chapter 8'], ['流动性猎杀：心理墙撞上期权墙。', 'Liquidity sweeps: when the psychological wall meets the options wall.']],
  ['09-think-like-mm.md', 'think-like-mm', ['第 9 章', 'Chapter 9'], ['从猜方向，转向读结构。', 'Stop guessing direction. Start reading structure.']],
  ['10-epilogue.md', 'epilogue', ['终章', 'Epilogue'], ['概率、结构与执行。', 'Probability, structure, and execution.']],
  ['appendix.md', 'appendix', ['附录', 'Appendix'], ['术语、速查表、参考文献与风险提示。', 'Glossary, quick-reference tables, sources, and risk disclosures.']],
] as const;

function plainText(value: string) {
  return value.replace(/<[^>]+>/g, '').replace(/[*_`~\[\]]/g, '').replace(/\s+/g, ' ').trim();
}

function sourceFor(file: string, language: Language) {
  const modules = language === 'en' ? enModules : zhModules;
  const source = Object.entries(modules).find(([modulePath]) => modulePath.endsWith(`/${file}`))?.[1];
  if (!source) throw new Error(`Missing ${language} chapter: ${file}`);
  return source;
}

function outlineFor(raw: string): OutlineItem[] {
  let section = 0;
  const outline: OutlineItem[] = [];
  for (const line of raw.split('\n')) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!match) continue;
    section += 1;
    outline.push({ depth: match[1].length, id: `section-${section}`, title: plainText(match[2]) });
  }
  return outline;
}

export function getChapters(language: Language): Chapter[] {
  const languageIndex = language === 'zh' ? 0 : 1;
  return chapterMeta.map(([file, slug, labels, descriptions]) => {
    const raw = sourceFor(file, language);
    const label = labels[languageIndex];
    const title = plainText(raw.match(/^#\s+(.+)$/m)?.[1] ?? label);
    const readableCharacters = raw.replace(/<figure[\s\S]*?<\/figure>/g, '').replace(/[#>*_`|\-[\]()]/g, '').replace(/\s/g, '').length;
    return {
      file,
      slug,
      label,
      title,
      description: descriptions[languageIndex],
      raw,
      minutes: Math.max(2, Math.ceil(readableCharacters / (language === 'zh' ? 520 : 1050))),
      outline: outlineFor(raw),
    };
  });
}

const ciPaiNames = ['水调歌头', '念奴娇', '临江仙', '浣溪沙', '蝶恋花', '定风波', '江城子', '虞美人', '卜算子', '鹧鸪天', '采桑子'];
const englishPoemPattern = /^(Prelude|Opening Verse|To the Tune|Tune:|Song of|Water Melody|Nian Nu Jiao|Lin Jiang Xian|Butterflies in Love|Calming the Waves|The Beautiful Lady|Song of Divination|Partridge Sky|Mulberry Song)/i;

function isPoemTitle(value: string, language: Language) {
  const title = plainText(value);
  return language === 'zh' ? ciPaiNames.some((name) => title.startsWith(name)) : englishPoemPattern.test(title);
}

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

export function renderMarkdown(raw: string, language: Language) {
  let section = 0;
  let poemPending = false;
  const labels = copy[language];
  const marked = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth }) {
        const content = this.parser.parseInline(tokens);
        if (depth === 1) return `<h1 id="chapter-top">${content}</h1>`;
        if (depth >= 2 && depth <= 3) {
          section += 1;
          if (depth === 3 && isPoemTitle(content, language)) {
            poemPending = true;
            return `<h3 class="poem-title" id="section-${section}"><small>${labels.poemLabel}</small><span>${content}</span></h3>`;
          }
          return `<h${depth} id="section-${section}">${content}</h${depth}>`;
        }
        return `<h${depth}>${content}</h${depth}>`;
      },
      code({ text }) {
        if (!poemPending) return false;
        poemPending = false;
        const body = text.trim().split(/\n\s*\n/).map((stanza) => `<p>${stanza.split('\n').map(escapeHtml).join('<br />')}</p>`).join('');
        return `<section class="poem-body" aria-label="${labels.poemBody}">${body}</section>`;
      },
    },
  });
  return marked.parse(raw) as string;
}
