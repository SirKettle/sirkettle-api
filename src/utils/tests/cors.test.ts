import { isOriginAllowed } from '../cors';

export const whitelist = [
  'http://theffc.co.uk',
  'https://theffc.co.uk',
  'http://holo-holo.co.uk',
  'https://holo-holo.co.uk',
  'http://willthirkettle.co.uk',
  'https://willthirkettle.co.uk',
  'http://loisthirkettle.co.uk',
  'https://loisthirkettle.co.uk',
];

describe('isOriginAllowed', () => {
  it('should return false if origin does not end with one of the whitelist domains', () => {
    expect(isOriginAllowed('some.domain')).toBe(false);
    expect(isOriginAllowed('willthirkettle.com')).toBe(false);
    expect(isOriginAllowed('theffc.co.uk.somedomain')).toBe(false);
    expect(isOriginAllowed('loisthirkettle.co.uks')).toBe(false);
  });

  whitelist.forEach((origin) => {
    it(`should return true for ${origin}`, () => {
      expect(isOriginAllowed(origin)).toBe(true);
    });
  });
});
