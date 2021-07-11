"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whitelist = void 0;
const cors_1 = require("../cors");
exports.whitelist = [
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
        expect(cors_1.isOriginAllowed('some.domain')).toBe(false);
        expect(cors_1.isOriginAllowed('willthirkettle.com')).toBe(false);
        expect(cors_1.isOriginAllowed('theffc.co.uk.somedomain')).toBe(false);
        expect(cors_1.isOriginAllowed('loisthirkettle.co.uks')).toBe(false);
    });
    exports.whitelist.forEach((origin) => {
        it(`should return true for ${origin}`, () => {
            expect(cors_1.isOriginAllowed(origin)).toBe(true);
        });
    });
});
//# sourceMappingURL=cors.test.js.map