import { DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { ToastService } from '../../../core/services/toast.service';
import { SellerSidebarComponent } from '../../../shared/components/seller-sidebar/seller-sidebar.component';

@Component({
  standalone: true,
  imports: [DatePipe, FormsModule, SellerSidebarComponent],
  template: `
    <section class="seller-layout">
      <app-seller-sidebar />
      <div class="seller-content">
        <div class="seller-hero"><p>Fulfilment</p><h1>Seller Orders</h1></div>
        <table class="table">
          <tr><th>Order</th><th>Date</th><th>Total</th><th>Status</th><th>Process</th></tr>
          @for (order of orders(); track order.id) {
            <tr>
              <td>{{ order.orderNumber }}</td>
              <td>{{ order.createdAt | date:'medium' }}</td>
              <td>Rs {{ order.totalAmount }}</td>
              <td>{{ order.orderStatus }}</td>
              <td>
                <select [(ngModel)]="status[order.id]">
                  <option value="Confirmed">Confirmed</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <button class="btn" type="button" (click)="update(order.id)">Update</button>
              </td>
            </tr>
          }
        </table>
      </div>
    </section>
  `,
  styles: [`.seller-hero{margin-bottom:18px;background:linear-gradient(135deg,#102a61,#2874f0 58%,#1b9aaa);color:#fff;padding:22px;border-radius:8px}.seller-hero p{margin:0 0 4px;color:#ffd34d;font-weight:900;text-transform:uppercase;font-size:12px}.seller-hero h1{margin:0}td:last-child{display:flex;gap:8px;align-items:center}select{padding:9px;border:1px solid #cbd5e1;border-radius:4px}@media(max-width:760px){td:last-child{flex-direction:column;align-items:start}}`]
})
export class SellerOrdersComponent implements OnInit {
  orders = signal<any[]>([]);
  status: Record<number, string> = {};
  constructor(private orderApi: OrderService, private toast: ToastService) {}
  ngOnInit() { this.load(); }
  load() { this.orderApi.sellerOrders().subscribe({ next: (res: any) => this.orders.set(res.data ?? []), error: err => this.toast.error('Orders unavailable', err.error?.message || 'Unable to load seller orders.') }); }
  update(orderId: number) {
    this.orderApi.updateStatus(orderId, this.status[orderId] || 'Packed').subscribe({
      next: (res: any) => { this.toast.success('Customer updated', res.message); this.load(); },
      error: err => this.toast.error('Status failed', err.error?.message || 'Try again.')
    });
  }
}
