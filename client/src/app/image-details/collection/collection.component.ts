import { Component, Input } from '@angular/core';
import { Collection } from '../../models/collection.model';
import { ImageLoaderComponent } from '../../image-loader/image-loader.component';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [ImageLoaderComponent],
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
