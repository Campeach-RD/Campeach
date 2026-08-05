import { fetchDriveImage, listDriveImages } from './google-drive';
import { CAMP_PHOTO_FOLDERS, chooseDailyCamp, choosePhotos, createCaption } from './publishing';

const graphRequest = async <T>(path: string, env: Env, method = 'GET', body?: Record<string, unknown>) => {
  const response = await fetch(`https://graph.instagram.com/${env.META_GRAPH_API_VERSION}/${path}`, {
    method,
    headers: { authorization: `Bearer ${env.INSTAGRAM_ACCESS_TOKEN}`, 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    console.error(JSON.stringify({ event: 'instagram_publish_api_error', path, status: response.status }));
    throw new Error(`instagram_api_${response.status}`);
  }
  return response.json<T>();
};

const randomNumbers = (length: number) => Array.from(crypto.getRandomValues(new Uint32Array(length)));

const waitForContainer = async (containerId: string, env: Env) => {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const status = await graphRequest<{ status_code?: string }>(`${containerId}?fields=status_code`, env);
    if (status.status_code === 'FINISHED') return;
    if (status.status_code === 'ERROR' || status.status_code === 'EXPIRED') throw new Error(`instagram_container_${status.status_code}`);
    await scheduler.wait(2_000);
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

export const publishDailyCarousel = async (env: Env) => {
  const today = new Date().toISOString().slice(0, 10);
  if (await env.DEDUP.get(`daily-publish:${today}`)) return { skipped: true, reason: 'already_published' };

  const lastCampId = await env.DEDUP.get('daily:last-camp');
  const camp = chooseDailyCamp(lastCampId, randomNumbers(1)[0]);
  const files = await listDriveImages(CAMP_PHOTO_FOLDERS[camp.id], env);
  if (files.length < 4) throw new Error(`insufficient_images_${camp.id}`);
  const count = 4 + (randomNumbers(1)[0] % Math.min(7, files.length - 3));
  const photos = choosePhotos(files, count, randomNumbers(Math.max(files.length, 4)));

  await env.DEDUP.put(`daily-publish:${today}`, 'processing', { expirationTtl: 60 * 60 * 24 * 3 });
  try {
    const children: string[] = [];
    for (const photo of photos) {
      const signature = await mediaSignature(photo.id, env);
      const imageUrl = `${env.PUBLIC_WORKER_URL}/instagram/media/${encodeURIComponent(photo.id)}?sig=${signature}`;
      const child = await graphRequest<{ id: string }>(`${env.INSTAGRAM_ACCOUNT_ID}/media`, env, 'POST', {
        image_url: imageUrl,
        is_carousel_item: true,
      });
      children.push(child.id);
      await waitForContainer(child.id, env);
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
      env.DEDUP.put(`daily-publish:${today}`, published.id, { expirationTtl: 60 * 60 * 24 * 30 }),
    ]);
    console.log(JSON.stringify({ event: 'daily_carousel_published', campId: camp.id, mediaId: published.id, photos: photos.length }));
    return { skipped: false, campId: camp.id, mediaId: published.id };
  } catch (error) {
    await env.DEDUP.delete(`daily-publish:${today}`);
    throw error;
  }
};
