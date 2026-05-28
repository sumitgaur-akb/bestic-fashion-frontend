import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const customerOnlyGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.currentUser()) return router.createUrlTree(['/login']);
  if (auth.isCustomer()) return true;
  if (auth.isSeller()) return router.createUrlTree(['/seller/dashboard']);
  if (auth.isAdmin()) return router.createUrlTree(['/admin/sellers']);
  return router.createUrlTree(['/login']);
};
