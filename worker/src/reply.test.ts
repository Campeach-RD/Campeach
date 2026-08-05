import { describe, expect, it } from 'vitest';
import { createReply } from './reply';

describe('Cloudflare Instagram replies', () => {
  it('links to a named camp', async () => {
    const reply = await createReply('Quiero información de Villa Altagracia');
    expect(reply).toContain('Villa Altagracia');
    expect(reply).toContain('?camp=villa-altagracia');
  });

  it('answers a tent request using catalog data', async () => {
    const reply = await createReply('¿Cuánto cuesta la carpa 4?');
    expect(reply).toContain('RD$1,000');
    expect(reply).toContain('?equipment=carpa-no-4#equipos');
  });

  it('uses the classifier only for ambiguous messages', async () => {
    const reply = await createReply('Quiero ir a un lugar fresco', async () => ({ kind: 'camp', id: 'constanza' }));
    expect(reply).toContain('Constanza');
  });
});
