export type Language = 'zh' | 'en';

export const copy = {
  zh: {
    siteName: '期权墙', homeLabel: '期权墙首页', edition: '买方篇', contents: '目录', fullContents: '全书目录', closeContents: '关闭目录',
    topNote: 'SPX · 0DTE · 买方篇', languageLabel: 'EN', languageAria: 'Read in English',
    eyebrow: '一本写给真实交易者的结构手记', heroLead: '别急着猜涨跌，', heroEm: '先看市场的性格。',
    dek: '从期权墙与 GEX 地图出发，读懂做市商对冲、0DTE 的时间压力，以及那些“方向看对了，利润却没留下”的交易日。',
    continueReading: '继续阅读', startReading: '开始阅读', bookStats: '9 章 · 7 个复盘日',
    frontBrand: '期 权 墙', frontWords: ['读盘', '读结构', '读风险', '也读人性'], frontWish: '愿你少交一点学费',
    manifestoKicker: '这本书是什么', manifestoQuote: '“不是喊单，也不是收益展示。写我怎么看结构，怎么进场、出场，也写判断失误与亏损。”',
    manifestoOne: '先判断今天偏减震，还是偏加速；再谈方向，最后才轮到下单。', manifestoTwo: '墙会动、会塌、会被穿。真正要练的，是结构失效时那只按得住的手。',
    libraryKicker: '完整买方篇', libraryTitle: '从一张图，走到一套判断。', libraryDek: '正文、七个历史交易日复盘、术语与一页纸速查，按“先识图、再读结构、最后练执行”的顺序展开。',
    minute: '分钟', approx: '约', chapterToc: '买方篇 · 目录', thisChapter: '本章', previous: '上一篇', next: '下一篇',
    mapAlt: 'GEX 期权墙示意图', mapCaption: 'GEX 图谱：先看厚柱，再看价格站在哪一侧。', mapKicker: '先学会看图', mapTitle: '三根线，\n一种市场性格。', mapDek: 'Call Wall、Gamma Flip、Put Wall 不是机械买卖点。它们是坐标，是市场对冲压力留下的地形。', readGuide: '读导读',
    footerOne: '麦麦 · 个人交易笔记与历史复盘', footerTwo: '期权可能归零 · 不构成投资建议',
    poemLabel: '卷首词', poemBody: '词作正文', theme: '切换明暗主题', smaller: '缩小字号', larger: '放大字号',
    title: '期权墙 · SPX 日内实战入门（买方篇）', coverAlt: '《期权墙》买方篇 3D 精装书封面',
  },
  en: {
    siteName: 'Options Wall', homeLabel: 'Options Wall home', edition: 'Buyer Edition', contents: 'Contents', fullContents: 'Book contents', closeContents: 'Close contents',
    topNote: 'SPX · 0DTE · BUYER EDITION', languageLabel: '中文', languageAria: '切换到中文',
    eyebrow: 'A STRUCTURAL FIELD GUIDE FOR REAL TRADERS', heroLead: 'Before you guess direction,', heroEm: 'read the market\'s character.',
    dek: 'Start with options walls and the GEX map. Learn how market-maker hedging, the 0DTE clock, and shifting structure shape the days when your direction was right but the profit still slipped away.',
    continueReading: 'Continue reading', startReading: 'Start reading', bookStats: '9 chapters · 7 trade reviews',
    frontBrand: 'OPTIONS WALL', frontWords: ['Read price', 'Read structure', 'Read risk', 'Read yourself'], frontWish: 'May you pay less tuition to the market',
    manifestoKicker: 'WHAT THIS BOOK IS', manifestoQuote: '“Not trade calls. Not a highlight reel. This is how I read structure, enter and exit—and how I face bad calls and losses.”',
    manifestoOne: 'First decide whether the market is absorbing movement or accelerating it. Direction comes next. The trade comes last.', manifestoTwo: 'Walls move, fail, and break. The real skill is keeping your hand still when the structure no longer supports the trade.',
    libraryKicker: 'THE COMPLETE BUYER EDITION', libraryTitle: 'From one chart to a repeatable framework.', libraryDek: 'Core chapters, seven historical trade reviews, a glossary, and a one-page checklist—ordered from reading the map, to reading structure, to executing with discipline.',
    minute: 'min', approx: 'about', chapterToc: 'Buyer Edition · Contents', thisChapter: 'In this chapter', previous: 'Previous', next: 'Next',
    mapAlt: 'Illustration of a GEX options-wall map', mapCaption: 'A GEX map: find the largest concentrations, then locate price within the structure.', mapKicker: 'LEARN THE MAP FIRST', mapTitle: 'Three levels.\nOne market character.', mapDek: 'Call Wall, Gamma Flip, and Put Wall are not mechanical entry signals. They are coordinates—the terrain left by hedging pressure.', readGuide: 'Read the guide',
    footerOne: 'Maimai · Personal trading notes and historical reviews', footerTwo: 'Options can expire worthless · Not investment advice',
    poemLabel: 'Opening verse', poemBody: 'Opening verse text', theme: 'Toggle light or dark theme', smaller: 'Decrease font size', larger: 'Increase font size',
    title: 'Options Wall · An SPX Intraday Field Guide (Buyer Edition)', coverAlt: 'Options Wall Buyer Edition 3D hardcover book',
  },
} as const;

export function localizedPath(language: Language, path: string) {
  const clean = path === '/' ? '' : path;
  return language === 'en' ? `/en${clean}` : path;
}
