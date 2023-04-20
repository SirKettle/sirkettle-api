import type { Request, Response } from 'express';
import TwitterClient from 'twitter';
import { last } from 'ramda';
import type { IRawTweet, ILegacyTweet, IDecoratedTweet, IUserTweetsResponse, IErrorResponse } from './types';
import { intOr } from '../utils/number';
import { getHashTags, getTweetImages } from './utils';
import { theffcTweetData } from './data/theffc_20230419';
import { holoholoTweetData } from './data/holoholo_20230419';

let twitterClient: TwitterClient;

export const init = () => {
  const twitterCreds = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  };

  console.log('Twitter creds loaded from env vars');
  console.log(twitterCreds);
  twitterClient = new TwitterClient(twitterCreds);
};

/**
 * @deprecated The endpoint is temporary until migration to getUserTweets has been completed
 */
export const getUserTweetsLegacy = (req: Request, res: Response) => {
  const requestParams = {
    screen_name: req.params.userId || req.query.user || 'thirkettle',
    count: intOr(req.query.count, 30),
    exclude_replies: true,
    include_rts: req.query.retweets ? true : false,
  };

  twitterClient.get('statuses/user_timeline', requestParams, function (error, tweets, _response) {
    if (!error) {
      res.send(
        tweets.map(
          (t: IRawTweet): ILegacyTweet => ({
            ...t,
            // this is to mimick the php endpoint - http://api.thekettlestudio.co.uk/api/tweets.php?user=ffc_the&count=1
            created_at: Math.round(new Date(t.created_at).getTime() / 1000), // unix timestamp in seconds!
          })
        )
      );
    } else {
      res.status(401);
      res.send({
        error,
      });
    }
  });
};

export const getUserTweets = (req: Request, res: Response<IUserTweetsResponse | IErrorResponse>) => {
  const tweetCount = intOr(req.query.count, 30);

  const requestParams = {
    screen_name: req.params.userId,
    count: tweetCount,
    exclude_replies: true,
    include_rts: req.query.retweets ? true : false,
    tweet_mode: 'extended', // this returns the full_text prop - not text
  };

  const handleError = (error: unknown) => {
    // before we can come up with a fix / solution to dev api
    // we need to return the snapshot data before Mr Musk restricted
    // the twitter dev api free tier
    switch (requestParams.screen_name) {
      case 'ffc_the': {
        res.send(theffcTweetData);
        return;
      }
      case 'holohol97642100': {
        res.send(holoholoTweetData);
        return;
      }
      default: {
        res.status(401);
        res.send({
          error,
        });
      }
    }
  };

  try {
    twitterClient.get('statuses/user_timeline', requestParams, function (error, tweets, _response) {
      if (!error) {
        const data = tweets
          .map((t: IRawTweet): IDecoratedTweet | undefined => {
            const tweetText = t.full_text || t.text;
            const textParts = (tweetText || '').replace(/(\r\n|\n|\r|↵)/g, ' ').split(' ');
            if (textParts.length > 0) {
              const maybeUrl = last(textParts);
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
                hashTags: getHashTags(t),
                images: getTweetImages(t),
                // raw tweet data from twitter api
                // raw: {
                //   ...t,
                // },
              };
            }
            return;
          })
          .filter((t?: IDecoratedTweet) => !!t);

        res.send({
          tweetCount,
          twitterUserId: req.params.userId,
          data,
        });
      } else {
        handleError(error);
      }
    });
  } catch (e) {
    handleError(e);
  }
};
