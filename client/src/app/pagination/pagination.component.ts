import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent implements OnInit {

  @Input()
  totalPage: number;
  @Input()
  currPage: number;

  keyword: string;

  ngOnInit(): void {
    
  }
  previous() {
    
  }

  next() {
    
  }
}
