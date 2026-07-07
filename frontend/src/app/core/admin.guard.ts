import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  // decodifica il token per leggere il ruolo
  const payload = JSON.parse(atob(token.split('.')[1]));
  if (payload.role === 'admin') {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};