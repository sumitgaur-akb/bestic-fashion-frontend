import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SellerService } from '../../../core/services/seller.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="page onboarding">
      <div class="onboarding-hero">
        <p>Seller verification</p>
        <h1>Complete your business profile for admin approval.</h1>
      </div>

      <form class="card" [formGroup]="form" (ngSubmit)="submit()">
        <h2>Business Details</h2>
        <div class="grid">
          <label class="field required">Business name<input formControlName="businessName" /></label>
          @if (showError(form.controls.businessName)) { <small>Business name is required, minimum 3 characters.</small> }
          <label class="field">GST number<input formControlName="gstNumber" placeholder="22AAAAA0000A1Z5" /></label>
          @if (showError(form.controls.gstNumber)) { <small>Enter valid GST format.</small> }
          <label class="field">PAN number<input formControlName="panNumber" placeholder="ABCDE1234F" /></label>
          @if (showError(form.controls.panNumber)) { <small>Enter valid PAN format.</small> }
          <label class="field required">Pickup address<textarea rows="3" formControlName="pickupAddress"></textarea></label>
          @if (showError(form.controls.pickupAddress)) { <small>Pickup address is required, minimum 10 characters.</small> }
        </div>

        <h2>Bank Details</h2>
        <div class="grid">
          <label class="field required">Account holder<input formControlName="accountHolderName" /></label>
          @if (showError(form.controls.accountHolderName)) { <small>Account holder name is required.</small> }
          <label class="field required">Bank name<input formControlName="bankName" /></label>
          @if (showError(form.controls.bankName)) { <small>Bank name is required.</small> }
          <label class="field required">Account number<input formControlName="accountNumberMasked" placeholder="123456789012" /></label>
          @if (showError(form.controls.accountNumberMasked)) { <small>Enter valid 9-18 digit account number.</small> }
          <label class="field required">IFSC code<input formControlName="ifscCode" placeholder="HDFC0001234" /></label>
          @if (showError(form.controls.ifscCode)) { <small>Enter valid IFSC code.</small> }
        </div>
        <button class="btn" [disabled]="loading">{{ loading ? 'Submitting...' : 'Submit KYC' }}</button>
      </form>
    </section>
  `,
  styles: [`.onboarding-hero{background:linear-gradient(135deg,#102a61,#2874f0 58%,#1b9aaa);color:#fff;border-radius:8px;padding:26px;margin-bottom:16px}.onboarding-hero p{margin:0 0 8px;color:#ffd34d;text-transform:uppercase;font-size:12px;font-weight:900}.onboarding-hero h1{margin:0;max-width:760px}.card h2{margin:8px 0 14px}.required::after{content:' *';color:#dc2626;font-weight:900}small{display:block;color:#dc2626;margin:-6px 0 10px;font-weight:700}.btn[disabled]{opacity:.65;cursor:not-allowed}`]
})
export class SellerOnboardingComponent {
  loading = false;
  form = this.fb.nonNullable.group({
    businessName: ['', [Validators.required, Validators.minLength(3)]],
    gstNumber: ['', Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/)],
    panNumber: ['', Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)],
    pickupAddress: ['', [Validators.required, Validators.minLength(10)]],
    bankName: ['', Validators.required],
    accountHolderName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-z ]+$/)]],
    accountNumberMasked: ['', [Validators.required, Validators.pattern(/^[0-9]{9,18}$/)]],
    ifscCode: ['', [Validators.required, Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]]
  });

  constructor(private fb: FormBuilder, private seller: SellerService, private toast: ToastService, private router: Router, private auth: AuthService) {}

  showError(control: AbstractControl) {
    return control.invalid && (control.dirty || control.touched);
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.toast.error('KYC incomplete', 'Please correct all highlighted fields.');
      return;
    }
    this.loading = true;
    this.seller.submitOnboarding(this.form.getRawValue()).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.toast.success('KYC submitted', res.message || 'Admin approval is pending.');
        this.auth.logout();
        this.router.navigateByUrl('/seller/login');
      },
      error: err => {
        this.loading = false;
        this.toast.error('KYC failed', err.error?.message || 'Please check the entered details.');
      }
    });
  }
}
