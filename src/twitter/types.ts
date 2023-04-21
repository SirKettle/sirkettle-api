// "Raw" types from twitter api

import { IPost } from '../types';

export interface IRawTweetMedia {
  media_url: string;
  media_url_https: string;
  sizes: any;
  type: string;
}

export interface IRawTweet {
  [key: string]: string | number;
  created_at: string;
  text?: string;
  full_text?: string;
}

/**
 * @deprecated The endpoint is temporary until migration to getUserTweets has been completed
 */
export interface ILegacyTweet extends Omit<IRawTweet, 'created_at'> {
  created_at: number;
}
