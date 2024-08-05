import { Image, ImageBody } from './image.model';
import { Metadata } from './metadata';

interface Data {
  name: string;
}

export interface CollectionBody extends Data, ImageBody {}

export interface Collection extends Data, Metadata {
  images: Image[];
  user: string;
}
