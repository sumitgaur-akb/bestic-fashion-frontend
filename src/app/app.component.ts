import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { ToastHostComponent } from './shared/components/toast-host/toast-host.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ToastHostComponent],
  template: `
    <app-header />
    <app-toast-host />
    <main class="app-main">
      <router-outlet />
    </main>
  `
})
export class AppComponent {}
