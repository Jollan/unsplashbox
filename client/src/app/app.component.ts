import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AlertService } from './services/alert.service';
import { SnackbarComponent } from './utils/snackbar/snackbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent, SnackbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly alertService = inject(AlertService);

  hideSnackbar() {
    return setTimeout(() => this.alertService.message.set(null), 3000);
  }
}
