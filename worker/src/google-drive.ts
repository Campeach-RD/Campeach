type ServiceAccount = { client_email: string; private_key: string; token_uri?: string };
type TokenResponse = { access_token?: string; expires_in?: number };

const encodeBase64Url = (value: string | ArrayBuffer) => {
  const bytes = typeof value === 'string' ? new TextEncoder().encode(value) : new Uint8Array(value);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
};

const pemToBytes = (pem: string) => {
  const binary = atob(pem.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g, ''));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

export const getGoogleAccessToken = async (env: Env) => {
  const cached = await env.DEDUP.get('google:access-token', 'json') as { token?: string } | null;
  if (cached?.token) return cached.token;

  const credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON) as ServiceAccount;
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${encodeBase64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${encodeBase64Url(
    JSON.stringify({
      iss: credentials.client_email,
      scope: 'https://www.googleapis.com/auth/drive.readonly',
      aud: credentials.token_uri ?? 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    }),
  )}`;
  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToBytes(credentials.private_key),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(unsigned));
  const assertion = `${unsigned}.${encodeBase64Url(signature)}`;
  const response = await fetch(credentials.token_uri ?? 'https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
  });
  if (!response.ok) throw new Error(`google_token_${response.status}`);
  const result = await response.json<TokenResponse>();
  if (!result.access_token) throw new Error('google_token_missing');
  await env.DEDUP.put('google:access-token', JSON.stringify({ token: result.access_token }), { expirationTtl: 3300 });
  return result.access_token;
};

export const listDriveImages = async (folderId: string, env: Env) => {
  const token = await getGoogleAccessToken(env);
  const images: Array<{ id: string; name: string; mimeType: string }> = [];
  const folders = [{ id: folderId, depth: 0 }];
  while (folders.length) {
    const folder = folders.shift();
    if (!folder) break;
    const url = new URL('https://www.googleapis.com/drive/v3/files');
    url.searchParams.set('q', `'${folder.id}' in parents and trashed = false`);
    url.searchParams.set('pageSize', '1000');
    url.searchParams.set('fields', 'files(id,name,mimeType)');
    url.searchParams.set('corpora', 'allDrives');
    url.searchParams.set('includeItemsFromAllDrives', 'true');
    url.searchParams.set('supportsAllDrives', 'true');
    const response = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
    if (!response.ok) throw new Error(`google_list_${response.status}`);
    const result = await response.json<{ files?: Array<{ id: string; name: string; mimeType: string }> }>();
    for (const file of result.files ?? []) {
      if (file.mimeType === 'image/jpeg') images.push(file);
      if (file.mimeType === 'application/vnd.google-apps.folder' && folder.depth < 3) {
        folders.push({ id: file.id, depth: folder.depth + 1 });
      }
    }
  }
  return images;
};

export const fetchDriveImage = async (fileId: string, env: Env) => {
  const token = await getGoogleAccessToken(env);
  return fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media`, {
    headers: { authorization: `Bearer ${token}` },
    cf: {
      image: {
        width: 1080,
        height: 1350,
        fit: 'cover',
        gravity: 'auto',
        format: 'jpeg',
        quality: 88,
      },
    },
  });
};
