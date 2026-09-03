import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  BedDouble,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronDown,
  Clock3,
  CreditCard,
  FileText,
  Filter,
  Flame,
  Heart,
  Image as ImageIcon,
  Info,
  MapPin,
  MessageCircle,
  Mountain,
  Route,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Star,
  SlidersHorizontal,
  Sparkles,
  Tent,
  Trash2,
  Utensils,
  Waves,
  Users,
} from 'lucide-react';
import { brand, camps, equipment, equipmentCatalog, equipmentRules, logoImage, type Camp, type Equipment } from './data';

const formatPrice = (value?: number) =>
  value ? `RD$${value.toLocaleString('es-DO')}` : 'Consultar';

const unique = (items: string[]) => Array.from(new Set(items.filter(Boolean)));

const SHOP_API = 'https://campeach-shop.nomanychat.workers.dev';

const anonymousId = (storage: Storage, key: string) => {
  const existing = storage.getItem(key);
  if (existing) return existing;
  const value = crypto.randomUUID();
  storage.setItem(key, value);
  return value;
};

const attribution = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get('utm_source') || '', medium: params.get('utm_medium') || '',
    campaign: params.get('utm_campaign') || '', content: params.get('utm_content') || '',
  };
};

const trackShopEvent = (eventName: string, productId?: string, metadata?: Record<string, unknown>) => {
  const referrerHost = (() => { try { return document.referrer ? new URL(document.referrer).hostname : ''; } catch { return ''; } })();
  const payload = {
    eventName, productId: productId || '', visitorId: anonymousId(localStorage, 'campeach-shop-visitor'),
    sessionId: anonymousId(sessionStorage, 'campeach-shop-session'), referrerHost,
    path: `${window.location.pathname}${window.location.search}`, ...attribution(), metadata,
  };
  void fetch(`${SHOP_API}/track`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), keepalive: true }).catch(() => undefined);
};

const getCampIntro = (camp: Camp) => {
  if (camp.richInfo?.intro) return camp.richInfo.intro;

  const setting = camp.tags.slice(0, 3).join(', ').toLowerCase();
  const activities = camp.activities.slice(0, 3).join(', ').toLowerCase();
  const stay = camp.stayOptions.slice(0, 2).join(' o ').toLowerCase();
  return `${camp.name} es una opcion ${camp.region.toLowerCase()} para quienes buscan ${setting || 'naturaleza y privacidad'}. Es ideal para ${activities || 'descansar, conectar y vivir una escapada al aire libre'}, con opciones de ${stay || 'camping bajo reserva'} coordinadas por Campeach RD.`;
};

const getPracticalTips = (camp: Camp) => {
  if (camp.richInfo?.whatToBring?.length) return camp.richInfo.whatToBring.slice(0, 8);

  const tips = ['Lleva ropa comoda, repelente y calzado cerrado.', 'Confirma disponibilidad antes de salir.', 'Respeta las areas naturales y las reglas del lugar.'];
  const text = [...camp.rules, ...camp.tags, ...camp.highlights].join(' ').toLowerCase();
  if (text.includes('no restaurantes') || text.includes('llevar alimentos') || text.includes('cocina')) {
    tips.unshift('Planifica tus alimentos y bebidas antes de llegar.');
  }
  if (text.includes('4x4') || text.includes('vehiculo alto')) {
    tips.unshift('Recomendamos vehiculo alto o 4x4 para mayor comodidad.');
  }
  if (text.includes('mascotas')) {
    tips.push('Si llevas mascotas, mantenlas bajo control durante la estadia.');
  }
  if (camp.region === 'Montana') {
    tips.push('Para zonas frescas, lleva abrigo ligero para la noche.');
  }
  return unique(tips).slice(0, 5);
};

const getAmenityIcon = (label: string) => {
  const normalized = label.toLowerCase();
  if (normalized.includes('rio') || normalized.includes('playa') || normalized.includes('piscina') || normalized.includes('cascada')) return Waves;
  if (normalized.includes('comida') || normalized.includes('restaurante') || normalized.includes('bar') || normalized.includes('bbq') || normalized.includes('alimentos')) return Utensils;
  if (normalized.includes('fogata') || normalized.includes('fogon')) return Flame;
  if (normalized.includes('camping') || normalized.includes('carpa') || normalized.includes('glamping') || normalized.includes('tiny') || normalized.includes('habitacion')) return BedDouble;
  if (normalized.includes('sender') || normalized.includes('mtb') || normalized.includes('ruta') || normalized.includes('hiking') || normalized.includes('aventura')) return Route;
  return CheckCircle2;
};

type WhatsappIntent = 'availability' | 'quote' | 'equipment';

const whatsappFor = (camp?: Camp, _intent: WhatsappIntent = 'availability', equipmentName?: string) => {
  const campName = camp?.name ?? '(Nombre del campamento)';
  const requestedEquipment = equipmentName ?? '';
  const text = [
    'Hola, Campeach RD. Espero se encuentren bien.',
    '',
    `Me gustaría consultar disponibilidad para el campamento en ${campName}.`,
    '',
    'Fechas:',
    '',
    'Cantidad de adultos y niños con sus edades:',
    '',
    'Tipo de alojamiento deseado:',
    '',
    `Equipos de camping requeridos: ${requestedEquipment}`,
    '',
    '¿Podrían confirmarme disponibilidad, precio total y los pasos para realizar la reserva?',
    '',
    'Quedo atent@, gracias.',
  ].join('\n');
  return `${brand.whatsapp}?text=${encodeURIComponent(text)}`;
};

type ShopProduct = {
  id: string; name: string; category: string; brand: string; price: number; compareAt: number;
  weight: string; footprint: string; description: string; image: string; rating: number;
  ratingCount: number;
  images?: string[];
  availability: 'available' | 'out-of-stock'; stock?: number; highlights: string[]; reviewSummary: string; featured?: boolean;
};

type RentalCartLine = { equipment: Equipment; quantity: number };

const rentalWhatsappFor = (lines: RentalCartLine[], startDate: string, nights: number) => {
  const safeNights = Math.max(1, nights || 1);
  const itemLines = lines.map(({ equipment: item, quantity }) => {
    const lineTotal = item.price * quantity * safeNights;
    return `- ${quantity} × ${item.name}: ${formatPrice(item.price)} por noche × ${safeNights} noche${safeNights === 1 ? '' : 's'} = ${formatPrice(lineTotal)}`;
  });
  const total = lines.reduce((sum, { equipment: item, quantity }) => sum + item.price * quantity * safeNights, 0);
  const text = [
    'Hola, Campeach RD. Espero se encuentren bien.',
    '',
    'Me gustaría cotizar el alquiler de estos equipos de camping:',
    ...itemLines,
    '',
    `Fecha de inicio: ${startDate || '(por confirmar)'}`,
    `Cantidad de noches: ${safeNights}`,
    `Total estimado del alquiler: ${formatPrice(total)}`,
    '',
    'Nombre:',
    'Lugar o punto de entrega:',
    '',
    '¿Podrían confirmarme disponibilidad, depósito requerido, entrega y total final?',
    '',
    'Quedo atent@, gracias.',
  ].join('\n');
  return `${brand.whatsapp}?text=${encodeURIComponent(text)}`;
};

const shopProducts: ShopProduct[] = [
  {
    id: 'ozark-3',
    name: 'Ozark Trail Clip & Camp para 3 personas',
    category: 'Casas de campaña', brand: 'Ozark Trail · Clip & Camp',
    price: 5990,
    compareAt: 6490,
    weight: '5.64 lb',
    footprint: "7' × 7' × 44\"",
    description: 'Compacta y ligera, con espacio para tres personas o un colchón queen y equipaje.',
    image: `${import.meta.env.BASE_URL}shop-products/tent-3.jpg`,
    images: Array.from({ length: 7 }, (_, index) => `${import.meta.env.BASE_URL}shop-products/tent-3/frame-${String(index + 1).padStart(2, '0')}.jpeg`),
    rating: 4.3, ratingCount: 3470, availability: 'out-of-stock',
    highlights: ['Sobretecho removible y resistente al agua', 'Techo y paredes de malla', 'Puerta amplia en forma de D', 'Bolsillos y acceso para cable eléctrico'],
    reviewSummary: 'Los compradores destacan el montaje sencillo, la ventilación y el espacio que ofrece para su peso.',
  },
  {
    id: 'ozark-4',
    name: 'Ozark Trail Clip & Camp para 4 personas',
    category: 'Casas de campaña', brand: 'Ozark Trail · Clip & Camp',
    price: 7490,
    compareAt: 7990,
    weight: '7.87 lb',
    footprint: "8' × 8.5' × 50\"",
    description: 'Espacio para un colchón queen, ventilación amplia y sobretecho removible.',
    image: `${import.meta.env.BASE_URL}shop-products/tent-4.jpg`,
    images: Array.from({ length: 8 }, (_, index) => `${import.meta.env.BASE_URL}shop-products/tent-4/frame-${String(index + 1).padStart(2, '0')}.jpeg`),
    rating: 4.3, ratingCount: 1246, availability: 'available', stock: 4,
    highlights: ['Capacidad para cuatro personas', 'Sobretecho con costuras selladas', 'Techo y paredes de malla', 'Compartimento de acceso doble'],
    reviewSummary: 'La amplitud, la circulación de aire y la organización interior son sus puntos mejor valorados.',
  },
  {
    id: 'ozark-6',
    name: 'Ozark Trail Clip & Camp para 6 personas',
    category: 'Casas de campaña', brand: 'Ozark Trail · Clip & Camp',
    price: 12490,
    compareAt: 13490,
    weight: '14 lb',
    footprint: "12' × 8.5' × 72\"",
    description: 'La favorita de Campeach: cómoda, ventilada y con capacidad para dos colchones queen.',
    image: `${import.meta.env.BASE_URL}shop-products/tent-6.jpg`,
    images: Array.from({ length: 8 }, (_, index) => `${import.meta.env.BASE_URL}shop-products/tent-6/frame-${String(index + 1).padStart(2, '0')}.jpeg`),
    rating: 4.3, ratingCount: 3341, availability: 'out-of-stock',
    highlights: ['Altura central de 72 pulgadas', 'Espacio para dos colchones queen', 'Alero y tapete de entrada', 'Bolsillos y acceso para cable eléctrico'],
    reviewSummary: 'Las reseñas resaltan el espacio, precio y montaje; para viento fuerte conviene reforzar las estacas.',
    featured: true,
  },
    {
