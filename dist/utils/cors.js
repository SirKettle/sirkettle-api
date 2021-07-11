"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOriginAllowed = void 0;
const constants_1 = require("../constants");
const isOriginAllowed = (origin) => {
    if (!origin) {
        // same origin...
        return true;
    }
    if (constants_1.whitelistOrigins.includes(origin)) {
        return true;
    }
    return constants_1.whitelistDomains.some((domain) => origin.startsWith('http') && origin.endsWith(domain));
};
exports.isOriginAllowed = isOriginAllowed;
//# sourceMappingURL=cors.js.map