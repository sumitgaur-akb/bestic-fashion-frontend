import { Component, OnInit, signal } from '@angular/core';
import { SellerSidebarComponent } from '../../../shared/components/seller-sidebar/seller-sidebar.component';
import { SellerDashboardService } from '../../../core/services/seller-dashboard.service';

@Component({
  standalone: true,
  imports: [SellerSidebarComponent],
  template: `
    <section class="seller-layout"><app-seller-sidebar /><div class="seller-content">
      <div class="seller-hero"><div><p>Bestic Seller Hub</p><h1>Seller Dashboard</h1></div><a class="btn" href="/seller/products/new">Add product</a></div>
      <div class="grid stats">
        @for (stat of stats(); track stat.label) { <div class="card"><span>{{ stat.label }}</span><h2>{{ stat.value }}</h2></div> }
      </div>
      <div class="card"><h3>Recent orders</h3><table class="table"><tr><th>Order</th><th>Status</th><th>Total</th></tr><tr><td>FS demo</td><td>Placed</td><td>₹0</td></tr></table></div>
    </div></section>
  `,
  styles: [`.seller-hero{display:flex;justify-content:space-between;gap:16px;align-items:center;margin-bottom:18px;background:linear-gradient(135deg,#102a61,#2874f0 58%,#1b9aaa);color:#fff;padding:22px;border-radius:8px}.seller-hero p{margin:0 0 4px;color:#ffd34d;font-weight:900;text-transform:uppercase;font-size:12px}.seller-hero h1{margin:0}.stats .card{border-top:4px solid #ffd34d}.stats span{color:#64748b;font-weight:800}.stats h2{margin:8px 0 0;color:#172337}`]
})
export class SellerDashboardComponent implements OnInit {
  stats = signal([{ label: 'Total orders', value: 0 }, { label: 'Pending orders', value: 0 }, { label: 'Total revenue', value: '₹0' }, { label: 'Low stock', value: 0 }]);
  constructor(private dashboard: SellerDashboardService) {}
  ngOnInit() { this.dashboard.summary().subscribe((res: any) => { const s = res.data; if (s) this.stats.set([{ label: 'Total orders', value: s.totalOrders }, { label: 'Pending orders', value: s.pendingOrders }, { label: 'Total revenue', value: `₹${s.totalRevenue}` }, { label: 'Low stock', value: s.lowStockProducts }]); }); }
}
