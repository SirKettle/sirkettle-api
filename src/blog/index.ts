import fetch from 'node-fetch';
import type { Request, Response } from 'express';
import { intOr } from '../utils/number';
import { IRawTumblrImage, ITumblrPost, ITumblrPostsResponse } from './types';
import { IVideo, IImage, IErrorResponse, IPost, IBlogPostsResponse } from '../types';
import { getUserTweets } from '../twitter';

const userApiKey = (userId: string) =>
  ({
    hjthirkettle: 'wZ76ugorKsu10IUwVRzRNT9KyyMkmJY6OV63wXsfHpBq4xIXIN',
    thirkettle: 'vmNUaWxCt9rGA83Jk5x0S4Mh7kqpDkBKM6t8HESW1CT7AVP5xr',
    sirkettle: 'vmNUaWxCt9rGA83Jk5x0S4Mh7kqpDkBKM6t8HESW1CT7AVP5xr',
    thefittedfurnitureco: 'QRs0zRM8RYtfElH5NwCwjfDuICbwtVLU3QKgNxruioXxX17vXw',
  }[userId] || '');

const getVideoFromBody = ({ body }: ITumblrPost): IVideo => {
  if (/<video /.test(body)) {
    try {
      const video = JSON.parse(body.split("data-npf='")[1].split("'>")[0]);
      return {
        posterUrl: (video.poster && video.poster[0] && video.poster[0].url) || null,
        mediaUrl: (video.media && video.media.url) || null,
      };
    } catch (e) {
      console.log('getVideoFromBody error');
      console.log(e);
      return null;
    }
  }
  return null;
};

const getImagesFromPhotos = ({ photos }: ITumblrPost): IImage[] => {
  return (photos || []).map((photo) => {
    const largestPhoto = photo.alt_sizes[0];
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

const getImageFromBody = ({ body }: ITumblrPost): IImage | null => {
  if (/<img /.test(body)) {
    try {
      const imgAttrStr = body.split('<img')[1].split('/>')[0];
      const imgAttrKeys = ['src', 'data-orig-width', 'data-orig-height'];
      const raw: IRawTumblrImage = imgAttrKeys.reduce((acc, key) => {
        const search: string = ` ${key}="`;
        const value = imgAttrStr.split(search)[1]?.split('" ')[0];
        return {
          ...acc,
          [key]: isNaN(Number(value)) ? value : Number(value),
        };
      }, {});
      return {
        src: raw.src || '',
        srcHttps: raw.src || '', // for legacy clients
        width: typeof raw['data-orig-width'] === 'number' ? raw['data-orig-width'] : 0,
        height: typeof raw['data-orig-height'] === 'number' ? raw['data-orig-height'] : 0,
      };
    } catch (e) {
      console.log('getImageFromBody error');
      console.log(e);
      return null;
    }
  }
  return null;
};

const getPosts = async (req: Request): Promise<IBlogPostsResponse | IErrorResponse> => {
  const postCount = intOr(req.query.count, 30);
  const maxPostsLimit = 20; // tumblr ony sends max 20
  const pagesCount = Math.ceil(postCount / maxPostsLimit);
  const userId = req.params.userId || `${req.query.tumblr_id || ''}`;
  const apiKey = userApiKey(userId);

  try {
    const result: IBlogPostsResponse = {
      userName: '',
      count: 0,
      data: [],
    };

    let page = 0;

    while (page < pagesCount) {
      const url = `https://api.tumblr.com/v2/blog/${userId}/posts`;
      const offset = page * maxPostsLimit;
      const limit = Math.min(maxPostsLimit, postCount);
      const response = await fetch(
        `${url}?api_key=${apiKey}&offset=${offset}&limit=${limit}${req.query.type ? `&type=${req.query.type}` : ''}`
      );

      console.log('call tumblr api', { url, offset, limit });

      const json = (await response.json()) as ITumblrPostsResponse;

      if (json?.meta?.status >= 400) {
        return {
          error: json.errors,
          status: json?.meta?.status,
        };
      }

      result.userName = userId;
      result.tumblrUserId = userId;
      result.data = [
        ...result.data,
        ...json.response.posts.map((p) => {
          console.log(p);
          console.log(JSON.stringify(p));
          return {
            images: [getImageFromBody(p), ...getImagesFromPhotos(p)].filter(Boolean),
            videos: [getVideoFromBody(p)].filter(Boolean),
            text: p.summary,
            url: p.short_url,
            createdAtIso: new Date(p.timestamp * 1000).toISOString(),
            hashTags: p.tags,
          };
        }),
      ];
      result.count = result.data.length;
      result.tumblrPostsCount = result.data.length;
      page += 1;
    }

    return result;
  } catch (e) {
    return {
      error: e,
    };
  }
};

export const getBlogPostsRequest = async (req: Request, res: Response<IBlogPostsResponse | IErrorResponse>) => {
  const handleResult = (result: IBlogPostsResponse | IErrorResponse) => {
    if (result?.status >= 400) {
      res.status(result?.status);
    }
    res.send(result);
  };

  try {
    const result = await getPosts(req);
    handleResult(result);
  } catch (e) {
    handleResult({
      error: e,
      status: 500,
    });
  }
};

const sortByLatest = (a: IPost, b: IPost) => (a.createdAtIso < b.createdAtIso ? 1 : -1);

const isBlogPostsResponse = (test: unknown): test is IBlogPostsResponse => {
  if (typeof test !== 'object') {
    return false;
  }
  if ((test as IBlogPostsResponse).data) {
    return Array.isArray((test as IBlogPostsResponse).data);
  }
  return false;
};

export const getPostsAndTweetsRequest = async (req: Request, res: Response<IBlogPostsResponse | IErrorResponse>) => {
  const handleResult = (result: IBlogPostsResponse | IErrorResponse) => {
    if (result?.status >= 400) {
      res.status(result?.status);
    }
    res.send(result);
  };

  try {
    const blogPosts = await getPosts(req);
    const tweets = await getUserTweets(req);
    const result: IBlogPostsResponse = {
      count: 0,
      userName: [req.query.tumblr_id, req.query.twitter_id].filter(Boolean).join(','),
      data: [],
    };

    if (isBlogPostsResponse(blogPosts)) {
      result.tumblrUserId = blogPosts.tumblrUserId;
      result.tumblrPostsCount = blogPosts.tumblrPostsCount;
      result.data = [...result.data, ...blogPosts.data].sort(sortByLatest);
    }
    if (isBlogPostsResponse(tweets)) {
      result.twitterUserId = tweets.twitterUserId;
      result.tweetCount = tweets.count;
      result.data = [...result.data, ...tweets.data].sort(sortByLatest);
    }

    const maxPosts = intOr(req.query.count, Infinity);

    if (result.data.length > maxPosts) {
      result.data = result.data.slice(0, maxPosts);
    }

    result.count = result.data.length;

    handleResult(result);
  } catch (e) {
    handleResult({
      error: e,
      status: 500,
    });
  }
};
