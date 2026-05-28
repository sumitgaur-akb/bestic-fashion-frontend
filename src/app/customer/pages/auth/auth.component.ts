import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="page auth-wrap">
      <div class="auth-panel">
        <div class="auth-copy"><p>Welcome back</p><h1>Login / Register</h1><span>Track orders, save addresses and shop faster.</span></div>
        <form class="card" [formGroup]="loginForm" (ngSubmit)="login()">
          <h2>Login</h2>
          <label class="field">Email or mobile<input formControlName="emailOrMobile" /></label>
          <label class="field">Password<input type="password" formControlName="password" /></label>
          <button class="btn">Login</button>
        </form>
        <form class="card" [formGroup]="registerForm" (ngSubmit)="register()">
          <h2>Create Account</h2>
          <label class="field">Full name<input formControlName="fullName" /></label>
          <label class="field">Email<input formControlName="email" /></label>
          <label class="field">Mobile<input formControlName="mobile" /></label>
          <label class="field">Password<input type="password" formControlName="password" /></label>
          <button class="btn secondary">Create customer account</button>
        </form>
      </div>
    </section>
  `,
  styles: [`.auth-wrap{display:flex;justify-content:center}.auth-panel{width:min(980px,100%);display:grid;grid-template-columns:1fr 1fr;gap:16px}.auth-copy{grid-column:1/-1;background:linear-gradient(135deg,#102a61,#2874f0 65%,#1b9aaa);color:#fff;padding:24px;border-radius:8px}.auth-copy p{margin:0 0 6px;color:#ffd34d;font-weight:900;text-transform:uppercase;font-size:12px}.auth-copy h1{margin:0 0 6px}.auth-copy span{color:#e0f2fe}.card h2{margin-top:0}@media(max-width:760px){.auth-panel{grid-template-columns:1fr}}`]
})
export class AuthComponent {
  loginForm = this.fb.nonNullable.group({ emailOrMobile: ['', Validators.required], password: ['', Validators.required] });
  registerForm = this.fb.nonNullable.group({ fullName: ['', Validators.required], email: ['', Validators.required], mobile: [''], password: ['', Validators.required] });
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private toast: ToastService) {}
  login() {
    if (this.loginForm.invalid) { this.toast.error('Login details missing', 'Email/mobile and password are required.'); return; }
    this.auth.login(this.loginForm.getRawValue()).subscribe({
      next: res => {
        if (!res.data.roles.includes('Customer')) {
          this.auth.logout();
          this.toast.error('Customer account not found', 'Please login with a customer account.');
          this.router.navigateByUrl('/login');
          return;
        }
        this.toast.success('Login successful', res.message);
        this.router.navigateByUrl('/');
      },
      error: err => this.toast.error('Login failed', err.error?.message || 'Please check your login id and password.')
    });
  }
  register() {
    if (this.registerForm.invalid) { this.toast.error('Registration incomplete', 'Please fill required fields.'); return; }
    this.auth.registerCustomer(this.registerForm.getRawValue()).subscribe({
      next: res => { this.toast.success('Account created', res.message); this.router.navigateByUrl('/otp'); },
      error: err => this.toast.error('Registration failed', err.error?.message || 'Please try again.')
    });
  }
}
