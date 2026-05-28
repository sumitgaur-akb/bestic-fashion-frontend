import { Component, OnInit, signal } from '@angular/core';
import { SellerService } from '../../../core/services/seller.service';
import { ToastService } from '../../../core/services/toast.service';

interface SellerReview {
  sellerId: number;
  ownerName: string;
  email: string;
  storeName: string;
  status: string;
  businessName?: string;
  gstNumber?: string;
  panNumber?: string;
  pickupAddress?: string;
  bankName?: string;
  accountHolderName?: string;
  productCount: number;
  totalOrders: number;
  totalRevenue: number;
}

interface SellerSummary {
  totalSellers: number;
  pendingOtp: number;
  pendingKyc: number;
  pendingApproval: number;
  approved: number;
  rejectedOrSuspended: number;
  marketplaceSellerRevenue: number;
}

@Component({
  standalone: true,
  template: `
    <section class="page">
      <div class="admin-hero"><p>Admin Review</p><h1>Seller Onboarding</h1></div>
      @if (summary(); as s) {
        <div class="summary-grid">
          <div class="card metric"><span>Total sellers</span><strong>{{ s.totalSellers }}</strong></div>
          <div class="card metric"><span>Pending OTP</span><strong>{{ s.pendingOtp }}</strong></div>
          <div class="card metric"><span>Pending KYC</span><strong>{{ s.pendingKyc }}</strong></div>
          <div class="card metric highlight"><span>Pending approval</span><strong>{{ s.pendingApproval }}</strong></div>
          <div class="card metric success"><span>Onboarded</span><strong>{{ s.approved }}</strong></div>
          <div class="card metric"><span>Rejected/Suspended</span><strong>{{ s.rejectedOrSuspended }}</strong></div>
        </div>
      }
      <div class="grid">
        @for (seller of sellers(); track seller.sellerId) {
          <article class="card seller-card">
            <div class="seller-head">
              <div><strong>{{ seller.storeName }}</strong><span>{{ seller.ownerName }} • {{ seller.email }}</span></div>
              <b [class]="seller.status">{{ seller.status }}</b>
            </div>
            <dl>
              <div><dt>Business</dt><dd>{{ seller.businessName || 'Not submitted' }}</dd></div>
              <div><dt>GST</dt><dd>{{ seller.gstNumber || '-' }}</dd></div>
              <div><dt>PAN</dt><dd>{{ seller.panNumber || '-' }}</dd></div>
              <div><dt>Pickup</dt><dd>{{ seller.pickupAddress || '-' }}</dd></div>
              <div><dt>Bank</dt><dd>{{ seller.bankName || '-' }}</dd></div>
              <div><dt>Products</dt><dd>{{ seller.productCount }}</dd></div>
              <div><dt>Orders</dt><dd>{{ seller.totalOrders }}</dd></div>
              <div><dt>Revenue</dt><dd>₹{{ seller.totalRevenue }}</dd></div>
            </dl>
            <div class="actions">
              <button class="btn" (click)="review(seller.sellerId, true)" [disabled]="seller.status === 'Approved'">Approve</button>
              <button class="btn danger" (click)="review(seller.sellerId, false)">Reject</button>
            </div>
          </article>
        }
      </div>
    </section>
  `,
  styles: [`.admin-hero{background:linear-gradient(135deg,#102a61,#2874f0 60%,#1b9aaa);color:#fff;padding:24px;border-radius:8px;margin-bottom:16px}.admin-hero p{margin:0 0 6px;color:#ffd34d;font-weight:900;text-transform:uppercase;font-size:12px}.admin-hero h1{margin:0}.summary-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:16px}.metric{border-top:4px solid #2874f0}.metric.highlight{border-top-color:#f59e0b}.metric.success{border-top-color:#0f766e}.metric span{display:block;color:#64748b;font-weight:800;font-size:13px}.metric strong{font-size:28px}.seller-card{display:grid;gap:14px}.seller-head{display:flex;justify-content:space-between;gap:12px}.seller-head strong{display:block;font-size:18px}.seller-head span{color:#64748b;font-size:13px}.seller-head b{height:max-content;border-radius:999px;padding:5px 9px;background:#e0f2fe;color:#075985;font-size:12px}.seller-head b.Approved{background:#dcfce7;color:#166534}.seller-head b.Suspended{background:#fee2e2;color:#991b1b}.seller-head b.PendingApproval{background:#fef3c7;color:#92400e}dl{display:grid;gap:8px;margin:0}dl div{display:grid;grid-template-columns:96px 1fr;gap:10px}dt{color:#64748b;font-weight:800}dd{margin:0}.actions{display:flex;gap:10px}.danger{background:#dc2626}`]
})
export class ManageSellersComponent implements OnInit {
  sellers = signal<SellerReview[]>([]);
  summary = signal<SellerSummary | null>(null);
  constructor(private sellerService: SellerService, private toast: ToastService) {}

  ngOnInit() { this.load(); }

  load() {
    this.sellerService.adminSellerSummary().subscribe({
      next: (res: any) => this.summary.set(res.data),
      error: err => this.toast.error('Unable to load seller summary', err.error?.message || 'Admin login required.')
    });
    this.sellerService.adminSellers().subscribe({
      next: (res: any) => this.sellers.set(res.data ?? []),
      error: err => this.toast.error('Unable to load sellers', err.error?.message || 'Admin login required.')
    });
  }

  review(sellerId: number, approved: boolean) {
    this.sellerService.reviewSeller(sellerId, approved).subscribe({
      next: (res: any) => { this.toast.success(approved ? 'Seller approved' : 'Seller rejected', res.message); this.load(); },
      error: err => this.toast.error('Review failed', err.error?.message || 'Please try again.')
    });
  }
}
