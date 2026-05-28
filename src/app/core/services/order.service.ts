import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private api: ApiService) {}
  confirmationOtp() { return this.api.post('/orders/confirmation-otp', {}); }
  place(addressId: number, paymentMethod: 'COD' | 'Online', otp?: string) { return this.api.post('/orders', { addressId, paymentMethod, otp }); }
  customerOrders() { return this.api.get('/orders/customer'); }
  sellerOrders() { return this.api.get('/orders/seller'); }
  updateStatus(orderId: number, status: string, orderItemId?: number) { return this.api.put(`/orders/${orderId}/status`, { status, orderItemId }); }
  cancel(orderId: number) { return this.api.post(`/orders/${orderId}/cancel`, {}); }
}
