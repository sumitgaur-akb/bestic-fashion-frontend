import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const sellerApprovedGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.currentUser()) return router.createUrlTree(['/seller/login']);
  if (!auth.isSeller()) return router.createUrlTree(['/seller/login']);
  return auth.sellerStatus() === 'Approved' ? true : router.createUrlTree([auth.sellerStatus() === 'PendingKyc' ? '/seller/onboarding' : '/seller/pending']);
};
