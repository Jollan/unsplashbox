import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { JsonResponse } from '../models/metadata';
import { Collection, CollectionBody } from '../models/collection.model';
import { ActionService } from './action.service';
import { map, merge, Observable, scan, shareReplay } from 'rxjs';
import { without } from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  private readonly http = inject(HttpClient);
  private readonly actionService = inject(ActionService);

  readonly get$: Observable<Collection[]> = merge(
    this.get().pipe(map(({ data: { collections } }) => collections.reverse())),
    this.actionService.action
  ).pipe(scan(accumulator), shareReplay(1));

  get() {
    return this.http.get<
      JsonResponse<{
        count: number;
        collections: Collection[];
      }>
    >(`${environment.api}/collections`);
  }

  create(body: CollectionBody) {
    return this.http.post<
      JsonResponse<{
        collection: Collection;
      }>
    >(`${environment.api}/collections`, body);
  }
}

function accumulator(collections: Collection[], value: any) {
  if (value.images) collections.unshift(value);
  else {
    const collection = collections.find((collection) => {
      return collection._id === value[0];
    });
    if (collection) {
      if (typeof value[1] === 'string') {
        collection.images = collection.images.filter((image) => {
          return image.unsplashId !== value[1];
        });
        if (!collection.images.length) {
          collections = collections.filter((collection) => {
            return collection.images.length;
          });
        }
      } else {
        collections = without(collections, collection);
        collection.images.unshift(value[1]);
        collections.unshift(collection);
      }
    }
  }
  return collections;
}
