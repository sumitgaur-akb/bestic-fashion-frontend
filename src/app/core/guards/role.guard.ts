import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = route => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const roles = route.data['roles'] as string[] | undefined;
  return !roles || roles.some(role => auth.hasRole(role)) ? true : router.createUrlTree(['/']);
};
