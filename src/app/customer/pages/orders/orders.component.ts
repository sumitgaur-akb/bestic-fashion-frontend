import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  standalone: true,
  imports: [DatePipe, RouterLink],
  template: `
    <section class="page">
      <div class="toolbar"><h1>My Orders</h1><a class="btn secondary" routerLink="/products">Continue shopping</a></div>
      @if (orders().length) {
        <table class="table">
          <tr><th>Order</th><th>Status</th><th>Payment</th><th>Total</th><th>Date</th></tr>
          @for (order of orders(); track order.id) {
            <tr>
              <td>{{ order.orderNumber }}</td>
              <td>{{ order.orderStatus }}</td>
              <td>{{ order.paymentStatus }}</td>
              <td>Rs {{ order.totalAmount }}</td>
              <td>{{ order.createdAt | date:'medium' }}</td>
            </tr>
          }
        </table>
      } @else {
        <div class="card empty"><h2>No orders yet</h2><p>Your placed orders will show here.</p></div>
      }
    </section>
  `
})
export class OrdersComponent implements OnInit {
  orders = signal<any[]>([]);

  constructor(private orderApi: OrderService, private toast: ToastService) {}

  ngOnInit() {
    this.orderApi.customerOrders().subscribe({
      next: (res: any) => this.orders.set(res.data ?? []),
      error: err => this.toast.error('Orders unavailable', err.error?.message || 'Unable to load orders.')
    });
  }
}
