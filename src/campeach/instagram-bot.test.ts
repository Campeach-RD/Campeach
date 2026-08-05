import { describe, expect, it } from 'vitest';
import { createInstagramReply } from './instagram-bot';

describe('Instagram bot', () => {
  it('links directly to a named camp', async () => {
    const reply = await createInstagramReply('Hola, quiero información de Villa Altagracia');
    expect(reply).toContain('Villa Altagracia');
    expect(reply).toContain('/campeach?camp=villa-altagracia');
  });

  it('returns the requested equipment information', async () => {
    const reply = await createInstagramReply('¿Cuánto cuesta la carpa No. 4?');
    expect(reply).toContain('RD$1,000');
    expect(reply).toContain('?equipment=carpa-no-4#equipos');
  });

  it('sends general visitors to the website', async () => {
    const reply = await createInstagramReply('Hola');
    expect(reply).toContain('https://campeachrd.com/campeach');
  });
});
