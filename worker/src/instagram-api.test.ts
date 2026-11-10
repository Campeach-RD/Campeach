// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { publishReel } from './instagram-publisher';

afterEach(() => vi.unstubAllGlobals());

describe('Reel publishing authentication', () => {
  it.each([
    ['facebook', 'graph.facebook.com'],
    ['instagram', 'graph.instagram.com'],
    [undefined, 'graph.instagram.com'],
  ] as const)('uses the %s flow for creation, processing and publication', async (mode, host) => {
    const responses = [{ id: 'container' }, { status_code: 'FINISHED' }, { id: 'media' }];
    const fetchMock = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) => Response.json(responses.shift()));
    vi.stubGlobal('fetch', fetchMock);
    const env = {
      INSTAGRAM_AUTH_MODE: mode,
      INSTAGRAM_ACCESS_TOKEN: 'test-token',
      INSTAGRAM_ACCOUNT_ID: 'account',
      META_GRAPH_API_VERSION: 'v25.0',
      DEDUP: { put: vi.fn().mockResolvedValue(undefined) },
    } as unknown as Env;

    const result = await publishReel({
      videoUrl: 'https://example.com/reel.mp4', caption: 'Caption', campId: 'ocoa', campName: 'Ocoa',
    }, env);

    expect(result.mediaId).toBe('media');
    expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual([
      `https://${host}/v25.0/account/media`,
      `https://${host}/v25.0/container?fields=status_code`,
      `https://${host}/v25.0/account/media_publish`,
    ]);
    const calls = fetchMock.mock.calls as unknown as Array<[string, RequestInit]>;
    expect((calls[0][1].body as FormData).get('access_token')).toBe('test-token');
    expect(calls[1][1].headers).toEqual({ authorization: 'Bearer test-token' });
  });
});
