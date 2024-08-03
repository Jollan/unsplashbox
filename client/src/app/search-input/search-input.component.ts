import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent {
  @Output()
  readonly keyword = new EventEmitter<string>();
  @ViewChild('input')
  input: NgModel;
}
