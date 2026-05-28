import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class SellerDashboardService {
  constructor(private api: ApiService) {}
  summary() { return this.api.get('/sellerdashboard/summary'); }
  revenue() { return this.api.get('/sellerdashboard/revenue'); }
  recentOrders() { return this.api.get('/sellerdashboard/recent-orders'); }
  lowStock() { return this.api.get('/sellerdashboard/low-stock'); }
}
