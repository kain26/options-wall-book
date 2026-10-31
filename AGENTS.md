# Options Wall — Buyer Edition

## Scope and sources
- This repository publishes https://book.myspx.trade/ in Chinese and English.
- Buyer edition only: SPX 0DTE long calls and long puts. Do not import seller-edition strategies.
- Chinese manuscript: `content/chapters/*.md`; English translation: `content/en/chapters/*.md`.
- `src/content.ts` defines stable chapter slugs and metadata. Keep existing URLs and figure paths stable.
- Images have editorial alt text and captions in the manuscripts. Describe what is shown; do not invent claims, returns, authorship, or image licenses.
- Code is MIT; original text is CC BY-NC-SA 4.0; images/screenshots are excluded unless separately marked. See LICENSE.md.

## Build and verification
- Node >=22.13, pnpm. Install with `pnpm install --frozen-lockfile`.
- Run sequentially: `pnpm build`, `pnpm verify:bilingual`, `pnpm verify:seo`.
- Build prerenders every language/chapter and generates sitemap.xml, robots.txt, llms.txt, content-index.json and Markdown mirrors. Do not edit dist/ or .seo-ssr/.
- SEO metadata: src/seo.ts. Publishing pipeline: scripts/prerender.mjs.
- Content exposed to crawlers must match the visible book. Do not add keyword stuffing, hidden text, invented dates or crawler-only articles.
- After UI changes, inspect desktop and mobile in a browser as well as running builds.

## Publishing
- Production configuration: wrangler.myspx.jsonc; `pnpm deploy:myspx` targets the existing domain. Deploy only within the user's authorized scope.
- Before each commit, verify both `git var GIT_AUTHOR_IDENT` and `git var GIT_COMMITTER_IDENT`: kain26 <xpengkang@outlook.com>.
- GitHub network operations use `git -c http.proxy=http://127.0.0.1:12450 ...`. After push, compare HEAD with live ls-remote branch SHA.
- Report build, push and live deployment separately. Do not claim Google indexing or AI citation based on deployment alone.
