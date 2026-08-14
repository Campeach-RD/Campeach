import embeddedMedia from './embedded-media.json';
import { campRichInfo, type CampRichInfo } from './camp-rich-info';
import { campSheetUpdates } from './camp-sheet-updates';
import { campPdfIds, driveImage, drivePreview, equipmentCatalogUrl, equipmentImageByCategory, extraCampPhotoIds } from './drive-assets';

export type Camp = {
  id: string;
  name: string;
  location: string;
  region: string;
  priceFrom?: number;
  priceNote: string;
  capacity?: number;
  distance?: string;
  tags: string[];
  highlights: string[];
  activities: string[];
  stayOptions: string[];
  rules: string[];
  images: string[];
  pdfUrl?: string;
  mediaStatus?: string;
  richInfo?: CampRichInfo;
};

export type Equipment = {
  id: string;
  name: string;
  price: number;
  detail: string;
  category: 'Carpas' | 'Dormir' | 'Muebles' | 'Accesorios';
  image: string;
  images: string[];
  highlights: string[];
};

type EmbeddedMedia = {
  images: Record<string, string[]>;
  logo: string;
};

const embeddedImages = (embeddedMedia as EmbeddedMedia).images;

const publicAsset = (path: string) => {
  if (/^(?:data:|https?:)/.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
};

const localImages = (campId: string, count = 5) => {
  const baseImages =
    embeddedImages[campId] ??
    Array.from({ length: count }, (_, index) => `/campeach/media/${campId}/${String(index + 1).padStart(2, '0')}.jpg`);
  return uniqueValues([...baseImages.map(publicAsset), ...(extraCampPhotoIds[campId] ?? []).map(driveImage)]);
};

export const logoImage = publicAsset((embeddedMedia as EmbeddedMedia).logo || '/campeach/logo.png');

export const brand = {
  phone: '829-937-0674',
  whatsapp: 'https://wa.me/18299370674',
  email: 'campingsrd@gmail.com',
  instagram: 'https://www.instagram.com/campeachrd/',
  website: 'https://campeach-rd.github.io/Campeach/',
};

const fallbackImages = [
  ...(embeddedImages['villa-altagracia'] ??
    [
      '/campeach/media/villa-altagracia-01.jpg',
      '/campeach/media/villa-altagracia-02.jpg',
      '/campeach/media/villa-altagracia-03.jpg',
      '/campeach/media/villa-altagracia-04.jpg',
      '/campeach/media/villa-altagracia-05.jpg',
    ]),
].map(publicAsset);

const campRecords: Camp[] = [
  {
    id: 'taiku',
    name: 'Taiku',
    location: 'Juan Adrian, Monsenor Nouel',
    region: 'Montana',
    priceFrom: 600,
    priceNote: 'Camping con tus equipos desde RD$600 p/p',
    capacity: 40,
    distance: '1h 15m desde Santo Domingo',
    tags: ['Rio cercano', 'Glamping', 'Restaurante', 'Mascotas'],
    highlights: ['Basecamp en mini chozas', 'Tropical Hut con bano privado', 'Parqueo vigilado', 'Bar y restaurante en la propiedad'],
    activities: ['Hiking', 'Yoga', 'Masaje en el arroyo', 'Fogata autorizada'],
    stayOptions: ['Camping con equipo incluido', 'Basecamp', 'Tropical Hut', 'Camping con tus equipos'],
    rules: ['Check-in hasta 5:00 pm', 'Silencio de 10:00 pm a 7:00 am', 'Mascotas bajo control'],
    images: fallbackImages,
    mediaStatus: 'Galeria disponible dentro de Campeach.',
  },
  {
    id: 'azua',
    name: 'Azua',
    location: 'Barrera, Azua',
    region: 'Sur',
    priceFrom: 1400,
    priceNote: 'Camping adultos desde RD$1,400 p/noche',
    capacity: 24,
    distance: '2h 24m desde Santo Domingo',
    tags: ['Piscina', 'Restaurante', 'Bar', 'Bote'],
    highlights: ['Desayuno dominicano incluido', 'Piscina dentro de la propiedad', 'Bar y restaurante', 'Hamacas y fogata'],
    activities: ['Paseo en barca', 'Bicicleta', 'Caballo', 'Cueva de los Indios'],
    stayOptions: ['Camping', 'Glamping', 'Habitacion doble', 'Habitacion familiar', 'Pasadia'],
    rules: ['No mascotas', 'No fumar', 'No ingresar comida ni bebidas', 'Musica restringida de noche'],
    images: fallbackImages,
  },
  {
    id: 'bayaguana',
    name: 'Bayaguana',
    location: 'Bayaguana, Monte Plata',
    region: 'Este',
    priceFrom: 600,
    priceNote: 'Pasadia desde RD$600; camping desde RD$1,000 p/noche',
    capacity: 60,
    distance: '1h 20m desde Santo Domingo',
    tags: ['Rio privado', 'Mascotas', 'Villa', 'Eventos'],
    highlights: ['Rio privado dentro de la propiedad', 'Villa privada para 6 personas', 'Ideal para bodas y retiros', 'Cocina equipada'],
    activities: ['Fogata', 'Columpios', 'Juegos de mesa', 'Eventos privados'],
    stayOptions: ['Camping libre', 'Todo incluido', 'Villa privada', 'Pasadia'],
    rules: ['No danar flora o fauna', 'Mascotas con correa', 'Fogatas solo en zonas permitidas'],
    images: fallbackImages,
  },
  {
    id: 'bonao',
    name: 'Bonao',
    location: 'Bejuco Aplastado, Bonao',
    region: 'Montana',
    priceFrom: 550,
    priceNote: 'Entrada desde RD$550 lunes a jueves',
    capacity: 100,
    tags: ['Overland', 'Rio', 'Mascotas', '4x4'],
    highlights: ['Plaza Ceremonial Taina', 'Salto Arroyo Carlos', 'Excelente para overlands', 'Buena senal Claro y Altice'],
    activities: ['Senderismo', 'MTB', 'Motocross', 'Buggies'],
    stayOptions: ['Area de camping', 'Camping 4x4', 'Servicios de guia local'],
    rules: ['No hay electricidad', 'Llevar residuos de vuelta', 'Vehiculo 4x4 para area de camping'],
    images: fallbackImages,
  },
  {
    id: 'cabarete',
    name: 'Cabarete',
    location: 'Palo Amarillo, Puerto Plata',
    region: 'Norte',
    priceFrom: 700,
    priceNote: 'Plan sencillo desde RD$700 p/p',
    capacity: 500,
    distance: '3h 40m desde Santo Domingo',
    tags: ['Rio Yasica', 'Piscina', 'Surf cerca', 'Mascotas'],
    highlights: ['Rio frente al area de camping', 'Piscina en la propiedad', 'Juegos y cancha', 'Restaurante fines de semana'],
    activities: ['Paintball', 'Paddle board', 'Cuevas de Cabarete', 'River tubing'],
    stayOptions: ['Camping', 'Habitacion compartida', 'Apartamento estudio', 'Glamping'],
    rules: ['Cerrado miercoles', 'Musica restringida de 10:00 pm a 6:00 am', 'Mascotas con correa'],
    images: fallbackImages,
  },
  {
    id: 'comatillo',
    name: 'Comatillo',
    location: 'Comatillo, Bayaguana',
    region: 'Este',
    priceNote: 'Consultar planes actualizados',
    capacity: 500,
    distance: '1h 44m desde Santo Domingo',
    tags: ['Piscina', 'Rio', 'Restaurante', 'Mascotas'],
    highlights: ['Restaurante y 3 bares', 'Salto Alto a 8 minutos', 'Uso de bicicletas', 'Area infantil y juegos'],
    activities: ['Bicicletas', 'Volleyball', 'Fogata sabados', 'Rutas MTB'],
    stayOptions: ['Camping', 'Pasadia', 'Planes con alimentos'],
    rules: ['No acceso en transporte publico', 'Reservar con anticipacion', 'Musica moderada'],
    images: fallbackImages,
  },
  {
    id: 'constanza',
    name: 'Constanza',
    location: 'Constanza, La Vega',
    region: 'Montana',
    priceNote: 'Consultar disponibilidad y tarifa',
    tags: ['Montana', 'Clima fresco', 'Naturaleza'],
    highlights: ['Destino de altura', 'Ideal para desconexion', 'Paisajes de montana'],
    activities: ['Senderismo', 'Fogata', 'Picnic'],
    stayOptions: ['Camping', 'Experiencias de montana'],
    rules: ['Confirmar detalles antes de reservar'],
    images: fallbackImages,
  },
  {
    id: 'el-valle',
    name: 'Playa El Valle',
    location: 'El Valle, Samana',
    region: 'Nordeste',
    priceNote: 'Consultar tarifa actualizada',
    tags: ['Playa', 'Samana', 'Aventura'],
    highlights: ['Entorno costero', 'Cerca de atractivos naturales', 'Ideal para grupos aventureros'],
    activities: ['Playa', 'Senderismo', 'Fotografia'],
    stayOptions: ['Camping', 'Pasadia bajo consulta'],
    rules: ['Confirmar acceso y condiciones por temporada'],
    images: fallbackImages,
  },
  {
    id: 'hato-mayor',
    name: 'Hato Mayor',
    location: 'Hato Mayor',
    region: 'Este',
    priceNote: 'Consultar tarifa actualizada',
    tags: ['Naturaleza', 'Este', 'Privado'],
    highlights: ['Campamento de red Campeach', 'Ambiente natural', 'Reserva coordinada por Campeach'],
    activities: ['Senderismo', 'Fogata', 'Picnic'],
    stayOptions: ['Camping', 'Experiencias privadas'],
    rules: ['Confirmar reglas actualizadas con Campeach'],
    images: fallbackImages,
  },
  {
    id: 'jamao',
    name: 'Jamao Al Norte',
    location: 'Jamao al Norte, Espaillat',
    region: 'Norte',
    priceNote: 'Consultar tarifa actualizada',
    tags: ['Rio', 'Norte', 'Aventura'],
    highlights: ['Zona conocida por rios y naturaleza', 'Ideal para grupos activos', 'Galeria de fotos disponible'],
    activities: ['Rio', 'Senderismo', 'Aventura'],
    stayOptions: ['Camping', 'Experiencias guiadas bajo consulta'],
    rules: ['Confirmar acceso y condiciones antes de reservar'],
    images: fallbackImages,
  },
  {
    id: 'jarabacoa',
    name: 'Jarabacoa',
    location: 'Jarabacoa, La Vega',
    region: 'Montana',
    priceNote: 'Consultar tarifa actualizada',
    tags: ['Montana', 'Rio', 'Aventura'],
    highlights: ['Destino clasico de montana', 'Informacion actualizada', 'Ideal para aventura y desconexion'],
    activities: ['Senderismo', 'Rio', 'Fogata', 'Aventura'],
    stayOptions: ['Camping', 'Glamping bajo consulta'],
    rules: ['Confirmar reglas de temporada'],
    images: fallbackImages,
  },
  {
    id: 'las-terrenas-yaya',
    name: 'Las Terrenas - Yaya',
    location: 'Las Terrenas, Samana',
    region: 'Nordeste',
    priceNote: 'Consultar tarifa actualizada',
    tags: ['Playa', 'Samana', 'Tropical'],
    highlights: ['Galeria de fotos disponible', 'Destino costero', 'Ideal para escapadas tropicales'],
    activities: ['Playa', 'Fotos', 'Relax'],
    stayOptions: ['Consultar opciones'],
    rules: ['Confirmar detalles con Campeach'],
    images: fallbackImages,
  },
  {
    id: 'lavacama',
    name: 'Lavacama',
    location: 'Lavacama',
    region: 'Este',
    priceNote: 'Consultar tarifa actualizada',
    tags: ['Este', 'Naturaleza', 'Privado'],
    highlights: ['Galeria de fotos disponible', 'Campamento de la red Campeach', 'Reserva coordinada'],
    activities: ['Camping', 'Fogata', 'Picnic'],
    stayOptions: ['Consultar opciones'],
    rules: ['Confirmar detalles con Campeach'],
    images: fallbackImages,
  },
  {
    id: 'los-cacaos',
    name: 'Los Cacaos',
    location: 'Los Cacaos, San Cristobal',
    region: 'Sur',
    priceNote: 'Consultar tarifa actualizada',
    tags: ['Montana', 'Rio', 'Sur'],
    highlights: ['Informacion actualizada disponible', 'Destino natural cercano al sur', 'Ideal para grupos'],
    activities: ['Senderismo', 'Rio', 'Fogata'],
    stayOptions: ['Camping', 'Experiencias bajo consulta'],
    rules: ['Confirmar condiciones actualizadas'],
    images: fallbackImages,
  },
  {
    id: 'monsenor',
    name: 'Monsenor',
    location: 'Canabon, Bonao',
    region: 'Montana',
    priceFrom: 1000,
    priceNote: 'Camping desde RD$1,000 p/p/noche',
    capacity: 30,
    tags: ['Presa Rincon', 'Kayak', 'Mascotas', 'Montana'],
    highlights: ['Frente a la Presa Rincon', 'Uso de kayak 30 minutos por dia', 'Cocina y horno de lena', 'Seguridad interna 24 horas'],
    activities: ['Kayak', 'Pesca', 'Bote', 'Caballo'],
    stayOptions: ['Camping', 'RV campers', 'Camping con equipos', 'Daypass domingos'],
    rules: ['No energia electrica', 'Vehiculo alto recomendado', 'Musica restringida de 9:00 pm a 7:00 am'],
    images: fallbackImages,
  },
  {
    id: 'montellano',
    name: 'Montellano',
    location: 'Montellano, Puerto Plata',
    region: 'Norte',
    priceNote: 'Consultar tarifa actualizada',
    tags: ['Puerto Plata', 'Norte', 'Naturaleza'],
    highlights: ['Informacion actualizada disponible', 'Destino norte', 'Galeria de fotos disponible'],
    activities: ['Camping', 'Relax', 'Aventura'],
    stayOptions: ['Consultar opciones'],
    rules: ['Confirmar condiciones actualizadas'],
    images: fallbackImages,
  },
  {
    id: 'ocoa',
    name: 'Ocoa',
    location: 'Rancho Arriba, San Jose de Ocoa',
    region: 'Sur',
    priceFrom: 800,
    priceNote: 'Entrada desde RD$800 p/p/noche',
    capacity: 50,
    distance: '1h 45m desde Santo Domingo',
    tags: ['Rio', 'Cascada', 'Overland', 'Mascotas'],
    highlights: ['Rio y cascada a 2 minutos', 'BBQ y fogon', 'Altura 700 msnm', 'Excelente para overlands'],
    activities: ['Senderismo', 'MTB', 'Motocross', 'Buggies'],
    stayOptions: ['Camping', 'Alquiler de equipos con retiro en Santo Domingo'],
    rules: ['No restaurantes cercanos', 'Llevar alimentos y articulos para cocinar', 'No electrodomesticos'],
    images: fallbackImages,
  },
  {
    id: 'pinar-del-valle',
    name: 'Pinar del Valle',
    location: 'Pinar del Valle',
    region: 'Montana',
    priceNote: 'Consultar tarifa actualizada',
    tags: ['Montana', 'Pinos', 'Privado'],
    highlights: ['Informacion actualizada disponible', 'Entorno de montana', 'Galeria de fotos disponible'],
    activities: ['Camping', 'Senderismo', 'Fogata'],
    stayOptions: ['Consultar opciones'],
    rules: ['Confirmar condiciones actualizadas'],
    images: fallbackImages,
  },
  {
    id: 'punta-cana',
    name: 'Punta Cana',
    location: 'Punta Cana, La Altagracia',
    region: 'Este',
    priceNote: 'Consultar tarifa actualizada',
    tags: ['Playa', 'Este', 'Tropical'],
    highlights: ['Informacion actualizada disponible', 'Destino turistico del este', 'Galeria de fotos disponible'],
    activities: ['Playa', 'Relax', 'Fotos'],
    stayOptions: ['Consultar opciones'],
    rules: ['Confirmar condiciones actualizadas'],
    images: fallbackImages,
  },
  {
    id: 'rincon-samana',
    name: 'Rincon, Samana',
    location: 'Rincon, Samana',
    region: 'Nordeste',
    priceNote: 'Consultar tarifa actualizada',
    tags: ['Samana', 'Playa', 'Naturaleza'],
    highlights: ['Informacion actualizada disponible', 'Destino costero natural', 'Galeria de fotos disponible'],
    activities: ['Playa', 'Senderismo', 'Relax'],
    stayOptions: ['Consultar opciones'],
    rules: ['Confirmar condiciones actualizadas'],
    images: fallbackImages,
  },
  {
    id: 'san-cristobal',
    name: 'San Cristobal',
    location: 'San Cristobal',
    region: 'Sur',
    priceNote: 'Consultar tarifa actualizada',
    tags: ['Sur', 'Cerca de Santo Domingo', 'Naturaleza'],
    highlights: ['Informacion actualizada disponible', 'Galeria de fotos disponible', 'Buena opcion para escapada cercana'],
    activities: ['Camping', 'Picnic', 'Fogata'],
    stayOptions: ['Consultar opciones'],
    rules: ['Confirmar condiciones actualizadas'],
    images: fallbackImages,
  },
  {
    id: 'santiago',
    name: 'Santiago',
    location: 'Santiago',
    region: 'Cibao',
    priceNote: 'Consultar tarifa actualizada',
    tags: ['Cibao', 'Naturaleza', 'Privado'],
    highlights: ['Informacion actualizada disponible', 'Campamento de red Campeach', 'Galeria de fotos disponible'],
    activities: ['Camping', 'Relax', 'Fotos'],
    stayOptions: ['Consultar opciones'],
    rules: ['Confirmar condiciones actualizadas'],
    images: fallbackImages,
  },
  {
    id: 'santo-domingo',
    name: 'Santo Domingo',
    location: 'Santo Domingo',
    region: 'Santo Domingo',
    priceNote: 'Consultar tarifa actualizada',
    tags: ['Cercano', 'Ciudad', 'Rapido'],
    highlights: ['Informacion actualizada disponible', 'Opcion cercana para reservar rapido', 'Galeria de fotos disponible'],
    activities: ['Camping', 'Pasadia', 'Eventos'],
    stayOptions: ['Consultar opciones'],
    rules: ['Confirmar condiciones actualizadas'],
    images: fallbackImages,
  },
  {
    id: 'villa-altagracia',
    name: 'Villa Altagracia Eco Aldea',
    location: 'Los Arroyones, Villa Altagracia',
    region: 'Montana',
    priceFrom: 750,
    priceNote: 'Camping adultos desde RD$750 p/noche',
    capacity: 150,
    distance: '50m desde Santo Domingo',
    tags: ['Rio', 'Jacuzzi natural', 'Piscina', 'Mascotas'],
    highlights: ['Salto de los Indios a 20 minutos', 'Rio con jacuzzi natural', 'Piscina natural en area de camping', 'Paneles solares para celulares'],
    activities: ['Senderismo', 'MTB', 'Motocross', 'Entrenamiento Pico Duarte'],
    stayOptions: ['Camping', 'Tiny House 2 niveles', 'Carpas', 'Tiny House'],
    rules: ['No hay delivery', 'Poca senal celular', 'No electrodomesticos', 'Llevar alimentos y bebidas'],
    images: [
      '/campeach/media/villa-altagracia-01.jpg',
      '/campeach/media/villa-altagracia-02.jpg',
      '/campeach/media/villa-altagracia-03.jpg',
      '/campeach/media/villa-altagracia-04.jpg',
      '/campeach/media/villa-altagracia-05.jpg',
    ].map(publicAsset),
  },
  {
    id: 'villa-pajon',
    name: 'Villa Pajon',
    location: 'Constanza',
    region: 'Montana',
    priceNote: 'Consultar tarifa actualizada',
    tags: ['Montana', 'Frio', 'Cabana'],
    highlights: ['Galeria de fotos disponible', 'Destino de montana', 'Ideal para clima fresco'],
    activities: ['Senderismo', 'Relax', 'Fotos'],
    stayOptions: ['Consultar opciones'],
    rules: ['Confirmar condiciones actualizadas'],
    images: fallbackImages,
  },
];

const shouldUseRichNote = (note: string) => /consultar|actualizada|disponibilidad/i.test(note);

function uniqueValues(items: string[]) {
  return Array.from(new Set(items.filter(Boolean)));
}

const spanishCorrections: Array<[RegExp, string]> = [
  [/\bMonsenor\b/g, 'Monseñor'], [/\bmonsenor\b/g, 'monseñor'],
  [/\bCanabon\b/g, 'Cañabón'], [/\bMontanas\b/g, 'Montañas'], [/\bmontanas\b/g, 'montañas'],
  [/\bMontana\b/g, 'Montaña'], [/\bmontana\b/g, 'montaña'],
  [/\bNinos\b/g, 'Niños'], [/\bninos\b/g, 'niños'], [/\bNino\b/g, 'Niño'], [/\bnino\b/g, 'niño'],
  [/\bAnos\b/g, 'Años'], [/\banos\b/g, 'años'], [/\bCampanas\b/g, 'Campañas'], [/\bcampanas\b/g, 'campañas'],
  [/\bCampana\b/g, 'Campaña'], [/\bcampana\b/g, 'campaña'], [/\bLena\b/g, 'Leña'], [/\blena\b/g, 'leña'],
  [/\bPequena\b/g, 'Pequeña'], [/\bpequena\b/g, 'pequeña'], [/\bTamano\b/g, 'Tamaño'], [/\btamano\b/g, 'tamaño'],
  [/\bCanon\b/g, 'Cañón'], [/\bSenal\b/g, 'Señal'], [/\bsenal\b/g, 'señal'], [/\bBano\b/g, 'Baño'], [/\bbano\b/g, 'baño'],
];

const correctSpanish = (text: string) =>
  spanishCorrections.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), text);

const localizeSpanish = <T,>(value: T): T => {
  if (typeof value === 'string') return correctSpanish(value) as T;
  if (Array.isArray(value)) return value.map(localizeSpanish) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localizeSpanish(item)])) as T;
  }
  return value;
};

export const camps: Camp[] = campRecords.map((camp) => {
  const richInfo = campRichInfo[camp.id];
  const sheet = campSheetUpdates[camp.id];

  return localizeSpanish({
    ...camp,
    name: sheet?.name ?? camp.name,
    priceFrom: sheet?.priceFrom ?? camp.priceFrom ?? richInfo?.priceFrom,
    priceNote: sheet?.priceNote ?? (shouldUseRichNote(camp.priceNote) ? (richInfo?.priceNote ?? camp.priceNote) : camp.priceNote),
    capacity: sheet?.capacity ?? camp.capacity ?? richInfo?.capacity,
    distance: camp.distance ?? richInfo?.distance,
    tags: sheet ? uniqueValues([...sheet.tags, ...camp.tags]).slice(0, 8) : camp.tags,
    highlights: sheet
      ? uniqueValues([...sheet.highlights, ...camp.highlights, ...(richInfo?.important ?? []), ...(richInfo?.includes ?? [])]).slice(0, 12)
      : richInfo
        ? uniqueValues([...camp.highlights, ...(richInfo.important ?? []), ...(richInfo.includes ?? [])]).slice(0, 10)
        : camp.highlights,
    activities: sheet
      ? uniqueValues([...sheet.activities, ...camp.activities, ...(richInfo?.extraActivities ?? []), ...(richInfo?.nearby ?? [])]).slice(0, 12)
      : richInfo
        ? uniqueValues([...camp.activities, ...(richInfo.extraActivities ?? []), ...(richInfo.nearby ?? [])]).slice(0, 10)
        : camp.activities,
    stayOptions: sheet
      ? uniqueValues([...sheet.stayOptions, ...camp.stayOptions, ...(richInfo?.lodging ?? []), ...(richInfo?.pricing ?? [])]).slice(0, 12)
      : richInfo
        ? uniqueValues([...camp.stayOptions, ...(richInfo.lodging ?? []), ...(richInfo.pricing ?? [])]).slice(0, 10)
        : camp.stayOptions,
    rules: sheet ? uniqueValues([...sheet.rules, ...camp.rules, ...(richInfo?.rules ?? [])]).slice(0, 12) : richInfo ? uniqueValues([...camp.rules, ...(richInfo.rules ?? [])]).slice(0, 10) : camp.rules,
    images: localImages(camp.id),
    pdfUrl: campPdfIds[camp.id] ? drivePreview(campPdfIds[camp.id]) : undefined,
    richInfo,
  });
});

const equipmentRecords: Omit<Equipment, 'image' | 'id' | 'images' | 'highlights'>[] = [
  { name: 'Carpa No. 2', price: 500, detail: 'Capacidad para 2 personas.', category: 'Carpas' },
  { name: 'Carpa No. 3', price: 800, detail: 'Capacidad para 1 a 3 personas; ideal para parejas.', category: 'Carpas' },
  { name: 'Carpa No. 4', price: 1000, detail: 'Capacidad para 1 a 4 personas; altura interior comoda.', category: 'Carpas' },
  { name: 'Carpa No. 6', price: 1600, detail: 'Capacidad para 1 a 6 personas; caben 4 en 2 colchones Queen.', category: 'Carpas' },
  { name: 'Sleeping Bag', price: 300, detail: 'Saco de dormir individual para maximizar la retencion de calor.', category: 'Dormir' },
  { name: 'Sleeping Pad', price: 300, detail: 'Amortiguacion individual entre tu cuerpo y el suelo.', category: 'Dormir' },
  { name: 'Sleeping Pad Doble', price: 500, detail: 'Para 1 a 2 personas; incluye bomba integrada o auto inflado.', category: 'Dormir' },
  { name: 'Colchon Doble', price: 500, detail: 'Superficie elevada y soporte para 1 a 2 personas.', category: 'Dormir' },
  { name: 'Colchon de Baul', price: 500, detail: 'Colchon inflable para baul de vehiculo, capacidad para 1 a 2 personas.', category: 'Dormir' },
  { name: 'Silla Plegable', price: 300, detail: 'Silla individual facil de transportar.', category: 'Muebles' },
  { name: 'Hamaca', price: 300, detail: 'Hamaca para descansar entre arboles.', category: 'Muebles' },
  { name: 'Mesa de Picnic', price: 500, detail: 'Para 4 personas, plegable.', category: 'Muebles' },
  { name: 'Mochila', price: 300, detail: 'Mochila de 80 litros.', category: 'Accesorios' },
  { name: 'Nevera Portatil', price: 2000, detail: 'Nevera de 55 litros para mantener alimentos y bebidas frescas.', category: 'Accesorios' },
  { name: 'Trekking Pole', price: 300, detail: 'Baston para rutas y senderismo.', category: 'Accesorios' },
  { name: 'Cargador Portatil', price: 400, detail: 'Energia extra con linterna LED integrada.', category: 'Accesorios' },
  { name: 'Proyector', price: 1000, detail: 'No incluye cables de celulares; deposito adicional RD$3,000.', category: 'Accesorios' },
  { name: 'Lampara Solar', price: 200, detail: 'Iluminacion para noches al aire libre.', category: 'Accesorios' },
  { name: 'Abanico Portatil', price: 300, detail: 'Recargable, con multiples velocidades.', category: 'Accesorios' },
];

const equipmentSlug = (name: string) => name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const shopAsset = (path: string) => publicAsset(`/shop-products/${path}`);
const equipmentMedia: Record<string, string[]> = {
  'carpa-no-2': [publicAsset('/rental-products/carpa-3.jpg'), ...Array.from({ length: 7 }, (_, index) => shopAsset(`tent-3/frame-${String(index + 1).padStart(2, '0')}.jpeg`))],
  'carpa-no-3': [publicAsset('/rental-products/carpa-3.jpg'), ...Array.from({ length: 7 }, (_, index) => shopAsset(`tent-3/frame-${String(index + 1).padStart(2, '0')}.jpeg`))],
  'carpa-no-4': [publicAsset('/rental-products/carpa-4.jpg'), ...Array.from({ length: 8 }, (_, index) => shopAsset(`tent-4/frame-${String(index + 1).padStart(2, '0')}.jpeg`))],
  'carpa-no-6': [publicAsset('/rental-products/carpa-6.jpg'), ...Array.from({ length: 8 }, (_, index) => shopAsset(`tent-6/frame-${String(index + 1).padStart(2, '0')}.jpeg`))],
  'sleeping-bag': [publicAsset('/rental-products/sleeping-bag.jpg'), shopAsset('sleeping-bag.jpg')],
  'sleeping-pad': [publicAsset('/rental-products/sleeping-pad.jpg'), shopAsset('sleeping-pad.jpg')],
  'sleeping-pad-doble': [publicAsset('/rental-products/sleeping-pad-doble.jpg'), shopAsset('sleeping-pad.jpg')],
  'colchon-doble': [publicAsset('/rental-products/colchon-doble.jpg')],
  'colchon-de-baul': [publicAsset('/rental-products/colchon-baul.jpg')],
  'silla-plegable': [publicAsset('/rental-products/silla-plegable.jpg')],
  'hamaca': [publicAsset('/rental-products/hamaca.jpg')],
  'nevera-portatil': [publicAsset('/rental-products/nevera-portatil.jpg')],
  'cargador-portatil': [publicAsset('/rental-products/cargador-portatil.jpg')],
  'lampara-solar': [publicAsset('/rental-products/lampara-solar.jpg')],
  'abanico-portatil': [publicAsset('/rental-products/abanico-portatil.jpg')],
};

export const equipment: Equipment[] = equipmentRecords.map((item) => {
  const id = equipmentSlug(item.name);
  const images = equipmentMedia[id] ?? [equipmentImageByCategory[item.category]];
  return {
    ...item,
    id,
    image: images[0],
    images,
    highlights: [item.detail, `Tarifa de RD$${item.price.toLocaleString('es-DO')} por unidad y por noche`, 'Entrega y devolución coordinadas con Campeach', 'Disponibilidad sujeta a confirmación'],
  };
});

export const equipmentCatalog = {
  title: 'Ver catalogo completo de equipos',
  url: equipmentCatalogUrl,
};

export const equipmentRules = [
  'Montos por unidad por noche.',
  'Entrega el dia de la reserva o de cortesia el dia anterior desde las 7:00 pm.',
  'Retorno a mas tardar a las 8:00 pm del dia establecido.',
  'Se cobra deposito por cada equipo reservado.',
  'Puntos de entrega: Bella Vista, Cacicazgos y Plaza Las Colinas.',
];



