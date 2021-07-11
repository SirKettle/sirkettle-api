"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicV4 = exports.getPublicIpV4 = void 0;
const public_ip_1 = require("public-ip");
const getPublicIpV4 = () => __awaiter(void 0, void 0, void 0, function* () {
    const ipv4 = yield public_ip_1.v4();
    return ipv4;
});
exports.getPublicIpV4 = getPublicIpV4;
const getPublicV4 = (req, res) => {
    exports.getPublicIpV4().then((ip) => {
        res.send({ ip });
    });
};
exports.getPublicV4 = getPublicV4;
//# sourceMappingURL=index.js.map