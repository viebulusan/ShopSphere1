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
              <app-icon name="home" [size]="20" [color]="isActive(['home']) ? '#ffffff' : '#6b7280'" [strokeWidth]="isActive(['home']) ? 2.4 : 1.8"></app-icon>
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
              <app-icon name="compass" [size]="20" [color]="isActive(['discover']) ? '#ffffff' : '#6b7280'" [strokeWidth]="isActive(['discover']) ? 2.4 : 1.8"></app-icon>
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
              <app-icon name="bag" [size]="20" [color]="isActive(['cart', 'checkout']) ? '#ffffff' : '#6b7280'" [strokeWidth]="isActive(['cart', 'checkout']) ? 2.4 : 1.8"></app-icon>
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
              <app-icon name="package" [size]="20" [color]="isActive(['orders', 'order-details']) ? '#ffffff' : '#6b7280'" [strokeWidth]="isActive(['orders', 'order-details']) ? 2.4 : 1.8"></app-icon>
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
              <app-icon name="user" [size]="20" [color]="isActive(['profile', 'saved-addresses', 'saved-payments', 'wishlist']) ? '#ffffff' : '#6b7280'" [strokeWidth]="isActive(['profile', 'saved-addresses', 'saved-payments', 'wishlist']) ? 2.4 : 1.8"></app-icon>
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
      bottom: 12px;
      left: 16px;
      right: 16px;
      max-width: 480px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.94);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 9999px;
      box-shadow: 0 16px 36px -6px rgba(15, 23, 42, 0.12), 0 1px 3px rgba(15, 23, 42, 0.05);
      z-index: 9999;
      padding: 6px 8px;
      pointer-events: auto;
    }
    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 100%;
      margin: 0 auto;
      padding: 0 4px;
    }
    .tab-button {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4px 2px 2px;
      border: none;
      background: transparent;
      cursor: pointer;
      position: relative;
      border-radius: 9999px;
      transition: all 0.2s ease;
      -webkit-tap-highlight-color: transparent;
    }
    .tab-button::before {
      display: none;
    }
    .tab-button:hover {
      background: rgba(0, 0, 0, 0.04);
    }
    .tab-button:active {
      transform: scale(0.95);
    }
    .icon-wrapper {
      width: 44px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 14px;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
    }
    .tab-button.active .icon-wrapper {
      background: #111318;
      border: 1.5px solid #111318;
      box-shadow: 0 2px 8px rgba(17, 19, 24, 0.25);
    }
    .tab-label {
      font-size: 10px;
      font-weight: 500;
      color: #6b7280;
      margin-top: 2px;
      transition: all 0.2s ease;
      letter-spacing: -0.15px;
      line-height: 1.1;
    }
    .tab-button:hover .tab-label {
      color: #111318;
    }
    .tab-button.active .tab-label {
      color: #111318;
      font-weight: 700;
    }
    .cart-badge {
      position: absolute;
      top: -3px;
      right: 2px;
      background: #d97706;
      border: 1.5px solid #ffffff;
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
