import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { JsonResponse } from '../models/metadata';
import { Credentials, User, UserData } from '../models/auth.model';
import { environment } from '../../environments/environment';

type AuthResponse = JsonResponse<UserData>;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  userData: UserData;

  login(body: Credentials) {
    return this.http.post<AuthResponse>(`${environment.api}/auth/login`, body);
  }

  register(body: Credentials) {
    return this.http.post<AuthResponse>(
      `${environment.api}/auth/register`,
      body
    );
  }
}
