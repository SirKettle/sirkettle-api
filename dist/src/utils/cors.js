"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOriginAllowed = void 0;
var constants_1 = require("../constants");
var isOriginAllowed = function (origin) {
    if (!origin) {
        // same origin...
        return true;
    }
    if (constants_1.whitelistOrigins.includes(origin)) {
        return true;
    }
    return constants_1.whitelistDomains.some(function (domain) { return origin.startsWith('http') && origin.endsWith(domain); });
};
exports.isOriginAllowed = isOriginAllowed;
//# sourceMappingURL=cors.js.map