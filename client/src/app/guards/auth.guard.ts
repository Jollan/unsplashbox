import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const CanActivate = () => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const data = auth.userData ?? JSON.parse(localStorage.getItem('userData')!);

  if (!data) {
    router.navigateByUrl('/authen');
    return false;
  } else {
    if (data.exp < Date.now() / 1000) {
      router.navigateByUrl('/authen');
      return false;
    }
    auth.userData = data;
    return true;
  }
};
