import { Component, inject, OnInit } from '@angular/core';
import { CollectionService } from '../services/collection.service';
import { catchError, EMPTY, Observable } from 'rxjs';
import { Collection } from '../models/collection.model';
import { LetDirective } from '../utils/directives/custom.directive';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { ImageLoaderComponent } from '../image-loader/image-loader.component';
import { AlertService } from '../services/alert.service';
import { LoaderService } from '../services/loader.service';
import { LoaderComponent } from '../utils/loader/loader.component';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [LetDirective, CommonModule, ImageLoaderComponent, LoaderComponent],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.scss',
})
export class CollectionsComponent implements OnInit {
  private readonly alertService = inject(AlertService);
  private readonly collectionService = inject(CollectionService);
  readonly loaderService = inject(LoaderService);

  readonly apiUrl = `${environment.api}/images/thumb`;

  collections$: Observable<Collection[]>;

  ngOnInit(): void {
    this.collections$ = this.collectionService.get$.pipe(
      catchError((error) => {
        this.alertService.message.set({
          content: error.error?.message ?? 'Something went wrong !',
          type: 'error',
        });
        return EMPTY;
      })
    );
  }
}
