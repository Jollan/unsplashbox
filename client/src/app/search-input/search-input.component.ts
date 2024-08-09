import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  @Output()
  readonly keyword = new EventEmitter<string>();
  @ViewChild('input')
  input: NgModel;

  value: string | null;

  ngOnInit(): void {
    this.value = this.route.snapshot.paramMap.get('keyword');
  }
}
