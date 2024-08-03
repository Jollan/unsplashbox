import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  loginMode = true;

  @ViewChild('form')
  form: NgForm;

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
    });
  }
}
