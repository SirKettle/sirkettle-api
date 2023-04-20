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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserTweets = exports.getUserTweetsLegacy = exports.init = void 0;
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
var getUserTweets = function (req, res) {
    var tweetCount = number_1.intOr(req.query.count, 30);
    var requestParams = {
        screen_name: req.params.userId,
        count: tweetCount,
        exclude_replies: true,
        include_rts: req.query.retweets ? true : false,
        tweet_mode: 'extended', // this returns the full_text prop - not text
    };
    var handleError = function (error) {
        // before we can come up with a fix / solution to dev api
        // we need to return the snapshot data before Mr Musk restricted
        // the twitter dev api free tier
        switch (requestParams.screen_name) {
            case 'ffc_the': {
                res.send(theffc_20230419_1.theffcTweetData);
                return;
            }
            case 'holohol97642100': {
                res.send(holoholo_20230419_1.holoholoTweetData);
                return;
            }
            default: {
                res.status(401);
                res.send({
                    error: error,
                });
            }
        }
    };
    try {
        twitterClient.get('statuses/user_timeline', requestParams, function (error, tweets, _response) {
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
                            // raw tweet data from twitter api
                            // raw: {
                            //   ...t,
                            // },
                        };
                    }
                    return;
                })
                    .filter(function (t) { return !!t; });
                res.send({
                    tweetCount: tweetCount,
                    twitterUserId: req.params.userId,
                    data: data,
                });
            }
            else {
                handleError(error);
            }
        });
    }
    catch (e) {
        handleError(e);
    }
};
exports.getUserTweets = getUserTweets;
//# sourceMappingURL=index.js.map