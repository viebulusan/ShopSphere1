import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService } from '../../services/shop.service';
import { IconComponent } from '../icon/icon.component';
import { ScreenType } from '../../models/shop.models';

@Component({
  selector: 'app-tabbar',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    @if (!isAuthScreen()) {
      <nav class="normal-bottom-nav md:hidden" aria-label="Bottom Navigation">
        <div class="nav-inner">

          <button 
            type="button"
            (click)="navigate('home')" 
            class="tab-button" 
            [class.active]="isActive(['home'])"
            aria-label="Home">
            <div class="icon-wrapper">
              <app-icon name="home" [size]="20" [color]="isActive(['home']) ? '#1664b0' : '#555B62'" [strokeWidth]="isActive(['home']) ? 2.3 : 1.8"></app-icon>
            </div>
            <span class="tab-label">Home</span>
          </button>

          <button 
            type="button"
            (click)="navigate('discover')" 
            class="tab-button" 
            [class.active]="isActive(['discover'])"
            aria-label="Discover">
            <div class="icon-wrapper">
              <app-icon name="compass" [size]="20" [color]="isActive(['discover']) ? '#1664b0' : '#555B62'" [strokeWidth]="isActive(['discover']) ? 2.3 : 1.8"></app-icon>
            </div>
            <span class="tab-label">Discover</span>
          </button>

          <button 
            type="button"
            (click)="navigate('cart')" 
            class="tab-button" 
            [class.active]="isActive(['cart', 'checkout'])"
            aria-label="Bag">
            <div class="icon-wrapper">
              <app-icon name="bag" [size]="20" [color]="isActive(['cart', 'checkout']) ? '#1664b0' : '#555B62'" [strokeWidth]="isActive(['cart', 'checkout']) ? 2.3 : 1.8"></app-icon>
              @if (shop.cartCount() > 0) {
                <span class="cart-badge">{{ shop.cartCount() }}</span>
              }
            </div>
            <span class="tab-label">Bag</span>
          </button>

          <button 
            type="button"
            (click)="navigate('orders')" 
            class="tab-button" 
            [class.active]="isActive(['orders', 'order-details'])"
            aria-label="Orders">
            <div class="icon-wrapper">
              <app-icon name="package" [size]="20" [color]="isActive(['orders', 'order-details']) ? '#1664b0' : '#555B62'" [strokeWidth]="isActive(['orders', 'order-details']) ? 2.3 : 1.8"></app-icon>
            </div>
            <span class="tab-label">Orders</span>
          </button>

          <button 
            type="button"
            (click)="navigate('profile')" 
            class="tab-button" 
            [class.active]="isActive(['profile', 'saved-addresses', 'saved-payments', 'wishlist'])"
            aria-label="Account">
            <div class="icon-wrapper">
              <app-icon name="user" [size]="20" [color]="isActive(['profile', 'saved-addresses', 'saved-payments', 'wishlist']) ? '#1664b0' : '#555B62'" [strokeWidth]="isActive(['profile']) ? 2.3 : 1.8"></app-icon>
            </div>
            <span class="tab-label">Account</span>
          </button>

        </div>
      </nav>
    }
  `,
  styles: [`
    :host {
      display: block;
      position: fixed !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      z-index: 9999 !important;
      pointer-events: auto !important;
    }
    @media (min-width: 768px) {
      :host {
        display: none !important;
      }
    }
    .normal-bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-top: 1px solid rgba(22, 100, 176, 0.16);
      box-shadow: 0 -2px 10px rgba(22, 100, 176, 0.05);
      z-index: 9999;
      padding-top: 8px;
      padding-bottom: max(8px, env(safe-area-inset-bottom));
      pointer-events: auto;
    }
    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 100%;
      max-width: 560px;
      margin: 0 auto;
      padding: 0 8px;
    }
    .tab-button {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2px 0;
      border: none;
      background: transparent;
      cursor: pointer;
      position: relative;
      transition: all 0.18s ease;
      -webkit-tap-highlight-color: transparent;
    }
    .tab-button:active {
      transform: scale(0.95);
    }
    .tab-button.active::before {
      content: '';
      position: absolute;
      top: -8px;
      width: 24px;
      height: 2.5px;
      background: #1664b0;
      border-radius: 9999px;
      box-shadow: 0 0 8px rgba(22, 100, 176, 0.4);
    }
    .icon-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 24px;
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .tab-button.active .icon-wrapper {
      transform: translateY(-1px);
    }
    .tab-label {
      font-size: 10px;
      font-weight: 500;
      color: #555B62;
      margin-top: 3px;
      transition: color 0.18s ease;
      letter-spacing: -0.15px;
      line-height: 1.1;
    }
    .tab-button.active .tab-label {
      color: #1664b0;
      font-weight: 700;
    }
    .cart-badge {
      position: absolute;
      top: -4px;
      right: -6px;
      background: #d21624;
      border: 1.5px solid #FFFFFF;
      color: #ffffff;
      font-size: 9px;
      font-weight: 900;
      min-width: 16px;
      height: 16px;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 3px;
      line-height: 1;
    }
  `]
})
export class TabBarComponent {
  readonly shop = inject(ShopService);

  isAuthScreen(): boolean {
    const auths: ScreenType[] = [
      'login',
      'signup',
      'reset-password',
      'code-verification'
    ];
    if (auths.includes(this.shop.activeScreen())) {
      return true;
    }
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    return path.includes('/login') || path.includes('/signup') || path.includes('/forgot') || path.includes('/reset');
  }

  isActive(screens: ScreenType[]): boolean {
    return screens.includes(this.shop.activeScreen());
  }

  navigate(screen: ScreenType) {
    this.shop.navigateTo(screen);
  }
}
