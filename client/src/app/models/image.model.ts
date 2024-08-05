import { Metadata } from './metadata';

export interface UnsplashImage {
  from: 'unsplash';
  id: string;
  description: string;
  alt_description: string;
  width: number;
  height: number;
  created_at: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    id: string;
    name: string;
    profile_image: {
      small: string;
      medium: string;
      large: string;
    };
  };
}

export interface UnsplashResponse {
  total: number;
  total_pages: number;
  results: UnsplashImage[];
}

interface Data {
  unsplashId: string;
  filename: string;
  url: string;
  width: number;
  height: number;
  author: string;
  profileImageUrl: string;
  publishedDate: string;
}

export interface ImageBody extends Data {}

export interface Image extends Data, Metadata {
  from: 'app';
}
