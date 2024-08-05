import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { JsonResponse } from '../models/metadata';
import { Credentials, UserData } from '../models/auth.model';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

type AuthResponse = JsonResponse<UserData>;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  userData?: UserData | null;

  login(body: Credentials) {
    return this.http.post<AuthResponse>(`${environment.api}/auth/login`, body);
  }

  logout() {
    this.router.navigateByUrl('/logout');
  }

  register(body: Credentials) {
    return this.http.post<AuthResponse>(
      `${environment.api}/auth/register`,
      body
    );
  }
}
