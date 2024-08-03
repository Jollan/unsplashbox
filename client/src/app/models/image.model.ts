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

export class ImageBody extends FormData {
  constructor(
    author: string,
    profileImageUrl: string,
    publishedDate: string,
    unsplashId: string,
    image: Blob,
    filename: string,
    width: number,
    height: number
  ) {
    super();
    this.append('author', author);
    this.append('profileImageUrl', profileImageUrl);
    this.append('publishedDate', publishedDate);
    this.append('unsplashId', unsplashId);
    this.append('width', width.toString());
    this.append('height', height.toString());
    this.append(
      'image',
      image,
      `${filename}${image.type.replace('image/', '.')}`
    );
  }
}

export interface Image extends Metadata {
  from: 'app';
  unsplashId: string;
  filename: string;
  originalname: string;
  url: string;
  size: number;
  width: number;
  height: number;
  mimetype: string;
  author: string;
  profileImageUrl: string;
  publishedDate: string;
}
