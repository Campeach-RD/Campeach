import { afterEach, describe, expect, it, vi } from 'vitest';
import { publishDailyCarousel } from './instagram-publisher';

describe('editorial carousel publishing', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('sends the editorial caption to Meta and preserves the media receipt', async () => {
    const records = new Map<string, string>();
    const env = {
      DEDUP: {
        get: async (key: string) => records.get(key) ?? null,
        put: async (key: string, value: string) => { records.set(key, value); },
        delete: async (key: string) => { records.delete(key); },
      },
      INSTAGRAM_ACCOUNT_ID: 'test-account', INSTAGRAM_ACCESS_TOKEN: 'test-only', META_GRAPH_API_VERSION: 'v1',
    } as unknown as Env;
    const caption = 'Camping en Ocoa: precio y acceso. Comenta INFO.';
    let transmitted: unknown;
    vi.stubGlobal('fetch', vi.fn(async (url: string, options?: RequestInit) => {
      const body = options?.body as FormData | undefined;
      if (body?.get('media_type') === 'CAROUSEL') transmitted = body.get('caption');
      if (url.includes('?fields=status_code')) return Response.json({ status_code: 'FINISHED' });
      if (url.endsWith('/media_publish')) return Response.json({ id: 'published-carousel' });
      return Response.json({ id: 'container' });
    }));
    const result = await publishDailyCarousel(env, 'ocoa', [1, 2, 3, 4, 5, 6].map(i => `https://example.com/${i}.jpg`), caption);
    expect(transmitted).toBe(caption);
    expect(result.mediaId).toBe('published-carousel');
    expect(JSON.parse(records.get('post:published-carousel')!).campId).toBe('ocoa');
    expect((await publishDailyCarousel(env, 'ocoa')).skipped).toBe(true);
  });
});
