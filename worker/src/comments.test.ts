import { describe, expect, it } from 'vitest';
import { COMMENT_PRIVATE_REPLY, requestsInformation } from './comments';

describe('Instagram comment automation', () => {
  it.each([
    'Info', 'inf', 'INFORMACIÓN', 'Información por favor', '+ info',
    '¿Cuál es el precio?', 'precios', '¿Cuánto cuesta?', 'Tarifa', 'Cotización',
    'Me interesa este campamento', 'Me gustaría saber más', 'Quiero reservar', '¿Tienen cupo?',
    'Disponibilidad', 'Fechas disponibles', 'Link por favor', 'Enlace', 'PDF',
    'Ubicación', '¿Cómo llego?', 'Detalles', 'Datos', 'WhatsApp', 'DM',
    'Equipos de camping', 'Alquiler de carpas',
  ])(
    'detects an information request: %s',
    (comment) => expect(requestsInformation(comment)).toBe(true),
  );

  it.each(['Qué hermoso 😍', 'Excelente foto', 'Muchas gracias', 'Bendiciones', 'Quiero mucho este lugar'])(
    'ignores a comment without information intent: %s',
    (comment) => expect(requestsInformation(comment)).toBe(false),
  );

  it('includes both customer destinations', () => {
    expect(COMMENT_PRIVATE_REPLY).toContain('https://campeach-rd.github.io/Campeach/');
    expect(COMMENT_PRIVATE_REPLY).toContain('https://linktr.ee/CampeachRD');
  });
});
