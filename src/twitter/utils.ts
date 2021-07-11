import { pathOr, propEq, map, uniqBy, prop, concat, compose, uniq } from 'ramda';
import { IRawTweetMedia, IMedia, IRawTweet } from './types';

export const mapMedia = (m: IRawTweetMedia): IMedia => ({
  src: m.media_url,
  srcHttps: m.media_url_https,
  width: m.sizes?.small?.w || 100,
  height: m.sizes?.small?.h || 100,
});

export const getTweetImages = (tweet: IRawTweet): IMedia[] => {
  const extraMedia: IRawTweetMedia[] = pathOr([], ['extended_entities', 'media'])(tweet);
  const media: IRawTweetMedia[] = pathOr([], ['entities', 'media'])(tweet);
  const photos: IRawTweetMedia[] = media.concat(extraMedia).filter(propEq('type', 'photo'));
  const formatted: IMedia[] = map(mapMedia)(photos);
  return uniqBy<IMedia, string>(prop('src'), formatted);
};

export const getHashTags = (tweet: IRawTweet): string[] => {
  const tags = pathOr([], ['entities', 'hashtags'])(tweet);
  const extra = pathOr([], ['extended_entities', 'hashtags'])(tweet);
  const allTags = concat(tags, extra);
  return compose(uniq, map<unknown, string>(prop<string>('text')))(allTags);
};
