import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const AuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    return true; // Allow access if token exists
  }

  router.navigate(['/login']);
  return false; // Redirect to login if no token
};
