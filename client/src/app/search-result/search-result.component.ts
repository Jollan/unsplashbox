import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SearchInputComponent } from '../search-input/search-input.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ImageService } from '../services/image.service';
import { UnsplashImage } from '../models/image.model';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { rearrangeImages } from '../utils/utils';
import { StateService } from '../services/state.service';
import { LoaderService } from '../services/loader.service';
import { AlertService } from '../services/alert.service';
import { LoaderComponent } from '../utils/loader/loader.component';
import { ImageLoaderComponent } from '../image-loader/image-loader.component';
import { State } from '../models/state.model';

@Component({
  selector: 'app-search-result',
  standalone: true,
  imports: [
    SearchInputComponent,
    CommonModule,
    RouterLink,
    LoaderComponent,
    ImageLoaderComponent,
  ],
  templateUrl: './search-result.component.html',
  styleUrl: './search-result.component.scss',
})
export class SearchResultComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly imageService = inject(ImageService);
  private readonly stateService = inject(StateService);
  private readonly alertService = inject(AlertService);
  readonly loaderService = inject(LoaderService);

  private readonly subscription = new Subscription();
  @ViewChild('observer') private observer: ElementRef;
  private spontaneouslySearch = false;
  private keyword: string;
  private page = 1;
  private totalPage: number;
  unsplashImages: UnsplashImage[][] = [];

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe({
      next: (paramMap) => {
        this.keyword = paramMap.get('keyword')!.toLowerCase();
        const { images, total_pages, nthPage } = history.state as State;
        if (images) {
          this.unsplashImages = images;
          this.totalPage = total_pages;
          this.page = nthPage;
        } else {
          this.spontaneouslySearch = true;
          this.onSearch(this.keyword, this.page);
        }
      },
    });
  }

  ngAfterViewInit() {
    this.initInfiniteQuery();
    this.restoreScrollPosition();
  }

  onSearch(keyword: string, page = 1) {
    keyword = keyword.trim().toLowerCase();
    if (keyword) {
      if (!this.spontaneouslySearch) {
        if (keyword === this.keyword) return;
        const state = this.stateService.pages[keyword];
        if (state) {
          this.router.navigate(['/search/result', keyword], {
            onSameUrlNavigation: 'reload',
            state,
          });
          return;
        }
      }
      this.subscription.add(
        this.imageService.search(keyword, page).subscribe({
          next: ({ data: { results, total, total_pages } }) => {
            if (!this.spontaneouslySearch || !this.unsplashImages.length) {
              this.unsplashImages = rearrangeImages(results);
              this.totalPage = total_pages;
              this.page = 1;
            } else {
              rearrangeImages(results, this.unsplashImages);
            }
            this.spontaneouslySearch = false;
            const state: State = {
              total,
              total_pages,
              nthPage: page,
              images: this.unsplashImages,
            };
            this.stateService.pages[keyword] = state;
            this.router.navigate(['/search/result', keyword], {
              onSameUrlNavigation: 'reload',
              state,
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
  }

  private initInfiniteQuery() {
    const callback: IntersectionObserverCallback = (entries) => {
      if (entries[0].isIntersecting) {
        if (++this.page <= this.totalPage) {
          this.spontaneouslySearch = true;
          this.onSearch(this.keyword, this.page);
        } else if (this.totalPage) {
          intersectionObserver.disconnect();
        }
      }
    };
    const intersectionObserver = new IntersectionObserver(callback, {
      root: null,
      rootMargin: '0px 0px 10px 0px',
    });
    intersectionObserver.observe(this.observer.nativeElement);
  }

  @HostListener('window:scroll')
  private onWindowScroll() {
    this.stateService.scrollY[this.keyword] = scrollY;
  }

  private restoreScrollPosition() {
    const lastY = this.stateService.scrollY[this.keyword];
    if (lastY) {
      setTimeout(() => scrollTo(0, lastY), 100);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
