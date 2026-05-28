import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  constructor(private api: ApiService) {}
  get() { return this.api.get('/cart'); }
  add(productVariantId: number, quantity = 1) { return this.api.post('/cart', { productVariantId, quantity }); }
  update(productVariantId: number, quantity: number) { return this.api.put('/cart', { productVariantId, quantity }); }
  remove(itemId: number) { return this.api.delete(`/cart/${itemId}`); }
}
