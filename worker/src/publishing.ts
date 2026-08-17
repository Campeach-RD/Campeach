import catalog from '../catalog.generated.json';

export const CAMP_PHOTO_FOLDERS: Record<string, string> = {
  taiku: '1miqNdiADPP5S74N7GOFDp-WD8vtmntew',
  azua: '13NwWFhUgpF6bsGy9QjPyVHZSKw7qk4jU',
  bayaguana: '1R_QkKhQEA56QQRNKGDQqLgDOHwOiid5R',
  bonao: '1qCeYOLNWdsNMVytow_tEBC3iiSaWktkV',
  cabarete: '1TtsYapUH6ofqcjqoDsAQoHS1kbEj0tl3',
  comatillo: '1n0uv4yaXaA9v-APOXX4VziPMgeb-Xc7Y',
  'el-valle': '1MxEuhPn_xT4q5C83Wr_y38v3EJcMf6DN',
  'hato-mayor': '1FOJipb6kI_BfCAqqjEKGz6f3kqOGPo7Q',
  jarabacoa: '1YXKJG5a2ZTJypNdlX2HYsEHBsQAFsZGQ',
  'los-cacaos': '1FcI6Ctm0-fcTbB6-PdqXDaAA1gcB0LvP',
  monsenor: '1bJfkVd1G9odkm7Yr1HTREV19b0PQBRns',
  montellano: '1OXyU8SfRZchNA5Ri_QRXJ6iO6bVUog0G',
  ocoa: '1ryIJvw-N6qZWXXDqMI5K4Z6_6_9B1oap',
  'pinar-del-valle': '1byqZH3SwKwxk9JAjlVc925vkrJL_QIaD',
  'punta-cana': '1kqR-wrxOB4cDDtyW_3gNFcJ_PbB-olYV',
  'rincon-samana': '1DLvgC3CPhmtq2sd8ltJitCxdTWrzMc4h',
  'san-cristobal': '1NgMTZgT5NJC5xjLg1eYyHq3VV2OcuyI3',
  santiago: '1dNr9CiGktTvu0qGhdRgrR4tggbOS_8eg',
  'santo-domingo': '1RtwJ3NkGI-P_HTD_rJnm4cFNPrv5dLGt',
  'villa-altagracia': '1Sj0DrXzfZBrkIEDOYaYXNub6Dxc6oRWY',
};

export type PublishableCamp = (typeof catalog.camps)[number] & { pdfUrl: string };

export const normalizeCampId = (value: string | null | undefined) =>
  (value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll('ñ', 'n').toLowerCase();

export const publishableCamps = catalog.camps.filter(
  (camp): camp is PublishableCamp => Boolean(CAMP_PHOTO_FOLDERS[normalizeCampId(camp.id)] && camp.pdfUrl),
);

export const PRIORITY_CAMP_IDS = [
  'el-valle',
  'ocoa',
  'bonao',
  'santiago',
  'villa-altagracia',
  'monsenor',
  'jarabacoa',
  'hato-mayor',
] as const;

export const chooseDailyCamp = (lastCampId: string | null, randomIndex = 0) => {
  const priority = new Set<string>(PRIORITY_CAMP_IDS);
  const candidates = publishableCamps.filter((camp) => {
    const id = normalizeCampId(camp.id);
    return priority.has(id) && id !== normalizeCampId(lastCampId);
  });
  if (!candidates.length) throw new Error('no_publishable_camps');
  return candidates[Math.abs(randomIndex) % candidates.length];
};

export const choosePhotos = <T>(photos: T[], count: number, randomValues: number[]) => {
  const shuffled = [...photos];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapWith = randomValues[index % randomValues.length] % (index + 1);
    [shuffled[index], shuffled[swapWith]] = [shuffled[swapWith], shuffled[index]];
  }
  return shuffled.slice(0, Math.min(Math.max(count, 4), 10, shuffled.length));
};

export const createCaption = (camp: PublishableCamp) => {
  const highlights = camp.highlights.slice(0, 4).map((item) => `• ${item}`).join('\n');
  return `🏕️ ${camp.name}\n📍 ${camp.location}\n💰 ${camp.priceNote}\n\n${highlights}\n\nComenta INFO y te enviamos todos los detalles por DM. También puedes abrir el enlace de nuestra biografía para ver toda la información.\n\n#CampeachRD #CampingRD #RepublicaDominicana`;
};

const normalizeCaption = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const CAMP_ALIASES: Record<string, string[]> = {
  'el-valle': ['playa el valle', 'campamento el valle'],
  ocoa: ['san jose de ocoa', 'campamento ocoa'],
  bonao: ['campamento bonao'],
  santiago: ['campamento santiago'],
  'villa-altagracia': ['villa altagracia', 'villa altagracia'],
  monsenor: ['campamento monsenor', 'monseñor'],
  jarabacoa: ['campamento jarabacoa'],
  'hato-mayor': ['hato mayor', 'campamento hato mayor'],
};

export const findCampFromCaption = (caption = '') => {
  const normalized = ` ${normalizeCaption(caption)} `;
  const candidates = publishableCamps.flatMap((camp) =>
    [camp.name, camp.id.replaceAll('-', ' '), ...(CAMP_ALIASES[normalizeCampId(camp.id)] ?? [])]
      .map(normalizeCaption)
      .filter((alias) => alias.length >= 4)
      .map((alias) => ({ camp, alias })),
  ).sort((left, right) => right.alias.length - left.alias.length);
  return candidates.find(({ alias }) => normalized.includes(` ${alias} `))?.camp;
};

export const createCommentReply = (camp: PublishableCamp) =>
  `¡Hola! 👋 Esta publicación es sobre ${camp.name}.\n\nToda la información del campamento:\n${catalog.website}?camp=${encodeURIComponent(camp.id)}\n\nPDF del campamento:\n${camp.pdfUrl}\n\nMás enlaces:\nhttps://linktr.ee/CampeachRD`;
