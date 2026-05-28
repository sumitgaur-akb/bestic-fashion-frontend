import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { ToastService } from '../../../core/services/toast.service';

const issueTags = ['Image mismatch', 'Wrong brand', 'Bad title', 'Price issue', 'Description incomplete'];

@Component({
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="page qc-page">
      <div class="admin-hero"><p>Admin QC</p><h1>Product review queue</h1></div>
      <div class="qc-grid">
        @for (product of products(); track product.id) {
          <article class="card qc-card">
            <img [src]="product.images?.[0]?.imageUrl || '/assets/demo-phone.jpg'" [alt]="product.title" />
            <div class="qc-body">
              <b [class]="product.approvalStatus">{{ product.approvalStatus }}</b>
              <h2>{{ product.title }}</h2>
              <p>{{ product.brand }} • {{ product.sellerName }} • Rs {{ product.discountPrice || product.price }}</p>
              <span>{{ product.description }}</span>
              <div class="tags">
                @for (tag of tags; track tag) {
                  <label><input type="checkbox" [checked]="selected(product.id).includes(tag)" (change)="toggle(product.id, tag)" /> {{ tag }}</label>
                }
              </div>
              <label class="field">QC notes<textarea rows="2" [(ngModel)]="notes[product.id]"></textarea></label>
              <div class="actions">
                <button class="btn" type="button" (click)="review(product.id, true)">Pass QC</button>
                <button class="btn danger" type="button" (click)="review(product.id, false)">Fail QC</button>
              </div>
            </div>
          </article>
        }
      </div>
    </section>
  `,
  styles: [`.admin-hero{background:linear-gradient(135deg,#102a61,#2874f0 60%,#1b9aaa);color:#fff;padding:24px;border-radius:8px;margin-bottom:16px}.admin-hero p{margin:0 0 6px;color:#ffd34d;font-weight:900;text-transform:uppercase;font-size:12px}.admin-hero h1{margin:0}.qc-grid{display:grid;gap:16px}.qc-card{display:grid;grid-template-columns:180px 1fr;gap:18px}.qc-card img{width:180px;height:150px;object-fit:cover;border-radius:6px;background:#eef2ff}.qc-body h2{margin:7px 0}.qc-body p{margin:0;color:#64748b}.qc-body span{display:block;margin:10px 0;line-height:1.5}.qc-body b{display:inline-block;border-radius:999px;padding:5px 9px;background:#fef3c7;color:#92400e;font-size:12px}.qc-body b.Approved{background:#dcfce7;color:#166534}.qc-body b.Rejected{background:#fee2e2;color:#991b1b}.tags{display:flex;gap:10px;flex-wrap:wrap;margin:12px 0}.tags label{background:#f8fafc;border:1px solid #e5e7eb;border-radius:999px;padding:7px 10px;font-weight:800}.actions{display:flex;gap:10px}.danger{background:#dc2626}@media(max-width:760px){.qc-card{grid-template-columns:1fr}.qc-card img{width:100%;height:210px}}`]
})
export class ManageCategoriesComponent implements OnInit {
  tags = issueTags;
  products = signal<any[]>([]);
  notes: Record<number, string> = {};
  tagMap: Record<number, string[]> = {};

  constructor(private productApi: ProductService, private toast: ToastService) {}
  ngOnInit() { this.load(); }
  load() { this.productApi.qcProducts().subscribe({ next: (res: any) => this.products.set(res.data ?? []), error: err => this.toast.error('QC unavailable', err.error?.message || 'Unable to load QC queue.') }); }
  selected(id: number) { return this.tagMap[id] ?? []; }
  toggle(id: number, tag: string) {
    const current = new Set(this.selected(id));
    current.has(tag) ? current.delete(tag) : current.add(tag);
    this.tagMap[id] = [...current];
  }
  review(id: number, approved: boolean) {
    this.productApi.reviewQc(id, { approved, notes: this.notes[id], tags: this.selected(id) }).subscribe({
      next: (res: any) => { this.toast.success(approved ? 'QC passed' : 'QC failed', res.message); this.load(); },
      error: err => this.toast.error('QC update failed', err.error?.message || 'Try again.')
    });
  }
}
