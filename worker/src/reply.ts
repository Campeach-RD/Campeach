import catalog from '../catalog.generated.json';

export type Selection =
  | { kind: 'camp'; id: string }
  | { kind: 'equipment'; id: string }
  | { kind: 'general'; id: '' };

export type Classifier = (message: string) => Promise<Selection>;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const normalize = (value: string) => ` ${slugify(value).replaceAll('-', ' ')} `;

const directSelection = (message: string): Selection | undefined => {
  const normalized = normalize(message);
  const camp = catalog.camps.find((item) => normalized.includes(` ${slugify(item.name).replaceAll('-', ' ')} `));
  if (camp) return { kind: 'camp', id: camp.id };

  const equipment = catalog.equipment.find((item) => normalized.includes(` ${slugify(item.name).replaceAll('-', ' ')} `));
  if (equipment) return { kind: 'equipment', id: equipment.id };

  const tentNumber = normalized.match(/\bcarpa\s+(?:no\s+)?(2|3|4|6)\b/);
  if (tentNumber) return { kind: 'equipment', id: `carpa-no-${tentNumber[1]}` };

  if (/\b(equipo|equipos|alquiler|catalogo de equipos)\b/.test(normalized)) return { kind: 'equipment', id: '' };
  if (/\b(campamento|campamentos|camping|acampar|destinos)\b/.test(normalized)) return { kind: 'general', id: '' };
  if (/^\s*(hola|buenas|saludos|hey)\s*$/.test(normalized)) return { kind: 'general', id: '' };
  return undefined;
};

const generalReply = () =>
  `¡Hola! 👋 En Campeach puedes comparar todos nuestros campamentos y equipos de camping aquí:\n${catalog.website}\n\nSi buscas un lugar o equipo específico, dime su nombre y te envío la información directa.`;

const campReply = (id: string) => {
  const camp = catalog.camps.find((item) => item.id === id);
  if (!camp) return generalReply();
  const highlights = camp.highlights.slice(0, 3).join(' • ');
  return `🏕️ ${camp.name}\n📍 ${camp.location}\n💰 ${camp.priceNote}\n${highlights}\n\nMira fotos, precios, condiciones y toda la información aquí:\n${catalog.website}?camp=${encodeURIComponent(camp.id)}`;
};

const equipmentReply = (id: string) => {
  const item = catalog.equipment.find((candidate) => candidate.id === id);
  if (!item) {
    return `Tenemos carpas, equipos para dormir, muebles y accesorios de camping en alquiler. Puedes ver precios y detalles aquí:\n${catalog.website}#equipos\n\nCatálogo completo:\n${catalog.equipmentCatalogUrl}`;
  }
  return `⛺ ${item.name}\n💰 RD$${item.price.toLocaleString('es-DO')} por noche\n${item.detail}\n\nVer este equipo y el catálogo completo:\n${catalog.website}?equipment=${encodeURIComponent(id)}#equipos`;
};

export async function createReply(message: string, classify?: Classifier) {
  const direct = directSelection(message);
  const selection = direct ?? (classify ? await classify(message) : { kind: 'general' as const, id: '' as const });
  if (selection.kind === 'camp') return campReply(selection.id);
  if (selection.kind === 'equipment') return equipmentReply(selection.id);
  return generalReply();
}

export const classificationCatalog = {
  camps: catalog.camps.map(({ id, name, location, tags }) => ({ id, name, location, tags })),
  equipment: catalog.equipment.map(({ id, name, category }) => ({ id, name, category })),
};
