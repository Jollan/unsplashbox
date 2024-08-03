import { Component, inject, OnDestroy } from '@angular/core';
import { SearchInputComponent } from '../search-input/search-input.component';
import { ImageService } from '../services/image.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SearchResponseStateService } from '../services/search-response-state.service';
import { LoaderComponent } from '../utils/loader/loader.component';
import { LoaderService } from '../services/loader.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchInputComponent, LoaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly imageService = inject(ImageService);
  private readonly responseState = inject(SearchResponseStateService);
  private readonly alertService = inject(AlertService);
  readonly loaderService = inject(LoaderService);

  private readonly subscription = new Subscription();

  onSearch(keyword: string) {
    keyword = keyword.trim();
    if (keyword) {
      const state = this.responseState.pages[keyword]?.[1];
      if (state) {
        this.router.navigate(['/search/result', keyword], {
          state,
        });
        return;
      }
      this.subscription.add(
        this.imageService.search(keyword).subscribe({
          next: (response) => {
            this.responseState.pages[keyword] = {
              ...this.responseState.pages[keyword],
              [1]: response,
            };
            this.router.navigate(['/search/result', keyword], {
              state: response,
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
