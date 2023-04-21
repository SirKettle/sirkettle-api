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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserTweetsRequest = exports.getUserTweets = exports.getUserTweetsLegacy = exports.init = void 0;
var twitter_1 = __importDefault(require("twitter"));
var ramda_1 = require("ramda");
var number_1 = require("../utils/number");
var utils_1 = require("./utils");
var theffc_20230419_1 = require("./data/theffc_20230419");
var holoholo_20230419_1 = require("./data/holoholo_20230419");
var twitterClient;
var init = function () {
    var twitterCreds = {
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    };
    console.log('Twitter creds loaded from env vars');
    console.log(twitterCreds);
    twitterClient = new twitter_1.default(twitterCreds);
};
exports.init = init;
/**
 * @deprecated The endpoint is temporary until migration to getUserTweets has been completed
 */
var getUserTweetsLegacy = function (req, res) {
    var requestParams = {
        screen_name: req.params.userId || req.query.user || 'thirkettle',
        count: number_1.intOr(req.query.count, 30),
        exclude_replies: true,
        include_rts: req.query.retweets ? true : false,
    };
    twitterClient.get('statuses/user_timeline', requestParams, function (error, tweets, _response) {
        if (!error) {
            res.send(tweets.map(function (t) { return (__assign(__assign({}, t), { 
                // this is to mimick the php endpoint - http://api.thekettlestudio.co.uk/api/tweets.php?user=ffc_the&count=1
                created_at: Math.round(new Date(t.created_at).getTime() / 1000) })); }));
        }
        else {
            res.status(401);
            res.send({
                error: error,
            });
        }
    });
};
exports.getUserTweetsLegacy = getUserTweetsLegacy;
var getUserTweets = function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var count, requestParams, handleError;
    return __generator(this, function (_a) {
        count = number_1.intOr(req.query.count, 30);
        requestParams = {
            screen_name: req.params.userId || "" + (req.query.twitter_id || ''),
            count: count,
            exclude_replies: true,
            include_rts: req.query.retweets ? true : false,
            tweet_mode: 'extended', // this returns the full_text prop - not text
        };
        handleError = function (error, status) {
            if (status === void 0) { status = 401; }
            // before we can come up with a fix / solution to dev api
            // we need to return the snapshot data before Mr Musk restricted
            // the twitter dev api free tier
            switch (requestParams.screen_name) {
                case 'ffc_the': {
                    return theffc_20230419_1.theffcTweetData;
                }
                case 'holohol97642100': {
                    return holoholo_20230419_1.holoholoTweetData;
                }
                default: {
                    return {
                        error: error,
                        status: status,
                    };
                }
            }
        };
        return [2 /*return*/, new Promise(function (resolve, _reject) {
                try {
                    twitterClient.get('statuses/user_timeline', requestParams, function (error, tweets, response) {
                        if (!error) {
                            var data = tweets
                                .map(function (t) {
                                var tweetText = t.full_text || t.text;
                                var textParts = (tweetText || '').replace(/(\r\n|\n|\r|↵)/g, ' ').split(' ');
                                if (textParts.length > 0) {
                                    var maybeUrl = ramda_1.last(textParts);
                                    var url = null;
                                    if (maybeUrl.startsWith('http')) {
                                        url = textParts.pop();
                                    }
                                    var text = textParts.join(' ');
                                    return {
                                        // our calculated fields
                                        createdAtIso: new Date(t.created_at).toISOString(),
                                        text: text,
                                        url: url,
                                        hashTags: utils_1.getHashTags(t),
                                        images: utils_1.getTweetImages(t),
                                        videos: [],
                                        // raw tweet data from twitter api
                                        // raw: {
                                        //   ...t,
                                        // },
                                    };
                                }
                                return;
                            })
                                .filter(Boolean);
                            resolve({
                                userName: requestParams.screen_name,
                                twitterUserId: requestParams.screen_name,
                                data: data,
                                count: data.length,
                                tweetCount: data.length,
                            });
                        }
                        else {
                            resolve(handleError(error, response.statusCode));
                        }
                    });
                }
                catch (e) {
                    resolve(handleError(e));
                }
            })];
    });
}); };
exports.getUserTweets = getUserTweets;
var getUserTweetsRequest = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var handleResult, result, e_1;
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
                return [4 /*yield*/, exports.getUserTweets(req)];
            case 2:
                result = _a.sent();
                handleResult(result);
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                handleResult({
                    error: e_1,
                    status: 500,
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getUserTweetsRequest = getUserTweetsRequest;
//# sourceMappingURL=index.js.map