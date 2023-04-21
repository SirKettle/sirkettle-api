export interface IErrorResponse {
  error: unknown;
  status?: number;
}

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
  twitterUserId?: string;
  tumblrUserId?: string;
  tweetCount?: number;
  tumblrPostsCount?: number;
}
