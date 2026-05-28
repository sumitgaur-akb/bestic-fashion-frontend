import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = ((globalThis as any).__flipshopConfig?.apiBaseUrl ?? '/api').replace(/\/$/, '');
  constructor(private http: HttpClient) {}
  get<T>(url: string, params?: Record<string, string | number | boolean | undefined>) {
    let httpParams = new HttpParams();
    Object.entries(params ?? {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') httpParams = httpParams.set(key, String(value));
    });
    return this.http.get<T>(`${this.baseUrl}${url}`, { params: httpParams });
  }
  post<T>(url: string, body: unknown) { return this.http.post<T>(`${this.baseUrl}${url}`, body); }
  put<T>(url: string, body: unknown) { return this.http.put<T>(`${this.baseUrl}${url}`, body); }
  delete<T>(url: string) { return this.http.delete<T>(`${this.baseUrl}${url}`); }
}
