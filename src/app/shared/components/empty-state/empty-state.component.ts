import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `<section class="empty"><h3>{{ title }}</h3><p>{{ message }}</p></section>`,
  styles: [`.empty{padding:40px;text-align:center;border:1px dashed #cbd5e1;background:#fff}.empty h3{margin:0 0 8px}.empty p{margin:0;color:#64748b}`]
})
export class EmptyStateComponent {
  @Input() title = 'Nothing here yet';
  @Input() message = 'Items will appear here when available.';
}
