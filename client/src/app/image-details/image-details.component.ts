import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DimmerComponent } from '../utils/dimmer/dimmer.component';
import { AddImageComponent } from './add-image/add-image.component';
import { CollectionComponent } from './collection/collection.component';
import { Image, ImageBody, UnsplashImage } from '../models/image.model';
import { CommonModule } from '@angular/common';
import { ImageService } from '../services/image.service';
import { CollectionService } from '../services/collection.service';
import { Collection } from '../models/collection.model';
import { environment } from '../../environments/environment';
import { ActionService } from '../services/action.service';
import { Subscription } from 'rxjs';
import { LetDirective } from '../utils/directives/custom.directive';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { LoaderService } from '../services/loader.service';
import { LoaderComponent } from '../utils/loader/loader.component';

@Component({
  selector: 'app-image-details',
  standalone: true,
  imports: [
    CollectionComponent,
    DimmerComponent,
    AddImageComponent,
    CommonModule,
    LetDirective,
    LoaderComponent,
  ],
  templateUrl: './image-details.component.html',
  styleUrl: './image-details.component.scss',
})
export class ImageDetailsComponent implements OnInit, OnDestroy {
  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly imageService = inject(ImageService);
  private readonly collectionService = inject(CollectionService);
  private readonly actionService = inject(ActionService);
  private readonly alertService = inject(AlertService);
  readonly loaderService = inject(LoaderService);

  private readonly subscription = new Subscription();
  readonly apiUrl = `${environment.api}/images/thumb`;
  private imageBody: ImageBody;

  author: string;
  profileImageUrl: string;
  publishedDate: string;
  unsplashId: string;
  filename: string;
  url: string;
  image: Image | UnsplashImage;
  downloadUrl: string;
  addMode = false;
  collections: Collection[] = [];
  nCollections: Collection[] = [];

  ngOnInit(): void {
    try {
      this.getImage();
    } catch (error: any) {
      this.alertService.message.set({
        content: error.message,
        type: 'error',
      });
      return;
    }
    this.initProps();

    this.subscription.add(
      this.imageService.getImageBlob(this.url).subscribe({
        next: (image) => {
          this.downloadUrl = URL.createObjectURL(image);
        },
        error: (error) => {
          this.alertService.message.set({
            content: error.error?.message ?? 'Something went wrong !',
            type: 'error',
          });
        },
      })
    );

    this.subscription.add(
      this.collectionService.get$.subscribe({
        next: (collections) => {
          this.collections = collections.filter((collection) => {
            return collection.images.some((image) => {
              return image.unsplashId === this.unsplashId;
            });
          });
          this.nCollections = collections.filter((collection) => {
            return !collection.images.some((image) => {
              return image.unsplashId === this.unsplashId;
            });
          });
        },
        error: (error) => {
          this.alertService.message.set({
            content: error.error?.message ?? 'Something went wrong !',
            type: 'error',
          });
        },
      })
    );
  }

  addToCollection(collectionId: string) {
    this.subscription.add(
      this.imageService.add(collectionId, this.imageBody).subscribe({
        next: ({ data: { image } }) => {
          this.actionService.action.next([collectionId, image]);
        },
        error: (error) => {
          this.alertService.message.set({
            content: error.error?.message ?? 'Something went wrong !',
            type: 'error',
          });
        },
        complete: () => {
          this.alertService.message.set({
            content: 'Added !',
            type: 'success',
          });
        },
      })
    );
  }

  createCollection(name: string) {
    this.collectionService.create({ name,...this.imageBody }).subscribe({
      next: ({ data: { collection } }) => {
        this.actionService.action.next(collection);
      },
      error: (error) => {
        this.alertService.message.set({
          content: error.error?.message ?? 'Something went wrong !',
          type: 'error',
        });
      },
      complete: () => {
        this.alertService.message.set({
          content: 'Added !',
          type: 'success',
        });
      },
    });
  }

  removeFromCollection(collectionId: string) {
    this.imageService.remove(collectionId, this.unsplashId).subscribe({
      complete: () => {
        this.actionService.action.next([collectionId, this.unsplashId]);
        this.alertService.message.set({
          content: 'Removed !',
          type: 'warning',
        });
      },
      error: (error) => {
        this.alertService.message.set({
          content: error.error?.message ?? 'Something went wrong !',
          type: 'error',
        });
      },
    });
  }

  private getImage() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      const collection = history.state as Collection;
      const image = collection.images.find((image) => image._id === id);
      if (!image) {
        throw new Error('Image not found in the collection.');
      }
      this.image = { ...image, from: 'app' };
    } else this.image = { ...history.state, from: 'unsplash' } as UnsplashImage;
  }

  private initProps() {
     const width = this.image.width;
     const height = this.image.height;
    if (this.image.from === 'unsplash') {
      this.author = this.image.user.name;
      const filename = this.image.description ?? this.image.alt_description;
      this.filename = filename.replaceAll(' ', '-');
      this.publishedDate = this.image.created_at;
      this.unsplashId = this.image.id;
      this.url = this.image.urls.regular;
      this.profileImageUrl = this.image.user.profile_image.medium;
    } else {
      this.author = this.image.author;
      this.filename = this.image.filename;
      this.publishedDate = this.image.publishedDate;
      this.unsplashId = this.image.unsplashId;
      this.url = this.image.url;
      this.profileImageUrl = this.image.profileImageUrl;
    }
    this.imageBody = {
      author: this.author,
      filename: this.filename,
      profileImageUrl: this.profileImageUrl,
      publishedDate: this.publishedDate,
      unsplashId: this.unsplashId,
      url: this.url,
      height,
      width
    };
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    URL.revokeObjectURL(this.downloadUrl);
  }
}
