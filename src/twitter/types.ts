// "Raw" types from twitter api

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

// Custom types

export interface IMedia {
  src: string;
  srcHttps: string;
  width: number;
  height: number;
}

export interface IDecoratedTweet {
  createdAtIso: string;
  text: string;
  url?: string | null;
  hashTags: string[];
  images: IMedia[];
  raw: IRawTweet;
}

/**
 * @deprecated The endpoint is temporary until migration to getUserTweets has been completed
 */
export interface ILegacyTweet extends Omit<IRawTweet, 'created_at'> {
  created_at: number;
}
