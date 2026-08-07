import { fetchDriveImage, listDriveImages } from './google-drive';
import { CAMP_PHOTO_FOLDERS, chooseDailyCamp, choosePhotos, createCaption, publishableCamps } from './publishing';

const graphRequest = async <T>(path: string, env: Env, method = 'GET', body?: Record<string, unknown>) => {
  const formBody = body ? new FormData() : undefined;
  if (formBody && body) {
    for (const [key, value] of Object.entries(body)) {
      formBody.set(key, Array.isArray(value) ? JSON.stringify(value) : String(value));
    }
    formBody.set('access_token', env.INSTAGRAM_ACCESS_TOKEN);
  }
  let response: Response | undefined;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      response = await fetch(`https://graph.instagram.com/${env.META_GRAPH_API_VERSION}/${path}`, {
        method,
        headers: formBody ? undefined : { authorization: `Bearer ${env.INSTAGRAM_ACCESS_TOKEN}` },
        body: formBody,
      });
      break;
    } catch (error) {
      if (attempt === 2) throw error;
      await scheduler.wait(500 * (attempt + 1));
    }
  }
  if (!response) throw new Error('instagram_api_no_response');
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 500);
    console.error(JSON.stringify({ event: 'instagram_publish_api_error', path, status: response.status, detail }));
    throw new Error(`instagram_api_${response.status}_${detail}`);
  }
  return response.json<T>();
};

const randomNumbers = (length: number) => Array.from(crypto.getRandomValues(new Uint32Array(length)));

const waitForContainer = async (containerId: string, env: Env) => {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const status = await graphRequest<{ status_code?: string }>(`${containerId}?fields=status_code`, env);
    if (status.status_code === 'FINISHED') return;
    if (status.status_code === 'ERROR' || status.status_code === 'EXPIRED') throw new Error(`instagram_container_${status.status_code}`);
    await scheduler.wait(5_000);
  }
  throw new Error('instagram_container_timeout');
};

const mediaSignature = async (fileId: string, env: Env) => {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.META_APP_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(fileId));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, '0')).join('');
};

export const verifyMediaSignature = async (fileId: string, signature: string | null, env: Env) => {
  const expected = await mediaSignature(fileId, env);
  if (!signature || signature.length !== expected.length) return false;
  let difference = 0;
  for (let index = 0; index < expected.length; index += 1) difference |= expected.charCodeAt(index) ^ signature.charCodeAt(index);
  return difference === 0;
};

export const serveDriveImage = async (fileId: string, env: Env) => {
  const response = await fetchDriveImage(fileId, env);
  if (!response.ok || !response.body) return new Response('Image unavailable', { status: 502 });
  return new Response(response.body, {
    headers: {
      'content-type': response.headers.get('content-type') ?? 'image/jpeg',
      'cache-control': 'public, max-age=86400',
    },
  });
};

export const publishReel = async (
  { videoUrl, caption, campId, campName, pdfUrl, idempotencyKey }: {
    videoUrl: string;
    caption: string;
    campId: string;
    campName: string;
    pdfUrl?: string;
    idempotencyKey?: string;
  },
  env: Env,
) => {
  const dedupKey = idempotencyKey ? `reel-publish:${idempotencyKey}` : null;
  if (dedupKey) {
    const existing = await env.DEDUP.get(dedupKey, 'json') as { mediaId?: string; status?: string } | null;
    if (existing?.mediaId) return { mediaId: existing.mediaId, skipped: true };
    if (existing?.status === 'processing') throw new Error('reel_publish_in_progress');
    await env.DEDUP.put(dedupKey, JSON.stringify({ status: 'processing' }), { expirationTtl: 60 * 60 });
  }
  try {
    const container = await graphRequest<{ id: string }>(`${env.INSTAGRAM_ACCOUNT_ID}/media`, env, 'POST', {
      media_type: 'REELS',
      video_url: videoUrl,
      caption,
      share_to_feed: true,
    });
    await waitForContainer(container.id, env);
    const published = await graphRequest<{ id: string }>(`${env.INSTAGRAM_ACCOUNT_ID}/media_publish`, env, 'POST', {
      creation_id: container.id,
    });
    const publishedAt = new Date().toISOString();
    const writes = [env.DEDUP.put(
      `post:${published.id}`,
      JSON.stringify({ campId, name: campName, pdfUrl, publishedAt, format: 'reel' }),
      { expirationTtl: 60 * 60 * 24 * 365 },
    )];
    if (dedupKey) {
      writes.push(env.DEDUP.put(dedupKey, JSON.stringify({ mediaId: published.id, publishedAt }), {
        expirationTtl: 60 * 60 * 24 * 365,
      }));
    }
    await Promise.all(writes);
    console.log(JSON.stringify({ event: 'reel_published', campId, mediaId: published.id, idempotencyKey }));
    return { mediaId: published.id, skipped: false };
  } catch (error) {
    if (dedupKey) await env.DEDUP.delete(dedupKey);
    throw error;
  }
};

export const publishDailyCarousel = async (env: Env, requestedCampId?: string, publicImageUrls?: string[]) => {
  const today = new Date().toISOString().slice(0, 10);
  const dailyKey = `daily-publish:${today}`;
  const existing = await env.DEDUP.get(dailyKey);
  if (existing) return { skipped: true, reason: existing === 'processing' ? 'publish_in_progress' : 'already_published', mediaId: existing === 'processing' ? undefined : existing };

  const lastCampId = await env.DEDUP.get('daily:last-camp');
  const camp = requestedCampId
    ? publishableCamps.find((item) => item.id === requestedCampId)
    : chooseDailyCamp(lastCampId, randomNumbers(1)[0]);
  if (!camp) throw new Error('invalid_camp_id');
  const driveFiles = publicImageUrls ? [] : await listDriveImages(CAMP_PHOTO_FOLDERS[camp.id], env);
  const availableCount = publicImageUrls?.length ?? driveFiles.length;
  if (availableCount < 4) throw new Error(`insufficient_images_${camp.id}`);
  const count = publicImageUrls ? publicImageUrls.length : 4 + (randomNumbers(1)[0] % Math.min(7, driveFiles.length - 3));
  const photos: Array<string | { id: string; name: string; mimeType: string }> = publicImageUrls ??
    choosePhotos(driveFiles, count, randomNumbers(Math.max(driveFiles.length, 4)));

  await env.DEDUP.put(dailyKey, 'processing', { expirationTtl: 60 * 60 });
  try {
    const children: string[] = [];
    for (const photo of photos) {
      const imageUrl = typeof photo === 'string'
        ? photo
        : `${env.PUBLIC_WORKER_URL}/instagram/media/${encodeURIComponent(photo.id)}?sig=${await mediaSignature(photo.id, env)}`;
      try {
        const child = await graphRequest<{ id: string }>(`${env.INSTAGRAM_ACCOUNT_ID}/media`, env, 'POST', {
          image_url: imageUrl,
          is_carousel_item: true,
        });
        children.push(child.id);
      } catch (error) {
        throw new Error(`child_create_${error instanceof Error ? error.message : 'unknown'}`);
      }
    }
    try {
      await Promise.all(children.map((childId) => waitForContainer(childId, env)));
    } catch (error) {
      throw new Error(`child_processing_${error instanceof Error ? error.message : 'unknown'}`);
    }

    const container = await graphRequest<{ id: string }>(`${env.INSTAGRAM_ACCOUNT_ID}/media`, env, 'POST', {
      media_type: 'CAROUSEL',
      children,
      caption: createCaption(camp),
    });
    await waitForContainer(container.id, env);
    const published = await graphRequest<{ id: string }>(`${env.INSTAGRAM_ACCOUNT_ID}/media_publish`, env, 'POST', {
      creation_id: container.id,
    });
    const context = JSON.stringify({ campId: camp.id, name: camp.name, pdfUrl: camp.pdfUrl, publishedAt: new Date().toISOString() });
    await Promise.all([
      env.DEDUP.put(`post:${published.id}`, context, { expirationTtl: 60 * 60 * 24 * 365 }),
      env.DEDUP.put('daily:last-camp', camp.id),
      env.DEDUP.put(dailyKey, published.id, { expirationTtl: 60 * 60 * 24 * 30 }),
    ]);
    console.log(JSON.stringify({ event: 'daily_carousel_published', campId: camp.id, mediaId: published.id, photos: photos.length }));
    return { skipped: false, campId: camp.id, mediaId: published.id };
  } catch (error) {
    await env.DEDUP.delete(dailyKey);
    throw error;
  }
};
