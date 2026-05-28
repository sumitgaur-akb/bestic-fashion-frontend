import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';
export interface ToastMessage { id: number; type: ToastType; title: string; message?: string; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  messages = signal<ToastMessage[]>([]);
  private nextId = 1;

  success(title: string, message?: string) { this.show('success', title, message); }
  error(title: string, message?: string) { this.show('error', title, message); }
  info(title: string, message?: string) { this.show('info', title, message); }

  show(type: ToastType, title: string, message?: string) {
    const toast = { id: this.nextId++, type, title, message };
    this.messages.update(items => [...items, toast]);
    setTimeout(() => this.dismiss(toast.id), 4200);
  }

  dismiss(id: number) {
    this.messages.update(items => items.filter(item => item.id !== id));
  }
}
