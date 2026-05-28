import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({ standalone: true, imports: [FormsModule], template: `<section class="page card auth"><h1>Seller OTP</h1><label class="field">Email<input [(ngModel)]="destination" /></label><label class="field">OTP<input [(ngModel)]="otp" /></label><button class="btn" (click)="verify()">Verify</button></section>` })
export class SellerOtpComponent {
  destination = '';
  otp = '';
  constructor(private auth: AuthService, private router: Router, private toast: ToastService) {}
  verify() {
    if (!this.destination || !this.otp) { this.toast.error('OTP missing', 'Enter seller email and OTP.'); return; }
    this.auth.verifyOtp({ destination: this.destination, otp: this.otp, purpose: 'SellerLogin' }).subscribe({
      next: res => { this.toast.success('Seller verified', res.message); this.router.navigateByUrl('/seller/onboarding'); },
      error: err => this.toast.error('Wrong OTP', err.error?.message || 'OTP is invalid or expired.')
    });
  }
}
