import { UnsplashImage } from "./image.model";

export interface State {
    total: number;
    total_pages: number;
    images: UnsplashImage[][];
    nthPage: number;
    navigationId?: number;
  }
  