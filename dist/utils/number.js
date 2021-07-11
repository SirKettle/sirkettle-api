"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intOr = void 0;
const intOr = (stringInt, or = 0) => {
    const int = parseInt(stringInt);
    if (isNaN(int)) {
        return or;
    }
    return int;
};
exports.intOr = intOr;
//# sourceMappingURL=number.js.map