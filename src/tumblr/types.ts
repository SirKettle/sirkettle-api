export interface IVideo {
  posterUrl: string;
  mediaUrl: string;
}

export interface IImage {
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
  images: IImage[];
}

export interface IErrorResponse {
  error: unknown;
  status?: number;
}

export interface IUserTweetsResponse {
  tweetCount: number;
  twitterUserId: string;
  data: IDecoratedTweet[];
}

export interface ITumblrBlog extends Record<string, unknown> {
  name: string;
  title: string;
  url: string;
}

interface ITumblrPostPhotoMeta {
  url: string;
  width: number;
  height: number;
}

interface ITumblrPostPhoto {
  caption: string;
  original_size: ITumblrPostPhotoMeta;
  alt_sizes: ITumblrPostPhotoMeta[];
}

export interface ITumblrPost extends Record<string, unknown> {
  type: 'text' | 'photo' | 'video';
  timestamp: number;
  tags: string[];
  short_url: string;
  summary: string;
  body?: string;
  photos?: ITumblrPostPhoto[];
}

export interface ITumblrPostsResponse {
  meta: { status: number; msg: string };
  errors?: { title: string; code: number; detail: string }[];
  response: {
    blog: ITumblrBlog;
    posts: ITumblrPost[];
    total_posts: number;
  };
}

export interface IRawTumblrImage {
  src?: string;
  'data-orig-width'?: number;
  'data-orig-height'?: number;
}

export interface IPost {
  createdAtIso: string;
  text: string;
  url?: string | null;
  hashTags: string[];
  images: IImage[];
  videos: IVideo[];
}

export interface IBlogPostsResponse {
  count: number;
  userName: string;
  data: IPost[];
  status?: number;
}
