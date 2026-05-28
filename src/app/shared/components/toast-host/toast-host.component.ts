import { Component } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-host',
  standalone: true,
  template: `
    <div class="toast-stack">
      @for (toast of toastService.messages(); track toast.id) {
        <div class="toast" [class]="toast.type">
          <div>
            <strong>{{ toast.title }}</strong>
            @if (toast.message) { <p>{{ toast.message }}</p> }
          </div>
          <button type="button" (click)="toastService.dismiss(toast.id)">×</button>
        </div>
      }
    </div>
  `,
  styles: [`.toast-stack{position:fixed;top:78px;right:18px;z-index:1000;display:grid;gap:10px;width:min(360px,calc(100vw - 32px))}.toast{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;background:#fff;border:1px solid #e5e7eb;border-left:5px solid #2874f0;box-shadow:0 18px 44px #0f172a24;border-radius:7px;padding:13px 14px}.toast.success{border-left-color:#0f766e}.toast.error{border-left-color:#dc2626}.toast.info{border-left-color:#2874f0}.toast strong{display:block}.toast p{margin:4px 0 0;color:#64748b;font-size:13px}.toast button{border:0;background:transparent;font-size:22px;line-height:1;cursor:pointer;color:#64748b}`]
})
export class ToastHostComponent {
  constructor(public toastService: ToastService) {}
}
