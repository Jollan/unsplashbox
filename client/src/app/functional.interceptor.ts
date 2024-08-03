import { HttpInterceptorFn } from '@angular/common/http';
import { LoaderService } from './services/loader.service';
import { finalize } from 'rxjs';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  loaderService.loaded.set(false);
  return next(req).pipe(
    finalize(() => {
      loaderService.loaded.set(true);
    })
  );
};

export const setAuthorizationHeader: HttpInterceptorFn = (req, next) => {
  const userData = inject(AuthService).userData;
  const reqClone = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${userData?.token}`),
  });
  return next(reqClone);
};
