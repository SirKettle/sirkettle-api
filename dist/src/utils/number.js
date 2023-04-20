"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intOr = void 0;
var intOr = function (stringInt, or) {
    if (or === void 0) { or = 0; }
    var int = parseInt(stringInt);
    if (isNaN(int)) {
        return or;
    }
    return int;
};
exports.intOr = intOr;
//# sourceMappingURL=number.js.map