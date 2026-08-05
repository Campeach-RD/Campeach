import { createServer } from 'vite';
import { mkdir, writeFile } from 'node:fs/promises';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });

try {
  const { brand, camps, equipment, equipmentCatalog } = await server.ssrLoadModule('/src/campeach/data.ts');
  const catalog = {
    website: `${brand.website}/campeach`,
    equipmentCatalogUrl: equipmentCatalog.url,
    camps: camps.map((camp) => ({
      id: camp.id,
      name: camp.name,
      location: camp.location,
      priceNote: camp.priceNote,
      tags: camp.tags,
      highlights: camp.highlights,
      intro: camp.richInfo?.intro ?? '',
      important: camp.richInfo?.important ?? [],
      includes: camp.richInfo?.includes ?? [],
      pricing: camp.richInfo?.pricing ?? [],
      lodging: camp.richInfo?.lodging ?? [],
      food: camp.richInfo?.food ?? [],
      activities: camp.activities,
      rules: camp.rules,
    })),
    equipment: equipment.map((item) => ({
      id: item.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      name: item.name,
      category: item.category,
      price: item.price,
      detail: item.detail,
    })),
  };

  await mkdir('worker', { recursive: true });
  await writeFile('worker/catalog.generated.json', `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
} finally {
  await server.close();
}
