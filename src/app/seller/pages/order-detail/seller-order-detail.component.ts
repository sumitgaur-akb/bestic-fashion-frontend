import { Component } from '@angular/core';
import { SellerSidebarComponent } from '../../../shared/components/seller-sidebar/seller-sidebar.component';
@Component({ standalone: true, imports: [SellerSidebarComponent], template: `<section class="seller-layout"><app-seller-sidebar /><div class="seller-content card"><h1>Seller Order Detail</h1><p>Update packed, shipped, delivered, or cancelled status.</p></div></section>` })
export class SellerOrderDetailComponent {}
