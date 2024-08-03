import { Component, Input } from '@angular/core';
import { Collection } from '../../models/collection.model';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.scss',
})
export class CollectionComponent {
  @Input()
  action: string;
  @Input()
  icon: string;
  @Input()
  name: string;
  @Input()
  photoCount: number;
  @Input()
  thumbnailUrl: string;
  @Input()
  collections: Collection[];
}
