import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AddressService } from '../../../core/services/address.service';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section class="page checkout">
      <div class="toolbar"><h1>Checkout</h1><a routerLink="/cart">Back to cart</a></div>

      @if (cart()?.items?.length) {
        <div class="checkout-grid">
          <form class="card panel" (ngSubmit)="placeOrder()">
            <h2>Delivery</h2>
            <label class="field">Delivery address
              <select [(ngModel)]="addressId" name="addressId">
                <option [ngValue]="0">Use default saved address</option>
                @for (address of addresses(); track address.id) {
                  <option [ngValue]="address.id">#{{ address.id }} {{ address.fullName }} - {{ address.city }}</option>
                }
              </select>
            </label>
            <p class="hint">Add a complete address from the Addresses page if this list is empty.</p>

            <h2>Payment</h2>
            <div class="payment">
              <label><input type="radio" [(ngModel)]="paymentMethod" name="paymentMethod" value="COD" /> Cash on delivery</label>
              <label><input type="radio" [(ngModel)]="paymentMethod" name="paymentMethod" value="Online" /> Online</label>
            </div>

            <h2>Order confirmation</h2>
            <div class="otp-row">
              <button class="btn secondary" type="button" (click)="sendOtp()">Send order OTP</button>
            </div>
            <label class="field">OTP<input [(ngModel)]="otp" name="otp" maxlength="6" /></label>
            <button class="btn" type="submit" [disabled]="placing() || !otp">Place order</button>
          </form>

          <aside class="card summary">
            <h2>Order summary</h2>
            @for (item of cart()!.items; track item.id) {
              <div class="summary-row"><span>{{ item.productTitle }} x {{ item.quantity }}</span><b>Rs {{ item.lineTotal }}</b></div>
            }
            <div class="total"><span>Total</span><strong>Rs {{ cart()!.total }}</strong></div>
          </aside>
        </div>
      } @else {
        <div class="card empty">
          <h2>No items to checkout</h2>
          <a class="btn" routerLink="/products">Browse products</a>
        </div>
      }
    </section>
  `,
  styles: [`.toolbar a{color:#2874f0;font-weight:800;text-decoration:none}.checkout-grid{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:16px}.panel{display:grid;gap:12px}.panel h2,.summary h2{margin:0}.hint{margin:0;color:#64748b;font-size:13px}.payment{display:grid;gap:10px}.payment label{display:flex;gap:10px;align-items:center;font-weight:800}.otp-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.summary{align-self:start;display:grid;gap:12px}.summary-row,.total{display:flex;justify-content:space-between;gap:16px}.summary-row span{color:#64748b}.total{border-top:1px solid #e5e7eb;padding-top:12px}.total strong{font-size:24px;color:#0f766e}.empty{display:grid;gap:12px;justify-items:start}@media(max-width:760px){.checkout-grid{grid-template-columns:1fr}}`]
})
export class CheckoutComponent implements OnInit {
  cart = signal<any | null>(null);
  addresses = signal<any[]>([]);
  placing = signal(false);
  addressId = 0;
  paymentMethod: 'COD' | 'Online' = 'COD';
  otp = '';

  constructor(private cartApi: CartService, private addressApi: AddressService, private orders: OrderService, private toast: ToastService, private router: Router) {}

  ngOnInit() {
    this.cartApi.get().subscribe({
      next: (res: any) => this.cart.set(res.data),
      error: err => this.toast.error('Checkout unavailable', err.error?.message || 'Unable to load cart.')
    });
    this.addressApi.get().subscribe((res: any) => this.addresses.set(res.data ?? []));
  }

  sendOtp() {
    this.orders.confirmationOtp().subscribe({
      next: () => { this.toast.success('OTP sent', 'Check the customer email for order confirmation.'); },
      error: err => this.toast.error('OTP failed', err.error?.message || 'Unable to send order OTP.')
    });
  }

  placeOrder() {
    if (!this.cart()?.items?.length || this.placing()) return;
    this.placing.set(true);
    this.orders.place(Number(this.addressId || 0), this.paymentMethod, this.otp).subscribe({
      next: (res: any) => {
        this.toast.success('Order placed', res.data?.orderNumber || res.message);
        this.router.navigateByUrl('/orders');
      },
      error: err => {
        this.placing.set(false);
        this.toast.error('Order failed', err.error?.message || 'Unable to place order.');
      }
    });
  }
}
