import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = route => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.currentUser()) return true;
  if (auth.isAdmin()) return router.createUrlTree(['/admin/sellers']);
  if (auth.isSeller()) {
    const status = auth.sellerStatus();
    return router.createUrlTree([status === 'Approved' ? '/seller/dashboard' : status === 'PendingKyc' ? '/seller/onboarding' : '/seller/pending']);
  }
  return router.createUrlTree(['/']);
};
