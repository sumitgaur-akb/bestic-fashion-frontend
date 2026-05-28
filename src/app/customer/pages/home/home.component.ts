import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page">
      <div class="hero">
        <div class="hero-copy">
          <p>Fresh deals live now</p>
          <h1>Shop fashion, gadgets and daily essentials in one place.</h1>
          <div class="hero-actions">
            <a class="btn" routerLink="/products">Start shopping</a>
            <a class="btn secondary" routerLink="/seller/login">Sell on Bestic</a>
          </div>
        </div>
      </div>

      <div class="category-strip">
        @for (category of categories; track category) {
          <a class="category" routerLink="/products"><strong>{{ category }}</strong><span>Explore deals</span></a>
        }
      </div>

      <div class="toolbar"><h2>Trending Picks</h2><a routerLink="/products">View all</a></div>
      <div class="grid product-showcase">
        @for (item of picks; track item.name) {
          <a class="card pick" routerLink="/products">
            <div class="pick-art" [style.background]="item.bg">{{ item.icon }}</div>
            <strong>{{ item.name }}</strong>
            <span>{{ item.copy }}</span>
            <b>{{ item.price }}</b>
          </a>
        }
      </div>
    </section>
  `,
  styles: [`
    .hero{min-height:360px;border-radius:8px;overflow:hidden;background:linear-gradient(90deg,#071b45 0%,#071b45d9 38%,#071b4552 68%),url('/assets/marketplace-hero.png') center/cover no-repeat;display:flex;align-items:center;padding:clamp(24px,5vw,58px);box-shadow:0 18px 44px #0f172a24}
    .hero-copy{max-width:560px;color:#fff}.hero-copy p{margin:0 0 10px;color:#ffd34d;font-weight:900;text-transform:uppercase;font-size:13px}.hero-copy h1{font-size:clamp(30px,4.2vw,54px);line-height:1.05;margin:0 0 22px;letter-spacing:0}.hero-actions{display:flex;gap:12px;flex-wrap:wrap}
    .category-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:18px 0}.category{background:#fff;border:1px solid #e6edf5;border-radius:6px;padding:16px;text-decoration:none;color:#172337;box-shadow:0 8px 20px #0f172a0a}.category strong{display:block;font-size:18px}.category span{color:#64748b;font-size:13px}
    .toolbar a{color:#2874f0;font-weight:800;text-decoration:none}.pick{text-decoration:none;color:inherit;display:grid;gap:9px;transition:transform .16s ease,box-shadow .16s ease}.pick:hover{transform:translateY(-3px);box-shadow:0 14px 34px #0f172a18}.pick-art{height:130px;border-radius:5px;display:grid;place-items:center;font-size:42px}.pick span{color:#64748b}.pick b{color:#0f766e}
    @media(max-width:760px){.hero{min-height:430px;align-items:flex-start}.category-strip{grid-template-columns:repeat(2,1fr)}}
  `]
})
export class HomeComponent {
  categories = ['Mobiles', 'Electronics', 'Fashion', 'Home'];
  picks = [
    { name: 'Smartphones', copy: 'Performance deals', price: 'From ₹9,999', icon: '▣', bg: 'linear-gradient(135deg,#e0f2fe,#fef9c3)' },
    { name: 'Fashion Fits', copy: 'New season styles', price: 'Min 50% off', icon: '◆', bg: 'linear-gradient(135deg,#ffe4e6,#dcfce7)' },
    { name: 'Audio Zone', copy: 'Clear sound daily', price: 'From ₹799', icon: '◉', bg: 'linear-gradient(135deg,#ede9fe,#cffafe)' },
    { name: 'Home Picks', copy: 'Useful upgrades', price: 'From ₹299', icon: '◇', bg: 'linear-gradient(135deg,#fef3c7,#dbeafe)' }
  ];
}
