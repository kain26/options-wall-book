import { DurableObject } from 'cloudflare:workers';

interface Env {
  PAGE_VIEW_COUNTER: DurableObjectNamespace<PageViewCounter>;
}

const INITIAL_PAGE_VIEWS = 500;
const COUNTER_KEY = 'pageViews';

const responseHeaders = {
  'Cache-Control': 'no-store, max-age=0',
  'Content-Type': 'application/json; charset=utf-8',
};

export class PageViewCounter extends DurableObject<Env> {
  async current() {
    const stored = await this.ctx.storage.get<number>(COUNTER_KEY);
    if (stored !== undefined && stored >= INITIAL_PAGE_VIEWS) return stored;

    await this.ctx.storage.put(COUNTER_KEY, INITIAL_PAGE_VIEWS);
    return INITIAL_PAGE_VIEWS;
  }

  async increment() {
    const next = await this.current() + 1;
    await this.ctx.storage.put(COUNTER_KEY, next);
    return next;
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname !== '/api/page-views') return new Response(null, { status: 404 });

    if (request.method !== 'GET' && request.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405, headers: { ...responseHeaders, Allow: 'GET, POST' } });
    }

    const origin = request.headers.get('Origin');
    if (request.method === 'POST' && origin && origin !== url.origin) {
      return Response.json({ error: 'Cross-origin requests are not allowed' }, { status: 403, headers: responseHeaders });
    }

    try {
      const counter = env.PAGE_VIEW_COUNTER.getByName('site-total');
      const count = request.method === 'POST' ? await counter.increment() : await counter.current();
      return Response.json({ count }, { headers: responseHeaders });
    } catch (error) {
      console.error('Page-view counter failed', error);
      return Response.json({ error: 'Counter temporarily unavailable' }, { status: 503, headers: responseHeaders });
    }
  },
} satisfies ExportedHandler<Env>;
