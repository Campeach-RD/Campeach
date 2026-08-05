import { brand, camps, equipment, equipmentCatalog } from './data';

export type BotSelection =
  | { kind: 'camp'; id: string }
  | { kind: 'equipment'; id: string }
  | { kind: 'general' };

export type BotClassifier = (message: string) => Promise<BotSelection>;

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const normalize = (value: string) => ` ${slugify(value).replaceAll('-', ' ')} `;
const siteUrl = `${brand.website}/campeach`;

const directSelection = (message: string): BotSelection | undefined => {
  const normalized = normalize(message);
  const camp = camps.find((item) => normalized.includes(` ${slugify(item.name).replaceAll('-', ' ')} `));
  if (camp) return { kind: 'camp', id: camp.id };

  const item = equipment.find((candidate) => normalized.includes(` ${slugify(candidate.name).replaceAll('-', ' ')} `));
  if (item) return { kind: 'equipment', id: slugify(item.name) };

  if (/\b(carpa|equipo|sleeping|silla|hamaca|mesa|mochila|lampara|abanico|proyector|alquiler)\b/.test(normalized)) {
    return { kind: 'equipment', id: '' };
  }
  if (/\b(campamento|camping|acampar|destino|playa|rio|montana|piscina)\b/.test(normalized)) {
    return { kind: 'general' };
  }
  return undefined;
};

const generalReply = () =>
  `¡Hola! 👋 En Campeach puedes comparar todos nuestros campamentos y equipos de camping aquí:\n${siteUrl}\n\nSi buscas un lugar o equipo específico, dime su nombre y te envío la información directa.`;

const campReply = (id: string) => {
  const camp = camps.find((item) => item.id === id);
  if (!camp) return generalReply();
  const highlights = camp.highlights.slice(0, 3).join(' • ');
  return `🏕️ ${camp.name}\n📍 ${camp.location}\n💰 ${camp.priceNote}\n${highlights}\n\nMira fotos, precios, condiciones y toda la información aquí:\n${siteUrl}?camp=${encodeURIComponent(camp.id)}`;
};

const equipmentReply = (id: string) => {
  const item = equipment.find((candidate) => slugify(candidate.name) === id);
  if (!item) {
    return `Tenemos carpas, equipos para dormir, muebles y accesorios de camping en alquiler. Puedes ver precios y detalles aquí:\n${siteUrl}#equipos\n\nCatálogo completo:\n${equipmentCatalog.url}`;
  }
  return `⛺ ${item.name}\n💰 RD$${item.price.toLocaleString('es-DO')} por noche\n${item.detail}\n\nVer este equipo y el catálogo completo:\n${siteUrl}?equipment=${encodeURIComponent(id)}#equipos`;
};

export async function createInstagramReply(message: string, classify?: BotClassifier) {
  const direct = directSelection(message);
  const selection = direct ?? (classify ? await classify(message) : { kind: 'general' as const });
  if (selection.kind === 'camp') return campReply(selection.id);
  if (selection.kind === 'equipment') return equipmentReply(selection.id);
  return generalReply();
}

export const botCatalog = {
  camps: camps.map((camp) => ({ id: camp.id, name: camp.name, location: camp.location, tags: camp.tags })),
  equipment: equipment.map((item) => ({ id: slugify(item.name), name: item.name, category: item.category })),
};
