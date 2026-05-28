import { Component } from '@angular/core';
import { SellerSidebarComponent } from '../../../shared/components/seller-sidebar/seller-sidebar.component';
@Component({ standalone: true, imports: [SellerSidebarComponent], template: `<section class="seller-layout"><app-seller-sidebar /><div class="seller-content"><h1>Seller Profile</h1><div class="grid"><div class="card">Business details</div><div class="card">Bank details placeholder</div><div class="card">GST details placeholder</div></div></div></section>` })
export class SellerProfileComponent {}
