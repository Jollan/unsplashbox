import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { SearchInputComponent } from '../../search-input/search-input.component';
import { CollectionComponent } from '../collection/collection.component';
import { Collection } from '../../models/collection.model';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { LetDirective } from '../../utils/directives/custom.directive';
import { LoaderService } from '../../services/loader.service';
import { LoaderComponent } from '../../utils/loader/loader.component';

@Component({
  selector: 'app-add-image',
  standalone: true,
  imports: [
    SearchInputComponent,
    CollectionComponent,
    CommonModule,
    LetDirective,
    LoaderComponent
  ],
  templateUrl: './add-image.component.html',
  styleUrl: './add-image.component.scss',
})
export class AddImageComponent implements AfterViewInit, OnChanges {
  readonly loaderService = inject(LoaderService);

  @ViewChild('searchInput')
  searchInput: SearchInputComponent;
  @Output()
  collectionId = new EventEmitter<string>();
  @Output()
  collectionName = new EventEmitter<string>();
  @Input()
  collections: Collection[] = [];
  searchResult: Collection[] = [];
  readonly apiUrl = `${environment.api}/images/thumb`;

  ngOnChanges() {
    this.searchResult = this.collections;
  }

  ngAfterViewInit() {
    this.searchInput.input.valueChanges?.subscribe({
      next: (value: string) => {
        value = value.trim();
        if (value) {
          this.searchResult = this.collections.filter((collection) => {
            return collection.name.toLowerCase().indexOf(value) !== -1;
          });
        } else if (!value || !this.searchResult.length) {
          this.searchResult = this.collections;
        }
      },
    });
  }
}
