import { parseIntOrThrow } from '../version';

describe('parseIntOrThrow', () => {
  it('must parse a proper number', () => {
    expect(parseIntOrThrow('110571')).toBe(110571);
  });
  it('must parse 0', () => {
    expect(parseIntOrThrow('0')).toBe(0);
  });
  it('must throw if not a number', () => {
    expect(() => parseIntOrThrow('')).toThrow();
  });
  it('must throw if a word', () => {
    expect(() => parseIntOrThrow('NONE')).toThrow();
  });
});
