import { Component, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="page seller-auth">
      <div class="seller-auth-hero"><p>Bestic Seller Hub</p><h1>Grow your business with a focused seller dashboard.</h1></div>
      <div class="seller-auth-grid">
        <form class="card" [formGroup]="loginForm" (ngSubmit)="login()">
          <h2>Seller Login</h2>
          <label class="field required">Email or mobile<input formControlName="emailOrMobile" /></label>
          @if (showError(loginForm.controls.emailOrMobile)) { <small>Email/mobile is required.</small> }
          <label class="field required">Password<input type="password" formControlName="password" /></label>
          @if (showError(loginForm.controls.password)) { <small>Password is required.</small> }
          <button class="btn" type="submit">Login as Seller</button>
        </form>

        <form class="card" [formGroup]="registerForm" (ngSubmit)="register()">
          <h2>Register Store</h2>
          <label class="field required">Owner name<input formControlName="fullName" /></label>
          @if (showError(registerForm.controls.fullName)) { <small>Enter at least 3 characters.</small> }

          <label class="field required">Store name<input formControlName="storeName" /></label>
          @if (showError(registerForm.controls.storeName)) { <small>Store name must be at least 3 characters.</small> }

          <label class="field required">Email<input formControlName="email" (input)="emailVerified.set(false)" /></label>
          @if (showError(registerForm.controls.email)) { <small>Enter a valid email address.</small> }

          <div class="otp-row">
            <button class="btn secondary" type="button" (click)="sendEmailOtp()" [disabled]="registerForm.controls.email.invalid">Send Email OTP</button>
            @if (devOtp()) { <span class="dev-otp">Dev OTP: {{ devOtp() }}</span> }
          </div>

          <label class="field required">Email OTP<input formControlName="emailOtp" maxlength="6" /></label>
          @if (showError(registerForm.controls.emailOtp)) { <small>Enter 6 digit OTP.</small> }
          <button class="btn secondary" type="button" (click)="verifyEmailOtp()" [disabled]="registerForm.controls.email.invalid || registerForm.controls.emailOtp.invalid">Verify OTP</button>
          @if (emailVerified()) { <p class="verified">Email verified. Registration is unlocked.</p> }

          <label class="field required">Mobile<input formControlName="mobile" maxlength="10" /></label>
          @if (showError(registerForm.controls.mobile)) { <small>Enter valid 10 digit mobile number starting with 6-9.</small> }

          <label class="field required">Password<input type="password" formControlName="password" /></label>
          @if (showError(registerForm.controls.password)) { <small>Password needs 8+ chars, uppercase, lowercase, number and special character.</small> }

          <button class="btn" type="submit" [disabled]="!emailVerified()">Register seller</button>
        </form>
      </div>
    </section>
  `,
  styles: [`.seller-auth-hero{background:linear-gradient(90deg,#071b45 0%,#163b8f 55%,#1b9aaa);color:#fff;border-radius:8px;padding:28px;margin-bottom:16px}.seller-auth-hero p{margin:0 0 8px;color:#ffd34d;font-weight:900;text-transform:uppercase;font-size:12px}.seller-auth-hero h1{max-width:760px;margin:0;font-size:clamp(28px,4vw,44px);line-height:1.08}.seller-auth-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.card h2{margin-top:0}.required::after{content:' *';color:#dc2626;font-weight:900}small{display:block;color:#dc2626;margin:-6px 0 10px;font-weight:700}.otp-row{display:flex;align-items:center;gap:10px;margin-bottom:10px}.dev-otp{font-size:12px;color:#0f766e;font-weight:900}.verified{color:#0f766e;font-weight:900;margin:10px 0}.btn[disabled]{opacity:.55;cursor:not-allowed}@media(max-width:760px){.seller-auth-grid{grid-template-columns:1fr}.otp-row{align-items:stretch;flex-direction:column}}`]
})
export class SellerAuthComponent {
  emailVerified = signal(false);
  devOtp = signal<string | null>(null);

  loginForm = this.fb.nonNullable.group({
    emailOrMobile: ['', Validators.required],
    password: ['', Validators.required]
  });

  registerForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-z ]+$/)]],
    storeName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    emailOtp: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
    mobile: ['', [Validators.required, Validators.pattern(/^[6-9][0-9]{9}$/)]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/)]]
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private toast: ToastService) {}

  showError(control: AbstractControl) {
    return control.invalid && (control.dirty || control.touched);
  }

  sendEmailOtp() {
    const email = this.registerForm.controls.email.value;
    if (this.registerForm.controls.email.invalid) {
      this.toast.error('Invalid email', 'Please enter a valid email before sending OTP.');
      return;
    }
    this.auth.sendOtp({ destination: email, purpose: 'Registration' }).subscribe({
      next: (res: any) => {
        this.devOtp.set(/^[0-9]{6}$/.test(res.data) ? res.data : null);
        this.toast.success('OTP sent', `Verification OTP sent to ${email}.`);
      },
      error: err => this.toast.error('OTP failed', err.error?.message || 'Unable to send OTP.')
    });
  }

  verifyEmailOtp() {
    const email = this.registerForm.controls.email.value;
    const otp = this.registerForm.controls.emailOtp.value;
    if (this.registerForm.controls.email.invalid || this.registerForm.controls.emailOtp.invalid) {
      this.toast.error('OTP invalid', 'Enter valid email and 6 digit OTP.');
      return;
    }
    this.auth.verifyRegistrationOtp({ destination: email, otp, purpose: 'Registration' }).subscribe({
      next: res => { this.emailVerified.set(true); this.toast.success('Email verified', res.message); },
      error: err => { this.emailVerified.set(false); this.toast.error('Wrong OTP', err.error?.message || 'OTP is invalid or expired.'); }
    });
  }

  login() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) { this.toast.error('Login details missing', 'Email/mobile and password are required.'); return; }
    this.auth.login(this.loginForm.getRawValue()).subscribe({
      next: res => {
        if (!res.data.roles.includes('Seller')) {
          this.auth.logout();
          this.toast.error('Seller account not found', 'Please register as a seller first.');
          this.router.navigateByUrl('/seller/login');
          return;
        }
        if (res.data.sellerStatus === 'Approved') {
          this.toast.success('Seller login successful', res.message);
          this.router.navigateByUrl('/seller/dashboard');
          return;
        }
        this.toast.info('Approval pending', 'Your KYC is pending with admin. You will receive an email after approval.');
        this.router.navigateByUrl(res.data.sellerStatus === 'PendingKyc' ? '/seller/onboarding' : '/seller/pending');
      },
      error: err => this.toast.error('Seller login failed', err.error?.message || 'Please check your credentials.')
    });
  }

  register() {
    this.registerForm.markAllAsTouched();
    if (!this.emailVerified()) { this.toast.error('Email not verified', 'Verify email OTP before seller registration.'); return; }
    if (this.registerForm.invalid) { this.toast.error('Seller registration incomplete', 'Please correct all highlighted fields.'); return; }
    const { emailOtp, ...payload } = this.registerForm.getRawValue();
    this.auth.registerSeller(payload).subscribe({
      next: res => { this.toast.success('Seller registered', res.message); this.router.navigateByUrl('/seller/onboarding'); },
      error: err => this.toast.error('Seller registration failed', err.error?.message || 'Please try again.')
    });
  }
}
