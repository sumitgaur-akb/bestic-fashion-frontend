import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressService } from '../../../core/services/address.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="page address-page">
      <div class="address-hero"><p>Delivery profile</p><h1>Addresses</h1></div>
      <div class="address-grid">
        <form class="card fields" [formGroup]="form" (ngSubmit)="save()">
          <label class="field">Full name<input formControlName="fullName" /></label>
          <label class="field">Phone<input formControlName="phone" /></label>
          <label class="field">Address line<input formControlName="line1" /></label>
          <label class="field">Landmark<input formControlName="line2" /></label>
          <label class="field">City<input formControlName="city" /></label>
          <label class="field">State<input formControlName="state" /></label>
          <label class="field">Postal code<input formControlName="postalCode" /></label>
          <label class="check"><input type="checkbox" formControlName="isDefault" /> Use as default delivery address</label>
          <button class="btn" type="submit">Save address</button>
        </form>
        <div class="saved">
          @for (address of addresses(); track address.id) {
            <article class="card address-card">
              <b>#{{ address.id }} {{ address.isDefault ? 'Default' : '' }}</b>
              <h2>{{ address.fullName }}</h2>
              <p>{{ address.line1 }} {{ address.line2 || '' }}, {{ address.city }}, {{ address.state }} - {{ address.postalCode }}</p>
              <span>{{ address.phone }}</span>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`.address-hero{background:linear-gradient(135deg,#102a61,#2874f0 58%,#1b9aaa);color:#fff;border-radius:8px;padding:24px;margin-bottom:16px}.address-hero p{margin:0 0 6px;color:#ffd34d;text-transform:uppercase;font-weight:900;font-size:12px}.address-hero h1{margin:0}.address-grid{display:grid;grid-template-columns:420px 1fr;gap:16px}.fields{display:grid;gap:10px}.check{display:flex;gap:10px;align-items:center;font-weight:800}.saved{display:grid;gap:12px;align-content:start}.address-card b{color:#0f766e}.address-card h2{margin:8px 0}.address-card p{color:#64748b;line-height:1.5}@media(max-width:860px){.address-grid{grid-template-columns:1fr}}`]
})
export class AddressesComponent implements OnInit {
  addresses = signal<any[]>([]);
  form = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    phone: ['', Validators.required],
    line1: ['', Validators.required],
    line2: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    postalCode: ['', Validators.required],
    isDefault: [true]
  });

  constructor(private fb: FormBuilder, private addressApi: AddressService, private toast: ToastService) {}
  ngOnInit() { this.load(); }
  load() { this.addressApi.get().subscribe((res: any) => this.addresses.set(res.data ?? [])); }
  save() {
    if (this.form.invalid) { this.toast.error('Address incomplete', 'Fill the delivery address.'); return; }
    this.addressApi.add(this.form.getRawValue()).subscribe({
      next: (res: any) => { this.toast.success('Address saved', res.message); this.form.reset({ isDefault: true }); this.load(); },
      error: err => this.toast.error('Address failed', err.error?.message || 'Try again.')
    });
  }
}
