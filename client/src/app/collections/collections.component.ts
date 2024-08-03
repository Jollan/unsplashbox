import { Component, inject, OnInit } from '@angular/core';
import { CollectionService } from '../services/collection.service';
import { Observable } from 'rxjs';
import { Collection } from '../models/collection.model';
import { LetDirective } from '../utils/directives/custom.directive';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [LetDirective, CommonModule, RouterLink],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.scss'
})
export class CollectionsComponent implements OnInit {
  collectionService = inject(CollectionService);
  collections$: Observable<Collection[]>;
  
  readonly apiUrl = `${environment.api}/images/thumb`;

  ngOnInit(): void {
    this.collections$ = this.collectionService.get$.pipe()
  }

}
