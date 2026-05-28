import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { ToastService } from '../../../core/services/toast.service';
import { SellerSidebarComponent } from '../../../shared/components/seller-sidebar/seller-sidebar.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, SellerSidebarComponent],
  template: `
    <section class="seller-layout">
      <app-seller-sidebar />
      <form class="seller-content product-form" [formGroup]="form" (ngSubmit)="save()">
        <div class="form-hero"><p>QC ready listing</p><h1>{{ productId ? 'Correct product details' : 'Add product' }}</h1></div>
        <div class="form-grid">
          <div class="card fields">
            <label class="field">Title<input formControlName="title" /></label>
            <label class="field">Brand<input formControlName="brand" /></label>
            <label class="field">Description<textarea rows="5" formControlName="description"></textarea></label>
            <label class="field">Product image URL<input formControlName="imageUrl" /></label>
          </div>
          <div class="card fields">
            <label class="field">Base price<input type="number" formControlName="basePrice" /></label>
            <label class="field">Discount price<input type="number" formControlName="discountPrice" /></label>
            <label class="field">SKU<input formControlName="sku" /></label>
            <label class="field">Color<input formControlName="color" /></label>
            <label class="field">Size<input formControlName="size" /></label>
            <label class="field">Stock<input type="number" formControlName="stock" /></label>
            <button class="btn" type="submit">{{ productId ? 'Correct & resend QC' : 'Save and send QC' }}</button>
          </div>
        </div>
      </form>
    </section>
  `,
  styles: [`.form-hero{background:linear-gradient(135deg,#102a61,#2874f0 58%,#1b9aaa);color:#fff;border-radius:8px;padding:24px;margin-bottom:16px}.form-hero p{margin:0 0 6px;color:#ffd34d;text-transform:uppercase;font-weight:900;font-size:12px}.form-hero h1{margin:0}.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.fields{display:grid;gap:10px}.btn{margin-top:8px}@media(max-width:760px){.form-grid{grid-template-columns:1fr}}`]
})
export class SellerProductFormComponent implements OnInit {
  productId = Number(this.route.snapshot.paramMap.get('id')) || 0;
  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    brand: [''],
    description: ['', Validators.required],
    imageUrl: ['/assets/demo-phone.jpg', Validators.required],
    basePrice: [999, Validators.required],
    discountPrice: [899],
    sku: [`SKU-${Date.now()}`, Validators.required],
    color: ['Black'],
    size: ['Standard'],
    stock: [10, Validators.required]
  });

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private products: ProductService, private toast: ToastService) {}

  ngOnInit() {
    if (!this.productId) return;
    this.products.getById(this.productId).subscribe((res: any) => {
      const product = res.data;
      const variant = product.variants?.[0] ?? {};
      this.form.patchValue({
        title: product.title,
        brand: product.brand,
        description: product.description,
        imageUrl: product.images?.[0]?.imageUrl || '/assets/demo-phone.jpg',
        basePrice: product.price,
        discountPrice: product.discountPrice,
        sku: variant.sku,
        color: variant.color,
        size: variant.size,
        stock: variant.stock
      });
    });
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) { this.toast.error('Product incomplete', 'Fill required listing details.'); return; }
    const value = this.form.getRawValue();
    const payload = {
      categoryId: 1,
      subCategoryId: 1,
      title: value.title,
      description: value.description,
      brand: value.brand,
      basePrice: Number(value.basePrice),
      discountPrice: Number(value.discountPrice),
      imageUrl: value.imageUrl,
      variants: [{ sku: value.sku, color: value.color, size: value.size, price: Number(value.discountPrice || value.basePrice), stock: Number(value.stock), lowStockThreshold: 2 }]
    };
    const request = this.productId ? this.products.updateProduct(this.productId, payload) : this.products.addProduct(payload);
    request.subscribe({
      next: (res: any) => { this.toast.success('Product sent to QC', res.message); this.router.navigateByUrl('/seller/products'); },
      error: err => this.toast.error('Product save failed', err.error?.message || 'Try again.')
    });
  }
}
