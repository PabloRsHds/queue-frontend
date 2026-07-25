import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = () => {

  const router = inject(Router);

  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken || isTokenExpired(refreshToken)) {
    return true; // Pode acessar o login
  }

  // Já autenticado
  return router.createUrlTree(['/home']);
};

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}
