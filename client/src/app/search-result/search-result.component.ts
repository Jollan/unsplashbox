import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SearchInputComponent } from '../search-input/search-input.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ImageService, SearchResponse } from '../services/image.service';
import { UnsplashImage } from '../models/image.model';
import { CommonModule } from '@angular/common';
import { merge, Subscription } from 'rxjs';
import { rearrangeImages } from '../utils/utils';
import { PaginationComponent } from '../pagination/pagination.component';
import { SearchResponseStateService } from '../services/search-response-state.service';
import { LoaderService } from '../services/loader.service';
import { AlertService } from '../services/alert.service';
import { LoaderComponent } from '../utils/loader/loader.component';

@Component({
  selector: 'app-search-result',
  standalone: true,
  imports: [
    SearchInputComponent,
    CommonModule,
    RouterLink,
    PaginationComponent,
    LoaderComponent,
  ],
  templateUrl: './search-result.component.html',
  styleUrl: './search-result.component.scss',
})
export class SearchResultComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly imageService = inject(ImageService);
  private readonly responseState = inject(SearchResponseStateService);
  private readonly alertService = inject(AlertService);
  readonly loaderService = inject(LoaderService);

  private readonly subscription = new Subscription();
  private spontaneouslySearch = false;
  private keyword: string;
  page: number | undefined;
  totalPage: number;
  unsplashImages: UnsplashImage[][];

  ngOnInit() {
    let paramMapEmissionCount = 0;
    merge(
      this.activatedRoute.paramMap,
      this.activatedRoute.queryParamMap
    ).subscribe({
      next: (paramMap) => {
        paramMapEmissionCount += 1;
        this.keyword = paramMap.get('keyword') || this.keyword;
        this.page = +paramMap.get('page')! || undefined;
        if (paramMapEmissionCount > 1) {
          try {
            const {
              data: { results, total_pages },
            } = history.state as SearchResponse;
            this.unsplashImages = rearrangeImages(results);
            this.totalPage = total_pages;
          } catch (error) {
            this.spontaneouslySearch = true;
            this.onSearch(this.keyword, this.page);
          }
        }
      },
    });
  }

  onSearch(keyword = this.keyword, page?: number) {
    [this.keyword, this.page] = [keyword.trim(), page];
    if (this.keyword) {
      if (!page) {
        const state = this.responseState.pages[this.keyword]?.[1];
        if (state) {
          this.navigate(state);
          return;
        }
      }
      this.subscription.add(
        this.imageService.search(this.keyword, page).subscribe({
          next: (response) => {
            if (this.spontaneouslySearch) {
              this.unsplashImages = rearrangeImages(response.data.results);
              this.totalPage = response.data.total_pages;
              this.spontaneouslySearch = false;
            }
            this.responseState.pages[this.keyword] = {
              ...this.responseState.pages[this.keyword],
              [page ?? 1]: response,
            };
            this.navigate(response, page);
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

  private navigate(state: SearchResponse, page?: number) {
    this.router.navigate(['/search/result', this.keyword], {
      queryParams: { page },
      onSameUrlNavigation: 'reload',
      state,
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
