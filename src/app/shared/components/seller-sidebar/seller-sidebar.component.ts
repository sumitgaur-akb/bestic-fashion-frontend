import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-seller-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="seller-nav">
      <a routerLink="/seller/dashboard" routerLinkActive="active">Dashboard</a>
      <a routerLink="/seller/products" routerLinkActive="active">Products</a>
      <a routerLink="/seller/products/new" routerLinkActive="active">Add Product</a>
      <a routerLink="/seller/orders" routerLinkActive="active">Orders</a>
      <a routerLink="/seller/reports" routerLinkActive="active">Reports</a>
      <a routerLink="/seller/profile" routerLinkActive="active">Profile</a>
    </aside>
  `,
  styles: [`.seller-nav{display:flex;flex-direction:column;gap:5px;padding:16px;background:linear-gradient(180deg,#102a61,#172337);min-height:calc(100vh - 64px);box-shadow:10px 0 24px #0f172a10}.seller-nav a{color:#dbeafe;text-decoration:none;padding:12px;border-radius:5px;font-weight:800}.seller-nav a.active,.seller-nav a:hover{background:#2874f0;color:#fff}`]
})
export class SellerSidebarComponent {}
