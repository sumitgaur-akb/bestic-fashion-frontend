import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { ToastService } from '../../../core/services/toast.service';
import { SellerSidebarComponent } from '../../../shared/components/seller-sidebar/seller-sidebar.component';

@Component({
  standalone: true,
  imports: [RouterLink, SellerSidebarComponent],
  template: `
    <section class="seller-layout">
      <app-seller-sidebar />
      <div class="seller-content">
        <div class="seller-hero"><div><p>Catalog control</p><h1>Products & QC</h1></div><a class="btn" routerLink="/seller/products/new">Add product</a></div>
        <div class="product-grid">
          @for (product of products(); track product.id) {
            <article class="card product-card">
              <img [src]="product.images?.[0]?.imageUrl || '/assets/demo-phone.jpg'" [alt]="product.title" />
              <div>
                <b [class]="product.approvalStatus">{{ product.approvalStatus }}</b>
                <h2>{{ product.title }}</h2>
                <p>{{ product.brand }} • Rs {{ product.discountPrice || product.price }}</p>
                @if (product.qcTags) { <span class="qc">QC tags: {{ product.qcTags }}</span> }
                @if (product.qcNotes) { <span class="qc">Notes: {{ product.qcNotes }}</span> }
              </div>
              <div class="actions">
                <a class="btn secondary" [routerLink]="['/seller/products', product.id, 'edit']">Edit</a>
                @if (product.approvalStatus === 'Rejected') {
                  <button class="btn" type="button" (click)="submit(product.id)">Resend QC</button>
                }
              </div>
            </article>
          } @empty {
            <div class="card empty"><h2>No products yet</h2><p>Add a product and send it for QC.</p></div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`.seller-hero{display:flex;justify-content:space-between;gap:16px;align-items:center;margin-bottom:18px;background:linear-gradient(135deg,#102a61,#2874f0 58%,#1b9aaa);color:#fff;padding:22px;border-radius:8px}.seller-hero p{margin:0 0 4px;color:#ffd34d;font-weight:900;text-transform:uppercase;font-size:12px}.seller-hero h1{margin:0}.product-grid{display:grid;gap:14px}.product-card{display:grid;grid-template-columns:118px 1fr auto;gap:16px;align-items:center}.product-card img{width:118px;height:92px;object-fit:cover;border-radius:6px;background:#eef2ff}.product-card h2{margin:6px 0}.product-card p{color:#64748b;margin:0}.product-card b{display:inline-block;border-radius:999px;padding:5px 9px;background:#e0f2fe;color:#075985;font-size:12px}.product-card b.Approved{background:#dcfce7;color:#166534}.product-card b.Rejected{background:#fee2e2;color:#991b1b}.product-card b.PendingApproval{background:#fef3c7;color:#92400e}.qc{display:block;color:#dc2626;font-weight:800;margin-top:4px}.actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:end}.empty{display:grid;gap:8px}@media(max-width:760px){.product-card{grid-template-columns:1fr}.actions{justify-content:start}}`]
})
export class SellerProductsComponent implements OnInit {
  products = signal<any[]>([]);
  constructor(private productApi: ProductService, private toast: ToastService) {}
  ngOnInit() { this.load(); }
  load() { this.productApi.sellerProducts().subscribe({ next: (res: any) => this.products.set(res.data ?? []), error: err => this.toast.error('Products unavailable', err.error?.message || 'Unable to load products.') }); }
  submit(id: number) { this.productApi.submitQc(id).subscribe({ next: res => { this.toast.success('Sent to QC', (res as any).message); this.load(); }, error: err => this.toast.error('QC submit failed', err.error?.message || 'Try again.') }); }
}
