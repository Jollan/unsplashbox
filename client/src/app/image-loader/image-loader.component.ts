import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoaderComponent } from '../utils/loader/loader.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-image-loader',
  standalone: true,
  imports: [RouterLink, LoaderComponent, NgClass],
  templateUrl: './image-loader.component.html',
  styleUrl: './image-loader.component.scss',
})
export class ImageLoaderComponent {
  @Input()
  src: string;
  @Input()
  alt: string;
  @Input()
  state: any;
  @Input()
  route: any;
  @Input()
  class: string;
}
