"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostsAndTweetsRequest = exports.getBlogPostsRequest = void 0;
var node_fetch_1 = __importDefault(require("node-fetch"));
var number_1 = require("../utils/number");
var twitter_1 = require("../twitter");
var userApiKey = function (userId) {
    return ({
        hjthirkettle: 'wZ76ugorKsu10IUwVRzRNT9KyyMkmJY6OV63wXsfHpBq4xIXIN',
        thirkettle: 'vmNUaWxCt9rGA83Jk5x0S4Mh7kqpDkBKM6t8HESW1CT7AVP5xr',
        sirkettle: 'vmNUaWxCt9rGA83Jk5x0S4Mh7kqpDkBKM6t8HESW1CT7AVP5xr',
    }[userId] || '');
};
var getVideoFromBody = function (_a) {
    var body = _a.body;
    if (/<video /.test(body)) {
        try {
            var video = JSON.parse(body.split("data-npf='")[1].split("'>")[0]);
            return {
                posterUrl: (video.poster && video.poster[0] && video.poster[0].url) || null,
                mediaUrl: (video.media && video.media.url) || null,
            };
        }
        catch (e) {
            console.log('getVideoFromBody error');
            console.log(e);
            return null;
        }
    }
    return null;
};
var getImagesFromPhotos = function (_a) {
    var photos = _a.photos;
    return (photos || []).map(function (photo) {
        var largestPhoto = photo.alt_sizes[0];
        if (largestPhoto) {
            return {
                src: largestPhoto.url,
                srcHttps: largestPhoto.url,
                width: largestPhoto.width,
                height: largestPhoto.height,
            };
        }
    });
};
var getImageFromBody = function (_a) {
    var body = _a.body;
    if (/<img /.test(body)) {
        try {
            var imgAttrStr_1 = body.split('<img')[1].split('/>')[0];
            var imgAttrKeys = ['src', 'data-orig-width', 'data-orig-height'];
            var raw = imgAttrKeys.reduce(function (acc, key) {
                var _a;
                var _b;
                var search = " " + key + "=\"";
                var value = (_b = imgAttrStr_1.split(search)[1]) === null || _b === void 0 ? void 0 : _b.split('" ')[0];
                return __assign(__assign({}, acc), (_a = {}, _a[key] = isNaN(Number(value)) ? value : Number(value), _a));
            }, {});
            return {
                src: raw.src || '',
                srcHttps: raw.src || '',
                width: typeof raw['data-orig-width'] === 'number' ? raw['data-orig-width'] : 0,
                height: typeof raw['data-orig-height'] === 'number' ? raw['data-orig-height'] : 0,
            };
        }
        catch (e) {
            console.log('getImageFromBody error');
            console.log(e);
            return null;
        }
    }
    return null;
};
var getPosts = function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var postCount, maxPostsLimit, pagesCount, userId, apiKey, result, page, url, offset, limit, response, json, e_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                postCount = number_1.intOr(req.query.count, 30);
                maxPostsLimit = 20;
                pagesCount = Math.ceil(postCount / maxPostsLimit);
                userId = req.params.userId || "" + (req.query.tumblr_id || '');
                apiKey = userApiKey(userId);
                _c.label = 1;
            case 1:
                _c.trys.push([1, 6, , 7]);
                result = {
                    userName: '',
                    count: 0,
                    data: [],
                };
                page = 0;
                _c.label = 2;
            case 2:
                if (!(page < pagesCount)) return [3 /*break*/, 5];
                url = "https://api.tumblr.com/v2/blog/" + userId + "/posts";
                offset = page * maxPostsLimit;
                limit = Math.min(maxPostsLimit, postCount);
                return [4 /*yield*/, node_fetch_1.default(url + "?api_key=" + apiKey + "&offset=" + offset + "&limit=" + limit + (req.query.type ? "&type=" + req.query.type : ''))];
            case 3:
                response = _c.sent();
                console.log('call tumblr api', { url: url, offset: offset, limit: limit });
                return [4 /*yield*/, response.json()];
            case 4:
                json = (_c.sent());
                if (((_a = json === null || json === void 0 ? void 0 : json.meta) === null || _a === void 0 ? void 0 : _a.status) >= 400) {
                    return [2 /*return*/, {
                            error: json.errors,
                            status: (_b = json === null || json === void 0 ? void 0 : json.meta) === null || _b === void 0 ? void 0 : _b.status,
                        }];
                }
                result.userName = userId;
                result.tumblrUserId = userId;
                result.data = __spreadArray(__spreadArray([], result.data), json.response.posts.map(function (p) {
                    console.log(p);
                    console.log(JSON.stringify(p));
                    return {
                        images: __spreadArray([getImageFromBody(p)], getImagesFromPhotos(p)).filter(Boolean),
                        videos: [getVideoFromBody(p)].filter(Boolean),
                        text: p.summary,
                        url: p.short_url,
                        createdAtIso: new Date(p.timestamp * 1000).toISOString(),
                        hashTags: p.tags,
                    };
                }));
                result.count = result.data.length;
                result.tumblrPostsCount = result.data.length;
                page += 1;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, result];
            case 6:
                e_1 = _c.sent();
                return [2 /*return*/, {
                        error: e_1,
                    }];
            case 7: return [2 /*return*/];
        }
    });
}); };
var getBlogPostsRequest = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var handleResult, result, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                handleResult = function (result) {
                    if ((result === null || result === void 0 ? void 0 : result.status) >= 400) {
                        res.status(result === null || result === void 0 ? void 0 : result.status);
                    }
                    res.send(result);
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, getPosts(req)];
            case 2:
                result = _a.sent();
                handleResult(result);
                return [3 /*break*/, 4];
            case 3:
                e_2 = _a.sent();
                handleResult({
                    error: e_2,
                    status: 500,
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getBlogPostsRequest = getBlogPostsRequest;
var sortByLatest = function (a, b) { return (a.createdAtIso < b.createdAtIso ? 1 : -1); };
var isBlogPostsResponse = function (test) {
    if (typeof test !== 'object') {
        return false;
    }
    if (test.data) {
        return Array.isArray(test.data);
    }
    return false;
};
var getPostsAndTweetsRequest = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var handleResult, blogPosts, tweets, result, maxPosts, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                handleResult = function (result) {
                    if ((result === null || result === void 0 ? void 0 : result.status) >= 400) {
                        res.status(result === null || result === void 0 ? void 0 : result.status);
                    }
                    res.send(result);
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, getPosts(req)];
            case 2:
                blogPosts = _a.sent();
                return [4 /*yield*/, twitter_1.getUserTweets(req)];
            case 3:
                tweets = _a.sent();
                result = {
                    count: 0,
                    userName: [req.query.tumblr_id, req.query.twitter_id].filter(Boolean).join(','),
                    data: [],
                };
                if (isBlogPostsResponse(blogPosts)) {
                    result.tumblrUserId = blogPosts.tumblrUserId;
                    result.tumblrPostsCount = blogPosts.tumblrPostsCount;
                    result.data = __spreadArray(__spreadArray([], result.data), blogPosts.data).sort(sortByLatest);
                }
                if (isBlogPostsResponse(tweets)) {
                    result.twitterUserId = tweets.twitterUserId;
                    result.tweetCount = tweets.count;
                    result.data = __spreadArray(__spreadArray([], result.data), tweets.data).sort(sortByLatest);
                }
                maxPosts = number_1.intOr(req.query.count, Infinity);
                if (result.data.length > maxPosts) {
                    result.data = result.data.slice(0, maxPosts);
                }
                result.count = result.data.length;
                handleResult(result);
                return [3 /*break*/, 5];
            case 4:
                e_3 = _a.sent();
                handleResult({
                    error: e_3,
                    status: 500,
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getPostsAndTweetsRequest = getPostsAndTweetsRequest;
//# sourceMappingURL=index.js.map