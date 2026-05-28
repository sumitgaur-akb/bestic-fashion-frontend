import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({ standalone: true, imports: [FormsModule], template: `<section class="page card auth"><h1>OTP Verification</h1><label class="field">Destination<input [(ngModel)]="destination" /></label><label class="field">OTP<input [(ngModel)]="otp" /></label><button class="btn" (click)="verify()">Verify OTP</button></section>` })
export class OtpComponent {
  destination = '';
  otp = '';
  constructor(private auth: AuthService, private toast: ToastService) {}
  verify() {
    if (!this.destination || !this.otp) { this.toast.error('OTP missing', 'Enter destination and OTP.'); return; }
    this.auth.verifyOtp({ destination: this.destination, otp: this.otp, purpose: 'Registration' }).subscribe({
      next: res => this.toast.success('OTP verified', res.message),
      error: err => this.toast.error('Wrong OTP', err.error?.message || 'OTP is invalid or expired.')
    });
  }
}
