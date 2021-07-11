"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHashTags = exports.getTweetImages = exports.mapMedia = void 0;
const ramda_1 = require("ramda");
const mapMedia = (m) => {
    var _a, _b, _c, _d;
    return ({
        src: m.media_url,
        srcHttps: m.media_url_https,
        width: ((_b = (_a = m.sizes) === null || _a === void 0 ? void 0 : _a.small) === null || _b === void 0 ? void 0 : _b.w) || 100,
        height: ((_d = (_c = m.sizes) === null || _c === void 0 ? void 0 : _c.small) === null || _d === void 0 ? void 0 : _d.h) || 100,
    });
};
exports.mapMedia = mapMedia;
const getTweetImages = (tweet) => {
    const extraMedia = ramda_1.pathOr([], ['extended_entities', 'media'])(tweet);
    const media = ramda_1.pathOr([], ['entities', 'media'])(tweet);
    const photos = media.concat(extraMedia).filter(ramda_1.propEq('type', 'photo'));
    const formatted = ramda_1.map(exports.mapMedia)(photos);
    return ramda_1.uniqBy(ramda_1.prop('src'), formatted);
};
exports.getTweetImages = getTweetImages;
const getHashTags = (tweet) => {
    const tags = ramda_1.pathOr([], ['entities', 'hashtags'])(tweet);
    const extra = ramda_1.pathOr([], ['extended_entities', 'hashtags'])(tweet);
    const allTags = ramda_1.concat(tags, extra);
    return ramda_1.compose(ramda_1.uniq, ramda_1.map(ramda_1.prop('text')))(allTags);
};
exports.getHashTags = getHashTags;
//# sourceMappingURL=utils.js.map