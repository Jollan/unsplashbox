import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CollectionService } from '../../services/collection.service';
import { Collection } from '../../models/collection.model';
import { Image } from '../../models/image.model';
import { Subscription } from 'rxjs';
import { rearrangeImages } from '../../utils/utils';

@Component({
  selector: 'app-images',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './images.component.html',
  styleUrl: './images.component.scss',
})
export class ImagesComponent implements OnInit, OnDestroy {
  private readonly activatedRoute = inject(ActivatedRoute);

  collectionService = inject(CollectionService);
  collection: Collection | undefined;
  images: Image[][] = [];

  private readonly subscription = new Subscription();

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.subscription.add(
        this.collectionService.get$.subscribe({
          next: (collections) => {
            this.collection = collections.find((collection) => {
              return collection._id === id;
            });
            if (this.collection) {
              this.images = rearrangeImages(this.collection.images);
            }
          },
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
