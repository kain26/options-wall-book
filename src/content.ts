import { Marked } from 'marked';

export type OutlineItem = {
  depth: number;
  id: string;
  title: string;
};

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

const chapterModules = import.meta.glob('../content/chapters/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

const chapterMeta = [
  ['00-disclaimer.md', 'before-you-read', '写在前面', '这本书是什么，以及它明确不是什么。'],
  ['00-prologue.md', 'prologue', '序章', '看盘之前，先问自己。'],
  ['00-guide-gex.md', 'gex-guide', '导读', '用半小时看懂一张 GEX 地图。'],
  ['01-hook-0604.md', 'gamma-breakout', '第 1 章', 'Gamma 很强时，为什么市场里仍有人逆势。'],
  ['02-market-makers-gex.md', 'market-makers-gex', '第 2 章', '做市商、对冲反馈与 GEX 的底层机制。'],
  ['03-structure-0dte.md', 'structure-0dte', '第 3 章', '三价位、会动的墙，以及 0DTE 时钟。'],
  ['04-stories-0213-0217.md', 'wall-breaks', '第 4 章', '墙边的两种走法：假跌破与真突破。'],
  ['05-premarket-resonance.md', 'premarket-resonance', '第 5 章', '盘前功课：期权墙、VWAP 与价格行为。'],
  ['06-stories-mid.md', 'market-regimes', '第 6 章', '深 V、共振与墙塌：三种市场性格。'],
  ['07-exit-events-sizing.md', 'exits-events-sizing', '第 7 章', '出场、事件与仓位：活着比赢一把重要。'],
  ['08-story-0123.md', 'liquidity-sweep', '第 8 章', '流动性猎杀：心理墙撞上期权墙。'],
  ['09-think-like-mm.md', 'think-like-mm', '第 9 章', '从猜方向，转向读结构。'],
  ['10-epilogue.md', 'epilogue', '终章', '概率、结构与执行。'],
  ['appendix.md', 'appendix', '附录', '术语、速查表、参考文献与风险提示。'],
] as const;

function sourceFor(file: string) {
  const source = Object.entries(chapterModules).find(([path]) => path.endsWith(`/${file}`))?.[1];
  if (!source) throw new Error(`Missing chapter: ${file}`);
  return source;
}

function plainText(value: string) {
  return value
    .replace(/<[^>]+>/g, '')
    .replace(/[*_`~\[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const ciPaiNames = [
  '水调歌头', '念奴娇', '临江仙', '浣溪沙', '蝶恋花', '定风波',
  '江城子', '虞美人', '卜算子', '鹧鸪天', '采桑子',
];

function isPoemTitle(value: string) {
  const title = plainText(value);
  return ciPaiNames.some((name) => title.startsWith(name));
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
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

export const chapters: Chapter[] = chapterMeta.map(([file, slug, label, description]) => {
  const raw = sourceFor(file);
  const title = plainText(raw.match(/^#\s+(.+)$/m)?.[1] ?? label);
  const readableCharacters = raw
    .replace(/<figure[\s\S]*?<\/figure>/g, '')
    .replace(/[#>*_`|\-[\]()]/g, '')
    .replace(/\s/g, '').length;

  return {
    file,
    slug,
    label,
    title,
    description,
    raw,
    minutes: Math.max(2, Math.ceil(readableCharacters / 520)),
    outline: outlineFor(raw),
  };
});

export const totalMinutes = chapters.reduce((sum, chapter) => sum + chapter.minutes, 0);

export function renderMarkdown(raw: string) {
  let section = 0;
  let poemPending = false;
  const marked = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth }) {
        const content = this.parser.parseInline(tokens);
        if (depth === 1) return `<h1 id="chapter-top">${content}</h1>`;
        if (depth >= 2 && depth <= 3) {
          section += 1;
          if (depth === 3 && isPoemTitle(content)) {
            poemPending = true;
            return `<h3 class="poem-title" id="section-${section}"><small>卷首词</small><span>${content}</span></h3>`;
          }
          return `<h${depth} id="section-${section}">${content}</h${depth}>`;
        }
        return `<h${depth}>${content}</h${depth}>`;
      },
      code({ text }) {
        if (!poemPending) return false;
        poemPending = false;
        const stanzas = text.trim().split(/\n\s*\n/);
        const body = stanzas
          .map((stanza) => `<p>${stanza.split('\n').map(escapeHtml).join('<br />')}</p>`)
          .join('');
        return `<section class="poem-body" aria-label="词作正文">${body}</section>`;
      },
    },
  });
  return marked.parse(raw) as string;
}
