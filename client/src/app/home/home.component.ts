import { Component, inject, OnDestroy } from '@angular/core';
import { SearchInputComponent } from '../search-input/search-input.component';
import { ImageService } from '../services/image.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StateService } from '../services/state.service';
import { LoaderComponent } from '../utils/loader/loader.component';
import { LoaderService } from '../services/loader.service';
import { AlertService } from '../services/alert.service';
import { State } from '../models/state.model';
import { rearrangeImages } from '../utils/utils';

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
  private readonly stateService = inject(StateService);
  private readonly alertService = inject(AlertService);
  readonly loaderService = inject(LoaderService);

  private readonly subscription = new Subscription();

  onSearch(keyword: string) {
    keyword = keyword.trim().toLowerCase();
    if (keyword) {
      const state = this.stateService.pages[keyword];
      if (state) {
        this.router.navigate(['/search/result', keyword], {
          state,
        });
        return;
      }
      this.subscription.add(
        this.imageService.search(keyword).subscribe({
          next: ({ data: { results, total, total_pages } }) => {
            const state: State = {
              total,
              total_pages,
              nthPage: 1,
              images: rearrangeImages(results),
            };
            this.router.navigate(['/search/result', keyword], {
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
