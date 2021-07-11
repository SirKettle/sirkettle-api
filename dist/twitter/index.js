"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserTweets = exports.getUserTweetsLegacy = exports.init = void 0;
const twitter_1 = __importDefault(require("twitter"));
const ramda_1 = require("ramda");
const number_1 = require("../utils/number");
const utils_1 = require("./utils");
let twitterClient;
const init = () => {
    const twitterCreds = {
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
const getUserTweetsLegacy = (req, res) => {
    const requestParams = {
        screen_name: req.params.userId || req.query.user || 'thirkettle',
        count: number_1.intOr(req.query.count, 30),
        exclude_replies: true,
        include_rts: req.query.retweets ? true : false,
    };
    twitterClient.get('statuses/user_timeline', requestParams, function (error, tweets, _response) {
        if (!error) {
            res.send(tweets.map((t) => (Object.assign(Object.assign({}, t), { 
                // this is to mimick the php endpoint - http://api.thekettlestudio.co.uk/api/tweets.php?user=ffc_the&count=1
                created_at: Math.round(new Date(t.created_at).getTime() / 1000) }))));
        }
        else {
            res.status(401);
            res.send({
                error,
            });
        }
    });
};
exports.getUserTweetsLegacy = getUserTweetsLegacy;
const getUserTweets = (req, res) => {
    const tweetCount = number_1.intOr(req.query.count, 30);
    const requestParams = {
        screen_name: req.params.userId,
        count: tweetCount,
        exclude_replies: true,
        include_rts: req.query.retweets ? true : false,
        tweet_mode: 'extended', // this returns the full_text prop - not text
    };
    twitterClient.get('statuses/user_timeline', requestParams, function (error, tweets, _response) {
        if (!error) {
            const data = tweets
                .map((t) => {
                const tweetText = t.full_text || t.text;
                const textParts = (tweetText || '').replace(/(\r\n|\n|\r|↵)/g, ' ').split(' ');
                if (textParts.length > 0) {
                    const maybeUrl = ramda_1.last(textParts);
                    let url = null;
                    if (maybeUrl.startsWith('http')) {
                        url = textParts.pop();
                    }
                    const text = textParts.join(' ');
                    return {
                        // our calculated fields
                        createdAtIso: new Date(t.created_at).toISOString(),
                        text,
                        url,
                        hashTags: utils_1.getHashTags(t),
                        images: utils_1.getTweetImages(t),
                        // raw tweet data from twitter api
                        raw: Object.assign({}, t),
                    };
                }
                return;
            })
                .filter((t) => !!t);
            res.send({
                tweetCount,
                twitterUserId: req.params.userId,
                data,
            });
        }
        else {
            res.status(401);
            res.send({
                error,
            });
        }
    });
};
exports.getUserTweets = getUserTweets;
//# sourceMappingURL=index.js.map