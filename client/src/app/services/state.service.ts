import { Injectable } from '@angular/core';
import { State } from '../models/state.model';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  pages: { [k: string]: State } = {};
  scrollY: { [k: string]: number } = {};
}
