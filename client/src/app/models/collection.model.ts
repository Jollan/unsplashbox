import { Image, ImageBody } from './image.model';
import { Metadata } from './metadata';

export class CollectionBody extends ImageBody {
  constructor(
    name: string,
    author: string,
    profileImageUrl: string,
    publishedDate: string,
    unsplashId: string,
    image: Blob,
    filename: string,
    width: number,
    height: number
  ) {
    super(
      author,
      profileImageUrl,
      publishedDate,
      unsplashId,
      image,
      filename,
      width,
      height
    );
    this.append('name', name);
  }
}

export interface Collection extends Metadata {
  name: string;
  images: Image[];
  user: string;
}
