import { describe, expect, it } from 'vitest';
import { chooseDailyCamp, choosePhotos, createCaption, createCommentReply, publishableCamps } from './publishing';

describe('daily Instagram publishing', () => {
  it('only includes camps with photos and a PDF', () => {
    expect(publishableCamps.length).toBeGreaterThan(10);
    expect(publishableCamps.every((camp) => camp.pdfUrl)).toBe(true);
  });

  it('does not repeat the previous camp', () => {
    const first = publishableCamps[0];
    expect(chooseDailyCamp(first.id, 0).id).not.toBe(first.id);
  });

  it('selects between four and ten unique photos', () => {
    const selected = choosePhotos(Array.from({ length: 20 }, (_, index) => index), 7, [4, 2, 8, 1]);
    expect(selected).toHaveLength(7);
    expect(new Set(selected).size).toBe(7);
  });

  it('builds contextual copy and a PDF reply', () => {
    const camp = publishableCamps[0];
    expect(createCaption(camp)).toContain(camp.name);
    expect(createCommentReply(camp)).toContain(camp.pdfUrl);
  });
});
