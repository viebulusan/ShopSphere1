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
      <nav class="fixed bottom-0 left-0 right-0 z-[9999] px-4 pt-2 pointer-events-none flex justify-center w-full md:hidden"
           style="position: fixed !important; bottom: 0 !important; left: 0 !important; right: 0 !important; z-index: 9999 !important; padding-bottom: max(1.5rem, calc(0.5rem + env(safe-area-inset-bottom)));">
        <div class="pointer-events-auto rounded-full px-3 py-2 flex items-center justify-around gap-1 max-w-[420px] w-full mx-auto"
             style="background: rgba(247, 234, 224, 0.94); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.75); box-shadow: 0 10px 30px -5px rgba(29, 69, 51, 0.15);">

        <button 
          (click)="navigate('home')" 
          class="tab-button" 
          [class.active]="isActive(['home'])">
          <div class="icon-wrapper">
            <app-icon name="home" [size]="20" [color]="isActive(['home']) ? '#FFFFFF' : '#58585D'" [strokeWidth]="isActive(['home']) ? 2.3 : 1.8"></app-icon>
          </div>
          <span class="tab-label">Home</span>
        </button>

        <button 
          (click)="navigate('discover')" 
          class="tab-button" 
          [class.active]="isActive(['discover'])">
          <div class="icon-wrapper">
            <app-icon name="compass" [size]="20" [color]="isActive(['discover']) ? '#FFFFFF' : '#58585D'" [strokeWidth]="isActive(['discover']) ? 2.3 : 1.8"></app-icon>
          </div>
          <span class="tab-label">Discover</span>
        </button>

        <button 
          (click)="navigate('cart')" 
          class="tab-button" 
          [class.active]="isActive(['cart', 'checkout'])">
          <div class="icon-wrapper">
            <app-icon name="bag" [size]="20" [color]="isActive(['cart', 'checkout']) ? '#FFFFFF' : '#58585D'" [strokeWidth]="isActive(['cart', 'checkout']) ? 2.3 : 1.8"></app-icon>
          </div>
          <span class="tab-label">Bag</span>
        </button>

        <button 
          (click)="navigate('orders')" 
          class="tab-button" 
          [class.active]="isActive(['orders', 'order-details'])">
          <div class="icon-wrapper">
            <app-icon name="package" [size]="20" [color]="isActive(['orders', 'order-details']) ? '#FFFFFF' : '#58585D'" [strokeWidth]="isActive(['orders', 'order-details']) ? 2.3 : 1.8"></app-icon>
          </div>
          <span class="tab-label">Orders</span>
        </button>

        <button 
          (click)="navigate('profile')" 
          class="tab-button" 
          [class.active]="isActive(['profile', 'saved-addresses', 'saved-payments', 'wishlist'])">
          <div class="icon-wrapper">
            <app-icon name="user" [size]="20" [color]="isActive(['profile', 'saved-addresses', 'saved-payments', 'wishlist']) ? '#FFFFFF' : '#58585D'" [strokeWidth]="isActive(['profile']) ? 2.3 : 1.8"></app-icon>
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
      pointer-events: none !important;
    }
    @media (min-width: 768px) {
      :host {
        display: none !important;
      }
    }
    .tab-button {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 6px 10px;
      border-radius: 9999px;
      border: none;
      background: transparent;
      cursor: pointer;
      position: relative;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .icon-wrapper {
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 9999px;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .tab-label {
      font-size: 10px;
      font-weight: 600;
      color: #58585D;
      margin-top: 1px;
      transition: color 0.2s ease;
      letter-spacing: -0.1px;
    }
    .tab-button.active .icon-wrapper {
      background: #1D4533;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(29, 69, 51, 0.3);
    }
    .tab-button.active .tab-label {
      color: #1D4533;
      font-weight: 700;
    }
    .tab-button:active {
      transform: scale(0.92);
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
