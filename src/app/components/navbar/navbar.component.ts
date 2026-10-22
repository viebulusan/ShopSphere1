import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShopService } from '../../services/shop.service';
import { IconComponent } from '../icon/icon.component';
import { ScreenType, Product } from '../../models/shop.models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    @if (!isAuthScreen()) {
      <header class="sticky top-0 z-40 px-4 sm:px-6 lg:px-8 py-3 transition-all duration-200"
              style="background: rgba(247, 248, 250, 0.92); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-bottom: 1px solid #e5e7eb;">
        
        <div class="w-full max-w-7xl mx-auto flex items-center justify-between gap-4">

          <div class="flex items-center gap-3">
            @if (isSubScreen() && !isAuthScreen()) {
              <button (click)="shop.goBack()" class="action-circle-btn" aria-label="Go Back">
                <app-icon name="chevron-left" [size]="20" color="#111318" [strokeWidth]="2.4"></app-icon>
              </button>
              <span class="text-xs uppercase tracking-wider font-bold text-[#111318]">{{ getScreenTitle() }}</span>
            } @else {
              <div (click)="shop.navigateTo('home')" class="flex items-center gap-2.5 cursor-pointer group">
                <img src="assets/icon/app-icon.png" 
                     alt="ShopSphere Icon" 
                     class="w-8 h-8 rounded-[10px] object-cover shadow-2xs border border-[#111318]/10 group-hover:scale-105 transition-transform" />
                <div>
                  <span class="text-base font-black tracking-tight text-[#111318]" style="letter-spacing: -0.02em; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;">
                    ShopSphere
                  </span>
                </div>
              </div>
            }
          </div>

          @if (!isAuthScreen()) {
            <div class="flex items-center gap-6">
              <nav class="hidden lg:flex items-center gap-6">
                <button (click)="shop.navigateTo('home')" class="nav-link" [class.active]="shop.activeScreen() === 'home'">
                  Catalog
                </button>
                <button (click)="shop.navigateTo('discover')" class="nav-link" [class.active]="shop.activeScreen() === 'discover'">
                  Discover
                </button>
                <button (click)="shop.navigateTo('orders')" class="nav-link" [class.active]="shop.activeScreen() === 'orders' || shop.activeScreen() === 'order-details'">
                  Orders
                </button>
                <button (click)="shop.navigateTo('wishlist')" class="nav-link" [class.active]="shop.activeScreen() === 'wishlist'">
                  Wishlist
                </button>
              </nav>

              <div class="relative hidden sm:block w-48 md:w-60 lg:w-72">
                <div class="relative flex items-center">
                  <div class="absolute left-3 text-[#9ca3af] pointer-events-none">
                    <app-icon name="search" [size]="14" color="currentColor"></app-icon>
                  </div>
                  <input 
                    type="text" 
                    [(ngModel)]="navSearchQuery"
                    (focus)="isNavSearchFocused.set(true)"
                    (blur)="onBlur()"
                    (input)="onNavSearchInput()"
                    placeholder="Search curated pieces..."
                    class="w-full pl-9 pr-8 py-1.5 text-xs rounded-full bg-white border border-[#e5e7eb] text-[#111318] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#111318] focus:ring-2 focus:ring-[#111318]/10 transition-all shadow-xs"
                  />
                  @if (navSearchQuery) {
                    <button (click)="clearNavSearch()" class="absolute right-2.5 text-[#9ca3af] hover:text-[#111318] p-0.5">
                      <app-icon name="x" [size]="12" color="currentColor"></app-icon>
                    </button>
                  }
                </div>

                @if (isNavSearchFocused() && liveMatchingProducts().length > 0) {
                  <div class="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#e5e7eb] py-2 z-50 overflow-hidden animate-fade-in max-h-80 overflow-y-auto no-scrollbar">
                    <div class="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#111318]">
                      Live Matches ({{ liveMatchingProducts().length }})
                    </div>
                    @for (prod of liveMatchingProducts().slice(0, 5); track prod.id) {
                      <div 
                        (mousedown)="selectLiveProduct(prod)" 
                        class="px-3 py-2 flex items-center gap-3 hover:bg-[#f0f2f6] cursor-pointer transition-colors border-b border-[#f0f2f6] last:border-0">
                        <img [src]="prod.image" class="w-9 h-9 rounded-lg object-cover shrink-0 bg-[#f0f2f6] border border-[#e5e7eb]" [alt]="prod.title" />
                        <div class="min-w-0 flex-1">
                          <p class="text-xs font-bold text-[#111318] truncate">{{ prod.title }}</p>
                          <p class="text-[10px] text-[#6b7280] truncate">{{ prod.subtitle }}</p>
                        </div>
                        <span class="text-xs font-extrabold text-[#111318] shrink-0">₱{{ prod.price }}</span>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          }

          <div class="flex items-center gap-2 sm:gap-3">
            @if (!isAuthScreen()) {
              <button (click)="shop.navigateTo('notifications')" class="action-circle-btn relative" aria-label="Notifications" title="Notifications">
                <app-icon name="bell" [size]="18" color="#111318" [strokeWidth]="2"></app-icon>
                @if (shop.unreadNotificationsCount() > 0) {
                  <span class="notif-dot"></span>
                }
              </button>
            } @else {
              <button (click)="shop.navigateTo('home')" class="action-circle-btn" aria-label="Browse Catalog" title="Close">
                <app-icon name="x" [size]="18" color="#111318" [strokeWidth]="2.2"></app-icon>
              </button>
            }
          </div>

        </div>

      </header>
    }
  `,
  styles: [`
    .nav-link {
      background: transparent;
      border: none;
      font-size: 13px;
      font-weight: 600;
      color: #6b7280;
      cursor: pointer;
      padding: 6px 0;
      position: relative;
      transition: color 0.2s ease;
    }
    .nav-link:hover {
      color: #111318;
    }
    .nav-link.active {
      color: #111318;
      font-weight: 700;
    }
    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: #111318;
      border-radius: 9999px;
    }
    .action-circle-btn {
      width: 36px;
      height: 36px;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
      color: #111318;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .action-circle-btn:hover {
      background: #f0f2f6;
      border-color: #d1d5db;
      transform: scale(1.05);
    }
    .action-circle-btn:active {
      transform: scale(0.94);
    }
    .notif-dot {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 8px;
      height: 8px;
      background: #111318;
      border-radius: 9999px;
      border: 1.5px solid #ffffff;
    }
  `]
})
export class NavBarComponent {
  readonly shop = inject(ShopService);

  navSearchQuery = '';
  isNavSearchFocused = signal(false);

  liveMatchingProducts = computed(() => {
    const q = this.navSearchQuery.trim().toLowerCase();
    if (!q) return [];
    return this.shop.products().filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  onNavSearchInput() {
    this.shop.searchQuery.set(this.navSearchQuery);
  }

  clearNavSearch() {
    this.navSearchQuery = '';
    this.shop.searchQuery.set('');
    this.isNavSearchFocused.set(false);
  }

  onBlur() {
    setTimeout(() => {
      this.isNavSearchFocused.set(false);
    }, 200);
  }

  selectLiveProduct(product: Product) {
    this.isNavSearchFocused.set(false);
    this.shop.openProductDetail(product);
  }

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

  isSubScreen(): boolean {
    const subs: ScreenType[] = [
      'product-detail', 
      'checkout', 
      'done', 
      'order-details', 
      'saved-addresses', 
      'add-address', 
      'saved-payments', 
      'add-payment',
      'reset-password',
      'code-verification',
      'network-error',
      'wishlist'
    ];
    return subs.includes(this.shop.activeScreen());
  }

  getScreenTitle(): string {
    const s = this.shop.activeScreen();
    switch (s) {
      case 'product-detail': return 'Product Specs';
      case 'checkout': return 'Secure Checkout';
      case 'done': return 'Order Complete';
      case 'orders': return 'Order History';
      case 'order-details': return 'Tracking Details';
      case 'saved-addresses': return 'Delivery Addresses';
      case 'add-address': return 'New Address';
      case 'saved-payments': return 'Payment Methods';
      case 'add-payment': return 'New Card';
      case 'notifications': return 'Inbox';
      case 'network-error': return 'System Status';
      case 'wishlist': return 'Saved Items';
      default: return '';
    }
  }
}
