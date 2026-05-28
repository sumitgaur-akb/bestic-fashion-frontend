import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AddressService {
  constructor(private api: ApiService) {}
  get() { return this.api.get('/addresses'); }
  add(payload: unknown) { return this.api.post('/addresses', payload); }
}
