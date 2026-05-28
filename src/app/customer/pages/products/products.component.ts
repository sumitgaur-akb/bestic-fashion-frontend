import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section class="page catalog">
      <aside class="card filters">
        <h3>Filters</h3>
        <label class="field">Search<input [(ngModel)]="query.search" (input)="load()" /></label>
        <label class="field">Min price<input type="number" [(ngModel)]="query.minPrice" (input)="load()" /></label>
        <label class="field">Rating<select [(ngModel)]="query.minRating" (change)="load()"><option [ngValue]="undefined">Any</option><option [ngValue]="4">4+</option><option [ngValue]="3">3+</option></select></label>
      </aside>
      <div>
        <div class="catalog-head"><div><p>Bestic marketplace</p><h1>Products</h1></div><select [(ngModel)]="query.sort" (change)="load()"><option value="">Newest</option><option value="price_asc">Price low to high</option><option value="price_desc">Price high to low</option></select></div>
        <div class="grid">
          @for (product of products(); track product.id) {
            <a class="card product" [routerLink]="['/products', product.id]">
              <div class="image"><span>Best Deal</span></div><strong>{{ product.title }}</strong><span>{{ product.brand || product.sellerName }}</span><b>₹{{ product.discountPrice || product.price }}</b>
            </a>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`.catalog{display:grid;grid-template-columns:270px 1fr;gap:18px}.filters{position:sticky;top:86px;align-self:start}.filters h3{margin-top:0}.catalog-head{display:flex;justify-content:space-between;align-items:end;margin-bottom:16px}.catalog-head p{margin:0;color:#2874f0;font-weight:900;text-transform:uppercase;font-size:12px}.catalog-head h1{margin:3px 0 0}.catalog-head select{padding:11px;border:1px solid #cbd5e1;border-radius:4px}.product{text-decoration:none;color:inherit;transition:transform .16s ease,box-shadow .16s ease}.product:hover{transform:translateY(-3px);box-shadow:0 14px 34px #0f172a18}.image{height:160px;background:linear-gradient(135deg,#dbeafe,#fef3c7 48%,#ffe4e6);border-radius:5px;margin-bottom:12px;padding:10px}.image span{background:#0f766e;color:#fff;font-size:12px;font-weight:800;padding:5px 8px;border-radius:4px}.product span{color:#64748b}.product b{display:block;margin-top:8px;color:#0f766e;font-size:18px}@media(max-width:760px){.catalog{grid-template-columns:1fr}.filters{position:static}.catalog-head{align-items:stretch;flex-direction:column;gap:10px}}`]
})
export class ProductsComponent implements OnInit {
  query: { search?: string; minPrice?: number; minRating?: number; sort?: string; page: number; pageSize: number } = { page: 1, pageSize: 20 };
  products = signal<any[]>([]);
  constructor(private productsApi: ProductService) {}
  ngOnInit() { this.load(); }
  load() { this.productsApi.search(this.query).subscribe((res: any) => this.products.set(res.data?.items ?? [])); }
}
