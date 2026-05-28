import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { ProductService } from '../../../core/services/product.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  standalone: true,
  template: `
    <section class="page detail">
      <div class="gallery">
        <span>{{ product()?.brand || 'FlipShop' }}</span>
      </div>
      @if (product(); as item) {
        <div class="card">
          <p class="seller">{{ item.sellerName }}</p>
          <h1>{{ item.title }}</h1>
          <div class="price">Rs {{ item.discountPrice || item.price }} @if (item.discountPrice) { <s>Rs {{ item.price }}</s> }</div>
          <label class="field">Variant
            <select [value]="selectedVariantId()" (change)="selectedVariantId.set(+$any($event.target).value)">
              @for (variant of item.variants; track variant.id) {
                <option [value]="variant.id">{{ variant.color || 'Default' }} {{ variant.size || '' }} - Stock {{ variant.stock }}</option>
              }
            </select>
          </label>
          <button class="btn" (click)="addToCart()" [disabled]="!selectedVariantId()">Add to cart</button>
          <button class="btn buy" (click)="buyNow()" [disabled]="!selectedVariantId()">Buy now</button>
          <button class="btn secondary" type="button">Wishlist</button>
        </div>
      }
    </section>
  `,
  styles: [`.detail{display:grid;grid-template-columns:1fr 1fr;gap:18px}.gallery{min-height:420px;background:linear-gradient(135deg,#dbeafe,#fef3c7 48%,#ffe4e6);border:1px solid #e5e7eb;border-radius:6px;display:grid;place-items:start;padding:18px}.gallery span{background:#0f766e;color:#fff;font-weight:800;padding:6px 10px;border-radius:4px}.seller{margin:0 0 6px;color:#2874f0;font-weight:900}.price{font-size:26px;font-weight:900;color:#0f766e;margin:12px 0}.price s{font-size:16px;color:#64748b;margin-left:8px}.btn{margin-right:10px}.buy{background:#f59e0b}@media(max-width:760px){.detail{grid-template-columns:1fr}}`]
})
export class ProductDetailComponent implements OnInit {
  product = signal<any | null>(null);
  selectedVariantId = signal<number | null>(null);

  constructor(private route: ActivatedRoute, private router: Router, private products: ProductService, private cart: CartService, private toast: ToastService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.products.getById(id).subscribe({
      next: (res: any) => {
        this.product.set(res.data);
        this.selectedVariantId.set(res.data?.variants?.[0]?.id ?? null);
      },
      error: err => this.toast.error('Product unavailable', err.error?.message || 'Unable to load product.')
    });
  }

  addToCart() {
    const variantId = this.selectedVariantId();
    if (!variantId) return;
    this.cart.add(variantId, 1).subscribe({
      next: () => this.toast.success('Added to cart', 'Product is ready for checkout.'),
      error: err => this.toast.error('Cart failed', err.error?.message || 'Unable to add product to cart.')
    });
  }

  buyNow() {
    const variantId = this.selectedVariantId();
    if (!variantId) return;
    this.cart.add(variantId, 1).subscribe({
      next: () => this.router.navigateByUrl('/checkout'),
      error: err => this.toast.error('Buy now failed', err.error?.message || 'Unable to start checkout.')
    });
  }
}
