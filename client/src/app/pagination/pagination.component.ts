import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchResponseStateService } from '../services/search-response-state.service';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private responseState = inject(SearchResponseStateService);

  @Input()
  totalPage: number;
  @Input()
  currPage: number;

  keyword: string;

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (paramMap) => {
        this.keyword = paramMap.get('keyword')!;
      },
    });
  }
  previous() {
    --this.currPage;
    const state = this.responseState.pages[this.keyword]?.[this.currPage];
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currPage },
      state,
    });
  }

  next() {
    ++this.currPage;
    const state = this.responseState.pages[this.keyword]?.[this.currPage];
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currPage },
      state,
    });
  }
}
