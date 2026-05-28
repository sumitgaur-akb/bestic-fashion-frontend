import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { ApiService } from './api.service';

export interface AuthResult { userId: number; fullName: string; email: string; roles: string[]; accessToken: string; refreshToken: string; sellerStatus?: string | null; }
export interface ApiResponse<T> { success: boolean; message: string; data: T; errors?: string[]; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<AuthResult | null>(this.readUser());
  constructor(private api: ApiService, private router: Router) {}
  login(payload: { emailOrMobile: string; password: string }) {
    return this.api.post<ApiResponse<AuthResult>>('/auth/login', payload).pipe(tap(res => this.setSession(res.data)));
  }
  registerCustomer(payload: unknown) {
    return this.api.post<ApiResponse<AuthResult>>('/auth/customer/register', payload).pipe(tap(res => this.setSession(res.data)));
  }
  registerSeller(payload: unknown) {
    return this.api.post<ApiResponse<AuthResult>>('/auth/seller/register', payload).pipe(tap(res => this.setSession(res.data)));
  }
  sendOtp(payload: unknown) { return this.api.post('/auth/login-otp', payload); }
  verifyOtp(payload: unknown) { return this.api.post<ApiResponse<AuthResult>>('/auth/verify-otp', payload).pipe(tap(res => this.setSession(res.data))); }
  verifyRegistrationOtp(payload: unknown) { return this.api.post<ApiResponse<string>>('/auth/verify-registration-otp', payload); }
  hasRole(role: string) { return this.currentUser()?.roles.includes(role) ?? false; }
  isCustomer() { return this.hasRole('Customer'); }
  isSeller() { return this.hasRole('Seller'); }
  isAdmin() { return this.hasRole('Admin'); }
  sellerStatus() { return this.currentUser()?.sellerStatus ?? null; }
  token() { return this.currentUser()?.accessToken ?? localStorage.getItem('accessToken'); }
  logout() { localStorage.clear(); this.currentUser.set(null); this.router.navigateByUrl('/'); }
  private setSession(auth: AuthResult) { localStorage.setItem('auth', JSON.stringify(auth)); localStorage.setItem('accessToken', auth.accessToken); this.currentUser.set(auth); }
  private readUser(): AuthResult | null { const raw = localStorage.getItem('auth'); return raw ? JSON.parse(raw) as AuthResult : null; }
}
