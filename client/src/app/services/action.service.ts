import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Collection } from '../models/collection.model';
import { Image } from '../models/image.model';

@Injectable({ providedIn: 'root' })
export class ActionService {
  readonly action = new Subject<
    Collection | [string, Image] | [string, string]
  >();
}
