import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { JsonResponse } from '../models/metadata';
import { Image, ImageBody, UnsplashResponse } from '../models/image.model';

export type SearchResponse = JsonResponse<UnsplashResponse>;
export type ImageResponse = JsonResponse<{ image: Image }>;

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private readonly http = inject(HttpClient);

  search(query: string, page = 1) {
    return this.http.get<SearchResponse>(
      `${environment.api}/images/search?query=${query}&page=${page}`
    );
  }

  add(collectionId: string, body: ImageBody) {
    return this.http.post<ImageResponse>(
      `${environment.api}/images/${collectionId}`,
      body
    );
  }

  remove(collectionId: string, id: string) {
    return this.http.delete(`${environment.api}/images/${collectionId}/${id}`);
  }

  // getImage() {

  // }

  getImageBlob(url: string) {
    return this.http.get(url, { responseType: 'blob' });
  }
}
