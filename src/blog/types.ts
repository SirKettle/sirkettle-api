import { IPost } from '../types';

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
