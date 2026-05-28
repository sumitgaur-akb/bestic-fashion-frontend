import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class SellerService {
  constructor(private api: ApiService) {}
  submitOnboarding(payload: unknown) { return this.api.post('/sellers/onboarding', payload); }
  adminSellerSummary() { return this.api.get('/adminsellers/summary'); }
  adminSellers() { return this.api.get('/adminsellers'); }
  reviewSeller(sellerId: number, approved: boolean, notes?: string) {
    return this.api.post(`/adminsellers/${sellerId}/review`, { approved, notes });
  }
}
