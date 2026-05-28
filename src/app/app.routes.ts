import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { customerOnlyGuard } from './core/guards/customer-only.guard';
import { guestGuard } from './core/guards/guest.guard';
import { portalRedirectGuard } from './core/guards/portal-redirect.guard';
import { roleGuard } from './core/guards/role.guard';
import { sellerApprovedGuard } from './core/guards/seller-approved.guard';

export const routes: Routes = [
  { path: '', canActivate: [portalRedirectGuard], loadComponent: () => import('./customer/pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'products', canActivate: [portalRedirectGuard], loadComponent: () => import('./customer/pages/products/products.component').then(m => m.ProductsComponent) },
  { path: 'products/:id', canActivate: [portalRedirectGuard], loadComponent: () => import('./customer/pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
  { path: 'login', canActivate: [guestGuard], loadComponent: () => import('./customer/pages/auth/auth.component').then(m => m.AuthComponent) },
  { path: 'otp', canActivate: [guestGuard], loadComponent: () => import('./customer/pages/otp/otp.component').then(m => m.OtpComponent) },
  { path: 'cart', canActivate: [customerOnlyGuard], loadComponent: () => import('./customer/pages/cart/cart.component').then(m => m.CartComponent) },
  { path: 'checkout', canActivate: [customerOnlyGuard], loadComponent: () => import('./customer/pages/checkout/checkout.component').then(m => m.CheckoutComponent) },
  { path: 'orders', canActivate: [customerOnlyGuard], loadComponent: () => import('./customer/pages/orders/orders.component').then(m => m.OrdersComponent) },
  { path: 'orders/:id', canActivate: [customerOnlyGuard], loadComponent: () => import('./customer/pages/order-detail/order-detail.component').then(m => m.OrderDetailComponent) },
  { path: 'profile', canActivate: [customerOnlyGuard], loadComponent: () => import('./customer/pages/profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'addresses', canActivate: [customerOnlyGuard], loadComponent: () => import('./customer/pages/addresses/addresses.component').then(m => m.AddressesComponent) },
  { path: 'seller/login', canActivate: [guestGuard], loadComponent: () => import('./seller/pages/auth/seller-auth.component').then(m => m.SellerAuthComponent) },
  { path: 'seller/otp', canActivate: [guestGuard], loadComponent: () => import('./seller/pages/otp/seller-otp.component').then(m => m.SellerOtpComponent) },
  { path: 'seller/onboarding', canActivate: [authGuard, roleGuard], data: { roles: ['Seller'] }, loadComponent: () => import('./seller/pages/onboarding/seller-onboarding.component').then(m => m.SellerOnboardingComponent) },
  { path: 'seller/pending', canActivate: [authGuard, roleGuard], data: { roles: ['Seller'] }, loadComponent: () => import('./seller/pages/pending/seller-pending.component').then(m => m.SellerPendingComponent) },
  { path: 'seller/dashboard', canActivate: [sellerApprovedGuard], loadComponent: () => import('./seller/pages/dashboard/seller-dashboard.component').then(m => m.SellerDashboardComponent) },
  { path: 'seller/products', canActivate: [sellerApprovedGuard], loadComponent: () => import('./seller/pages/products/seller-products.component').then(m => m.SellerProductsComponent) },
  { path: 'seller/products/new', canActivate: [sellerApprovedGuard], loadComponent: () => import('./seller/pages/product-form/seller-product-form.component').then(m => m.SellerProductFormComponent) },
  { path: 'seller/products/:id/edit', canActivate: [sellerApprovedGuard], loadComponent: () => import('./seller/pages/product-form/seller-product-form.component').then(m => m.SellerProductFormComponent) },
  { path: 'seller/orders', canActivate: [sellerApprovedGuard], loadComponent: () => import('./seller/pages/orders/seller-orders.component').then(m => m.SellerOrdersComponent) },
  { path: 'seller/orders/:id', canActivate: [sellerApprovedGuard], loadComponent: () => import('./seller/pages/order-detail/seller-order-detail.component').then(m => m.SellerOrderDetailComponent) },
  { path: 'seller/profile', canActivate: [sellerApprovedGuard], loadComponent: () => import('./seller/pages/profile/seller-profile.component').then(m => m.SellerProfileComponent) },
  { path: 'seller/reports', canActivate: [sellerApprovedGuard], loadComponent: () => import('./seller/pages/reports/seller-reports.component').then(m => m.SellerReportsComponent) },
  { path: 'admin', canActivate: [authGuard, roleGuard], data: { roles: ['Admin'] }, loadComponent: () => import('./admin/pages/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
  { path: 'admin/users', canActivate: [authGuard, roleGuard], data: { roles: ['Admin'] }, loadComponent: () => import('./admin/pages/users/manage-users.component').then(m => m.ManageUsersComponent) },
  { path: 'admin/sellers', canActivate: [authGuard, roleGuard], data: { roles: ['Admin'] }, loadComponent: () => import('./admin/pages/sellers/manage-sellers.component').then(m => m.ManageSellersComponent) },
  { path: 'admin/categories', canActivate: [authGuard, roleGuard], data: { roles: ['Admin'] }, loadComponent: () => import('./admin/pages/categories/manage-categories.component').then(m => m.ManageCategoriesComponent) },
  { path: '**', redirectTo: '' }
];
