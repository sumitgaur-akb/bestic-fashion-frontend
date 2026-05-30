  import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SellerService } from '../../../core/services/seller.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="onboarding-shell">
      <aside class="progress-panel">
        <p class="eyebrow">Bestic Seller Hub</p>
        <h1>Seller onboarding</h1>
        <p class="lead">Complete business, banking and warehouse details for marketplace approval.</p>
        <div class="steps">
          @for (step of steps; track step.title; let i = $index) {
            <button type="button" class="step" [class.active]="activeStep() === i" [class.done]="activeStep() > i" (click)="goTo(i)">
              <span>{{ i + 1 }}</span>
              <strong>{{ step.title }}</strong>
              <small>{{ step.caption }}</small>
            </button>
          }
        </div>
      </aside>

      <form class="wizard" [formGroup]="form" (ngSubmit)="submit()">
        <header class="wizard-head">
          <div>
            <p class="eyebrow">Status: {{ status() }}</p>
            <h2>{{ steps[activeStep()].title }}</h2>
          </div>
          <div class="actions">
            <button type="button" class="btn secondary" (click)="previous()" [disabled]="activeStep() === 0">Back</button>
            @if (activeStep() < steps.length - 1) {
              <button type="button" class="btn" (click)="next()">Continue</button>
            } @else {
              <button type="submit" class="btn" [disabled]="loading()">{{ loading() ? 'Submitting...' : 'Submit for review' }}</button>
            }
          </div>
        </header>

        @if (activeStep() === 0) {
          <section class="panel" formGroupName="business">
            <div class="section-title"><h3>Business information</h3><p>Use legal details exactly as they appear on GST/PAN records.</p></div>
            <div class="form-grid">
              <label class="field required">Business name<input formControlName="businessName" /></label>
              <label class="field required">Legal business name<input formControlName="legalBusinessName" /></label>
              <label class="field required">Business type
                <select formControlName="businessType">
                  <option value="Individual">Individual</option>
                  <option value="Proprietorship">Proprietorship</option>
                  <option value="Partnership">Partnership</option>
                  <option value="LLP">LLP</option>
                  <option value="PrivateLimited">Private Limited</option>
                </select>
              </label>
              <label class="field">GST number<input formControlName="gstNumber" placeholder="22AAAAA0000A1Z5" /></label>
              <label class="field">PAN number<input formControlName="panNumber" placeholder="ABCDE1234F" /></label>
              <label class="field">CIN number<input formControlName="cinNumber" /></label>
              <label class="field wide required">Business address<textarea rows="4" formControlName="businessAddress"></textarea></label>
              <label class="field required">Pincode<input formControlName="pincode" /></label>
            </div>
            <div class="hint-list"><span>GST/PAN validations run before submission.</span><span>Rejected sellers can resubmit corrections.</span></div>
          </section>
        }

        @if (activeStep() === 1) {
          <section class="panel" formGroupName="bank">
            <div class="section-title"><h3>Bank details</h3><p>Settlement payouts will use these details after admin approval.</p></div>
            <div class="form-grid">
              <label class="field required">Account holder name<input formControlName="accountHolderName" /></label>
              <label class="field required">Bank name<input formControlName="bankName" /></label>
              <label class="field required">Account number<input formControlName="accountNumber" /></label>
              <label class="field required">IFSC code<input formControlName="ifscCode" placeholder="HDFC0123456" /></label>
            </div>
          </section>
        }

        @if (activeStep() === 2) {
          <section class="panel">
            <div class="section-title row">
              <div><h3>Warehouse setup</h3><p>Add every pickup location. Multiple warehouses are supported.</p></div>
              <button type="button" class="btn secondary" (click)="addWarehouse()">Add warehouse</button>
            </div>
            <div formArrayName="warehouses" class="warehouse-list">
              @for (warehouse of warehouses.controls; let i = $index; track i) {
                <div class="warehouse-card" [formGroupName]="i">
                  <div class="warehouse-head"><strong>Warehouse {{ i + 1 }}</strong><button type="button" (click)="removeWarehouse(i)" [disabled]="warehouses.length === 1">Remove</button></div>
                  <div class="form-grid compact">
                    <label class="field required">Warehouse name<input formControlName="name" /></label>
                    <label class="field required">Contact person<input formControlName="contactPerson" /></label>
                    <label class="field required">Contact number<input formControlName="contactNumber" /></label>
                    <label class="field required">Pincode<input formControlName="pincode" /></label>
                    <label class="field wide required">Warehouse address<textarea rows="3" formControlName="address"></textarea></label>
                  </div>
                </div>
              }
            </div>
          </section>
        }

        @if (activeStep() === 3) {
          <section class="panel review">
            <div class="section-title"><h3>Review and submit</h3><p>Admin can approve, reject, or request corrections.</p></div>
            <div class="review-grid">
              <div><span>Business</span><strong>{{ form.value.business?.businessName || '-' }}</strong></div>
              <div><span>Legal name</span><strong>{{ form.value.business?.legalBusinessName || '-' }}</strong></div>
              <div><span>Warehouses</span><strong>{{ warehouses.length }}</strong></div>
              <div><span>Bank</span><strong>{{ form.value.bank?.bankName || '-' }}</strong></div>
              <div><span>IFSC</span><strong>{{ form.value.bank?.ifscCode || '-' }}</strong></div>
            </div>
            <div class="submit-note">By submitting, this seller profile moves to Under Review and becomes visible in Admin Seller Management.</div>
          </section>
        }
      </form>
    </section>
  `,
  styles: [`
    .onboarding-shell{min-height:calc(100vh - 64px);display:grid;grid-template-columns:320px 1fr;background:#f4f7fb;color:#172337}
    .progress-panel{background:#101827;color:#fff;padding:28px;position:sticky;top:0;height:calc(100vh - 64px)}
    .eyebrow{margin:0 0 8px;text-transform:uppercase;font-size:12px;font-weight:900;color:#f5b82e;letter-spacing:0}
    h1,h2,h3{margin:0}.lead{color:#cbd5e1;line-height:1.55}
    .steps{display:grid;gap:10px;margin-top:24px}.step{display:grid;grid-template-columns:34px 1fr;gap:2px 12px;text-align:left;background:#ffffff10;color:#dbeafe;border:1px solid #ffffff1f;border-radius:7px;padding:12px;cursor:pointer}
    .step span{grid-row:1/3;width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:#1f2937;font-weight:900}.step small{color:#94a3b8}.step.active{background:#2563eb;border-color:#60a5fa}.step.done span{background:#16a34a}
    .wizard{padding:24px;display:grid;gap:18px}.wizard-head{display:flex;align-items:center;justify-content:space-between;gap:16px;background:#fff;border:1px solid #e6edf5;border-radius:8px;padding:18px}.actions{display:flex;gap:10px}
    .panel{background:#fff;border:1px solid #e6edf5;border-radius:8px;padding:20px;box-shadow:0 14px 32px #0f172a0b}.section-title{margin-bottom:18px}.section-title p{margin:6px 0 0;color:#64748b}.section-title.row{display:flex;align-items:center;justify-content:space-between;gap:14px}
    .form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.form-grid.compact{grid-template-columns:repeat(4,minmax(0,1fr))}.field{display:grid;gap:7px;font-weight:800;color:#334155}.field.wide{grid-column:1/-1}.field input,.field select,.field textarea{width:100%;padding:12px;border:1px solid #cbd5e1;border-radius:6px;background:#fbfdff;font:inherit}.field input.ng-invalid.ng-touched,.field textarea.ng-invalid.ng-touched,.field select.ng-invalid.ng-touched{border-color:#dc2626;background:#fff7f7}.required::after{content:' *';color:#dc2626}
    .hint-list{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}.hint-list span,.submit-note{background:#ecfdf5;color:#166534;border:1px solid #bbf7d0;border-radius:6px;padding:10px;font-weight:800}
    .warehouse-list{display:grid;gap:14px}.warehouse-card{border:1px solid #e2e8f0;border-radius:8px;padding:14px;background:#f8fafc}.warehouse-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}.warehouse-head button{border:0;background:transparent;color:#dc2626;font-weight:900;cursor:pointer}
    .review-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-bottom:16px}.review-grid div{border:1px solid #e2e8f0;border-radius:8px;padding:14px;background:#f8fafc}.review-grid span{display:block;color:#64748b;font-size:12px;text-transform:uppercase;font-weight:900}.review-grid strong{display:block;margin-top:6px}
    @media(max-width:900px){.onboarding-shell{grid-template-columns:1fr}.progress-panel{position:relative;height:auto}.form-grid,.form-grid.compact{grid-template-columns:1fr}.wizard-head,.section-title.row{align-items:stretch;flex-direction:column}.actions{justify-content:flex-end}}
  `]
})
export class SellerOnboardingComponent implements OnInit {
  steps = [
    { title: 'Business information', caption: 'GST, PAN and address' },
    { title: 'Bank details', caption: 'Settlement account' },
    { title: 'Warehouses', caption: 'Pickup locations' },
    { title: 'Review', caption: 'Submit to admin' }
  ];
  activeStep = signal(0);
  loading = signal(false);
  status = signal('Draft');

  form = this.fb.nonNullable.group({
    business: this.fb.nonNullable.group({
      businessName: ['', [Validators.required, Validators.minLength(3)]],
      legalBusinessName: ['', [Validators.required, Validators.minLength(3)]],
      businessType: ['Individual', Validators.required],
      gstNumber: ['', Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/)],
      panNumber: ['', Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)],
      cinNumber: [''],
      businessAddress: ['', [Validators.required, Validators.minLength(10)]],
      pincode: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)]]
    }),
    bank: this.fb.nonNullable.group({
      accountHolderName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-z ]+$/)]],
      bankName: ['', Validators.required],
      accountNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{9,18}$/)]],
      ifscCode: ['', [Validators.required, Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]]
    }),
    warehouses: this.fb.array([this.createWarehouse()])
  });

  constructor(private fb: FormBuilder, private seller: SellerService, private toast: ToastService, private router: Router, private auth: AuthService) {}

  get warehouses() { return this.form.controls.warehouses as FormArray; }

  ngOnInit() {
    this.seller.onboarding().subscribe({
      next: (res: any) => {
        const data = res.data;
        if (!data) return;
        this.status.set(data.status ?? 'Draft');
        if (data.business) this.form.controls.business.patchValue(data.business);
        if (data.bank) this.form.controls.bank.patchValue({ accountHolderName: data.bank.accountHolderName, bankName: data.bank.bankName, ifscCode: data.bank.ifscCode });
        if (data.warehouses?.length) {
          this.warehouses.clear();
          data.warehouses.forEach((w: any) => this.warehouses.push(this.createWarehouse(w)));
        }
      }
    });
  }

  createWarehouse(value?: any) {
    return this.fb.nonNullable.group({
      name: [value?.name ?? '', Validators.required],
      address: [value?.address ?? '', [Validators.required, Validators.minLength(10)]],
      contactPerson: [value?.contactPerson ?? '', Validators.required],
      contactNumber: [value?.contactNumber ?? '', [Validators.required, Validators.pattern(/^[6-9][0-9]{9}$/)]],
      pincode: [value?.pincode ?? '', [Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)]]
    });
  }

  addWarehouse() { this.warehouses.push(this.createWarehouse()); }
  removeWarehouse(index: number) { if (this.warehouses.length > 1) this.warehouses.removeAt(index); }
  previous() { this.activeStep.update(x => Math.max(0, x - 1)); }
  goTo(index: number) { if (index <= this.activeStep()) this.activeStep.set(index); }

  next() {
    const group = this.currentGroup();
    group?.markAllAsTouched();
    if (group?.invalid) {
      this.toast.error('Step incomplete', 'Please complete required fields before continuing.');
      return;
    }
    this.activeStep.update(x => Math.min(this.steps.length - 1, x + 1));
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.toast.error('Onboarding incomplete', 'Complete all required fields.');
      return;
    }
    const raw = this.form.getRawValue();
    const payload = {
      business: raw.business,
      bank: raw.bank,
      warehouses: raw.warehouses,
      documents: []
    };
    this.loading.set(true);
    this.seller.submitOnboarding(payload).subscribe({
      next: (res: any) => {
        this.loading.set(false);
        this.toast.success('Submitted for review', res.message || 'Admin approval is pending.');
        this.auth.logout();
        this.router.navigateByUrl('/seller/login');
      },
      error: err => {
        this.loading.set(false);
        this.toast.error('Submission failed', this.errorMessage(err));
      }
    });
  }

  private currentGroup(): AbstractControl | null {
    if (this.activeStep() === 0) return this.form.controls.business;
    if (this.activeStep() === 1) return this.form.controls.bank;
    if (this.activeStep() === 2) return this.form.controls.warehouses;
    return null;
  }

  private errorMessage(err: any): string {
    const body = err?.error;
    if (Array.isArray(body?.errors)) return body.errors[0] || body.message || 'Please review all details.';
    if (body?.errors && typeof body.errors === 'object') {
      const first = Object.values(body.errors).flat().find(Boolean);
      if (first) return String(first);
    }
    return body?.message || body?.title || err?.message || 'Please review all details.';
  }
}
