import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page pending">
      <div class="card pending-card">
        <p>Approval pending</p>
        <h1>Your KYC is under admin review.</h1>
        <span>Once Bestic Fashion approves your seller account, you will receive an email. After approval, login again to access the seller dashboard.</span>
        <div class="actions">
          <button class="btn" type="button" (click)="auth.logout()">Logout</button>
          <a class="btn secondary" routerLink="/seller/login">Back to seller login</a>
        </div>
      </div>
    </section>
  `,
  styles: [`.pending{display:grid;place-items:center;min-height:calc(100vh - 110px)}.pending-card{max-width:640px;text-align:center;padding:34px}.pending-card p{margin:0 0 8px;color:#f59e0b;font-weight:900;text-transform:uppercase;font-size:12px}.pending-card h1{margin:0 0 12px;font-size:clamp(30px,4vw,46px)}.pending-card span{display:block;color:#64748b;line-height:1.6}.actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:22px}`]
})
export class SellerPendingComponent {
  constructor(public auth: AuthService) {}
}
