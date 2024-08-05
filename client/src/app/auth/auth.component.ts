import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { LoaderService } from '../services/loader.service';
import { LoaderComponent } from '../utils/loader/loader.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly alertService = inject(AlertService);
  readonly loaderService = inject(LoaderService);

  loginMode = true;

  @ViewChild('form')
  form: NgForm;

  ngOnInit(): void {
    if (this.authService.userData) {
      history.forward();
    }
  }

  switchMode() {
    this.loginMode = !this.loginMode;
  }
  onFormSubmitted() {
    const mode = this.loginMode ? 'login' : 'register';
    this.authService[mode](this.form.value).subscribe({
      next: ({ data }) => {
        localStorage.setItem(
          'userData',
          JSON.stringify((this.authService.userData = data))
        );
        this.router.navigateByUrl('/home');
      },
      error: (error) => {
        this.alertService.message.set({
          content: error.error.message,
          type: 'error',
        });
      },
      complete: () => {
        this.alertService.message.set({
          content: 'Connected successfully',
          type: 'info',
        });
      },
    });
  }
}
