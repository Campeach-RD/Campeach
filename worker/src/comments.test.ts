import { describe, expect, it } from 'vitest';
import { COMMENT_PRIVATE_REPLY, requestsInformation } from './comments';

describe('Instagram comment automation', () => {
  it.each(['Info', '¿Cuál es el precio?', 'Me interesa este campamento', 'Quiero reservar', 'Link por favor'])(
    'detects an information request: %s',
    (comment) => expect(requestsInformation(comment)).toBe(true),
  );

  it.each(['Qué hermoso 😍', 'Excelente foto', 'Muchas gracias'])(
    'ignores a comment without information intent: %s',
    (comment) => expect(requestsInformation(comment)).toBe(false),
  );

  it('includes both customer destinations', () => {
    expect(COMMENT_PRIVATE_REPLY).toContain('https://campeach-rd.github.io/Campeach/');
    expect(COMMENT_PRIVATE_REPLY).toContain('https://linktr.ee/CampeachRD');
  });
});
