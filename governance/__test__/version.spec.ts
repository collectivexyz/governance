import { parseIntOrThrow } from '../version';

describe('parseIntOrThrow', () => {
  it('must parse a proper number', () => {
    expect(parseIntOrThrow('110571')).toBe(110571);
  });
  it('must throw if not a number', () => {
    expect(() => parseIntOrThrow('')).toThrow();
  });
});
