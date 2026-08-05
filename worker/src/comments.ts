const INFORMATION_INTENT =
  /\b(info|informacion|informaciones|precio|precios|costo|costos|cuanto|cuantos|donde|ubicacion|direccion|campamento|campamentos|camping|acampar|reserva|reservar|disponibilidad|disponible|link|enlace|catalogo|equipo|equipos|carpa|carpas|interesado|interesada|interesa|quiero|detalles)\b/;

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

export const requestsInformation = (comment: string) => INFORMATION_INTENT.test(normalize(comment));

export const COMMENT_PRIVATE_REPLY =
  '¡Hola! 👋 Gracias por escribirnos. Mira todos los campamentos y equipos de camping de Campeach aquí:\n' +
  'https://campeach-rd.github.io/Campeach/\n\n' +
  'También puedes ver nuestros enlaces y formas de contacto aquí:\n' +
  'https://linktr.ee/CampeachRD';
