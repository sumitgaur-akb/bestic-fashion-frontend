import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page cart-page">
      <div class="toolbar">
        <h1>Cart</h1>
        <a class="btn" routerLink="/checkout" [class.disabled]="!cart()?.items?.length">Checkout</a>
      </div>

      @if (cart()?.items?.length) {
        <div class="cart-layout">
          <div class="items">
            @for (item of cart()!.items; track item.id) {
              <article class="card cart-item">
                <div>
                  <strong>{{ item.productTitle }}</strong>
                  <span>Variant #{{ item.productVariantId }}</span>
                  <b>Rs {{ item.unitPrice }}</b>
                </div>
                <div class="qty">
                  <button type="button" (click)="changeQty(item, item.quantity - 1)" [disabled]="item.quantity <= 1">-</button>
                  <span>{{ item.quantity }}</span>
                  <button type="button" (click)="changeQty(item, item.quantity + 1)">+</button>
                </div>
                <div class="line">
                  <strong>Rs {{ item.lineTotal }}</strong>
                  <button class="link-danger" type="button" (click)="remove(item.id)">Remove</button>
                </div>
              </article>
            }
          </div>
          <aside class="card summary">
            <span>Total</span>
            <strong>Rs {{ cart()!.total }}</strong>
            <a class="btn" routerLink="/checkout">Place order</a>
          </aside>
        </div>
      } @else {
        <div class="card empty">
          <h2>Your cart is empty</h2>
          <p>Add a product before checkout.</p>
          <a class="btn" routerLink="/products">Browse products</a>
        </div>
      }
    </section>
  `,
  styles: [`.cart-layout{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:16px}.items{display:grid;gap:12px}.cart-item{display:grid;grid-template-columns:1fr auto auto;gap:16px;align-items:center}.cart-item span{display:block;color:#64748b;margin:5px 0}.cart-item b,.line strong,.summary strong{color:#0f766e}.qty{display:grid;grid-template-columns:36px 42px 36px;align-items:center;text-align:center}.qty button{height:36px;border:1px solid #cbd5e1;background:#fff;border-radius:4px;font-size:18px;cursor:pointer}.qty button:disabled{opacity:.45;cursor:not-allowed}.line{display:grid;gap:8px;justify-items:end}.link-danger{border:0;background:transparent;color:#dc2626;font-weight:800;cursor:pointer}.summary{position:sticky;top:86px;align-self:start;display:grid;gap:12px}.summary span{color:#64748b;font-weight:800}.summary strong{font-size:28px}.empty{display:grid;gap:10px;justify-items:start}.disabled{pointer-events:none;opacity:.55}@media(max-width:760px){.cart-layout{grid-template-columns:1fr}.cart-item{grid-template-columns:1fr}.line{justify-items:start}.summary{position:static}}`]
})
export class CartComponent implements OnInit {
  cart = signal<any | null>(null);

  constructor(private cartApi: CartService, private toast: ToastService) {}

  ngOnInit() { this.load(); }

  load() {
    this.cartApi.get().subscribe({
      next: (res: any) => this.cart.set(res.data),
      error: err => this.toast.error('Cart unavailable', err.error?.message || 'Unable to load cart.')
    });
  }

  changeQty(item: any, quantity: number) {
    if (quantity < 1) return;
    this.cartApi.update(item.productVariantId, quantity).subscribe({
      next: (res: any) => this.cart.set(res.data),
      error: err => this.toast.error('Quantity not updated', err.error?.message || 'Try again.')
    });
  }

  remove(itemId: number) {
    this.cartApi.remove(itemId).subscribe({
      next: (res: any) => {
        this.cart.set(res.data);
        this.toast.success('Removed from cart');
      },
      error: err => this.toast.error('Remove failed', err.error?.message || 'Try again.')
    });
  }
}
