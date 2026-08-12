const INFORMATION_KEYWORDS = new Set([
  'inf', 'info', 'informacion', 'informaciones', 'detalle', 'detalles', 'datos',
  'precio', 'precios', 'tarifa', 'tarifas', 'costo', 'costos', 'cotizacion', 'cotizar',
  'cuanto', 'cuantos', 'cuesta', 'cuestan', 'vale', 'valor',
  'donde', 'ubicacion', 'direccion', 'llegar', 'mapa',
  'campamento', 'campamentos', 'camping', 'acampar',
  'reserva', 'reservar', 'reservacion', 'reservaciones', 'apartar',
  'disponibilidad', 'disponible', 'disponibles', 'fecha', 'fechas',
  'link', 'enlace', 'pagina', 'web', 'catalogo', 'pdf',
  'equipo', 'equipos', 'carpa', 'carpas', 'alquiler', 'alquilar',
  'interesado', 'interesada', 'interesa', 'interesan',
  'dm', 'inbox', 'mensaje', 'contacto', 'telefono', 'whatsapp',
]);

const INFORMATION_PHRASES = [
  'mas informacion', 'dame informacion', 'enviame informacion', 'mandame informacion',
  'como reservo', 'como reservar', 'como llego', 'como llegar', 'como funciona',
  'me interesa', 'me gustaria', 'quiero ir', 'quiero saber', 'necesito saber',
  'tienen cupo', 'hay cupo', 'tienen espacio', 'hay espacio', 'para cuando',
  'precio por persona', 'precio por noche', 'informacion por favor',
];

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

export const requestsInformation = (comment: string) => {
  const normalized = normalize(comment);
  if (!normalized) return false;
  const words = normalized.split(/\s+/);
  return words.some((word) => INFORMATION_KEYWORDS.has(word)) ||
    INFORMATION_PHRASES.some((phrase) => normalized.includes(phrase));
};

export const COMMENT_PRIVATE_REPLY =
  '¡Hola! 👋 Gracias por escribirnos. Mira todos los campamentos y equipos de camping de Campeach aquí:\n' +
  'https://campeach-rd.github.io/Campeach/\n\n' +
  'También puedes ver nuestros enlaces y formas de contacto aquí:\n' +
  'https://linktr.ee/CampeachRD';
