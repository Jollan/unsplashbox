import { Injectable } from '@angular/core';
import { SearchResponse } from './image.service';

@Injectable({
  providedIn: 'root',
})
export class SearchResponseStateService {
  pages: { [k: string]: { [p: number]: SearchResponse } } = {};
}
