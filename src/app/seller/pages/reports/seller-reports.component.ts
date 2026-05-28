import { Component } from '@angular/core';
import { SellerSidebarComponent } from '../../../shared/components/seller-sidebar/seller-sidebar.component';
@Component({ standalone: true, imports: [SellerSidebarComponent], template: `<section class="seller-layout"><app-seller-sidebar /><div class="seller-content"><h1>Sales Reports</h1><div class="card">Revenue chart and product performance placeholders.</div></div></section>` })
export class SellerReportsComponent {}
