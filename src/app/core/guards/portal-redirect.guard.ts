import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const portalRedirectGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAdmin()) return router.createUrlTree(['/admin/sellers']);
  if (auth.isSeller()) return router.createUrlTree([auth.sellerStatus() === 'Approved' ? '/seller/dashboard' : auth.sellerStatus() === 'PendingKyc' ? '/seller/onboarding' : '/seller/pending']);
  return true;
};
