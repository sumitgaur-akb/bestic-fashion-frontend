import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private api: ApiService) {}
  search(query: Record<string, string | number | boolean | undefined>) { return this.api.get('/products', query); }
  getById(id: number) { return this.api.get(`/products/${id}`); }
  sellerProducts() { return this.api.get('/products/seller'); }
  qcProducts() { return this.api.get('/products/qc'); }
  addProduct(payload: unknown) { return this.api.post('/products', payload); }
  updateProduct(id: number, payload: unknown) { return this.api.put(`/products/${id}`, payload); }
  submitQc(id: number) { return this.api.post(`/products/${id}/submit-qc`, {}); }
  reviewQc(id: number, payload: unknown) { return this.api.post(`/products/${id}/qc`, payload); }
  updateStock(payload: unknown) { return this.api.put('/products/stock', payload); }
}
