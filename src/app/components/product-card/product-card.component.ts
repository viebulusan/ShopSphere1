import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/shop.models';
import { ShopService } from '../../services/shop.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="product-card group relative flex flex-col justify-between" (click)="onCardClick()">

      <div class="relative w-full aspect-square rounded-[16px] overflow-hidden bg-[#f0f2f6] p-2 sm:p-2.5 flex items-center justify-center border border-[#e5e7eb]">

        <img 
          [src]="product.image" 
          [alt]="product.title"
          loading="lazy"
          class="w-full h-full object-cover object-center rounded-[12px] transition-transform duration-500 ease-out group-hover:scale-105"
        />

        <div class="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
          @if (product.badge) {
            <span class="badge-tag text-[8px] sm:text-[9px] shadow-xs px-2 py-0.5 bg-white/90 text-[#111318] font-bold rounded-full border border-[#e5e7eb] backdrop-blur-md">
              {{ product.badge }}
            </span>
          } @else if (product.isNew) {
            <span class="badge-tag text-[8px] sm:text-[9px] shadow-xs px-2 py-0.5 bg-white/90 text-[#6b7280] border border-[#e5e7eb] font-bold rounded-full backdrop-blur-md">
              New
            </span>
          }
        </div>

        <button 
          (click)="onWishlistClick($event)"
          class="wishlist-btn"
          [class.active]="isWishlisted()"
          aria-label="Wishlist">
          <app-icon 
            [name]="isWishlisted() ? 'heart-filled' : 'heart'" 
            [size]="15" 
            [color]="isWishlisted() ? '#ffffff' : '#6b7280'" 
            [strokeWidth]="2" 
            [filled]="isWishlisted()">
          </app-icon>
        </button>

        <div class="absolute bottom-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-[#e5e7eb] shadow-xs pointer-events-none">
          @for (color of product.colors; track color.name) {
            <span 
              class="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-black/10" 
              [style.background-color]="color.hex"
              [title]="color.name">
            </span>
          }
        </div>

      </div>

      <div class="mt-2.5 flex flex-col flex-1 justify-between px-0.5">
        <div>
          
          <div class="flex items-center justify-between text-[10px] font-semibold text-[#6b7280] mb-0.5">
            <span class="tracking-wider uppercase truncate">{{ product.category }}</span>
            <div class="flex items-center gap-1 shrink-0">
              <app-icon name="star" [size]="10" color="#f59e0b" [filled]="true"></app-icon>
              <span class="text-[#111318] font-bold">{{ product.rating }}</span>
            </div>
          </div>

          <h3 class="text-xs sm:text-sm font-bold text-[#111318] line-clamp-1 leading-snug transition-opacity group-hover:opacity-75">
            {{ product.title }}
          </h3>

          <p class="text-[11px] text-[#6b7280] line-clamp-1 mt-0.5">
            {{ product.subtitle }}
          </p>
        </div>

        <div class="mt-2 pt-2 border-t border-[#e5e7eb] flex items-center justify-between">
          <div class="flex items-baseline gap-1.5">
            <span class="text-sm sm:text-base font-black text-[#111318]">
              ₱{{ product.price }}
            </span>
            @if (product.originalPrice) {
              <span class="text-[10px] sm:text-[11px] text-[#9ca3af] line-through">
                ₱{{ product.originalPrice }}
              </span>
            }
          </div>

          <button 
            (click)="onQuickAdd($event)"
            class="quick-add-btn" 
            [class.added]="justAdded()"
            title="Add to Bag">
            <app-icon [name]="justAdded() ? 'check' : 'plus'" [size]="13" color="#ffffff" [strokeWidth]="2.6"></app-icon>
          </button>
        </div>

      </div>

    </div>
  `,
  styles: [`
    .product-card {
      background: #ffffff;
      border-radius: 20px;
      padding: 10px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 4px 18px -2px rgba(15, 23, 42, 0.05);
      cursor: pointer;
      transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .product-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 28px -4px rgba(15, 23, 42, 0.09);
      border-color: #d1d5db;
    }
    .wishlist-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 28px;
      height: 28px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.06);
      backdrop-filter: blur(8px);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 10;
    }
    .wishlist-btn:hover {
      transform: scale(1.1);
      background: #ffffff;
      border-color: #d1d5db;
    }
    .wishlist-btn:active {
      transform: scale(0.9);
    }
    .wishlist-btn.active {
      background: #f43f5e;
      border-color: #f43f5e;
      box-shadow: 0 2px 10px rgba(244, 63, 94, 0.3);
    }
    .quick-add-btn {
      width: 28px;
      height: 28px;
      border-radius: 9999px;
      background: #111318;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 2px 8px rgba(17, 19, 24, 0.15);
    }
    .quick-add-btn:hover {
      background: #272d3b;
      transform: scale(1.08);
      box-shadow: 0 4px 14px rgba(17, 19, 24, 0.28);
    }
    .quick-add-btn:active {
      transform: scale(0.92);
    }
    .quick-add-btn.added {
      background: #10b981;
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.35);
    }
  `]
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  readonly shop = inject(ShopService);

  justAdded = signal(false);

  onCardClick() {
    this.shop.openProductDetail(this.product);
  }

  isWishlisted(): boolean {
    return this.shop.isWishlisted(this.product.id);
  }

  onWishlistClick(event: Event) {
    event.stopPropagation();
    this.shop.toggleWishlist(this.product);
  }

  onQuickAdd(event: Event) {
    event.stopPropagation();
    const added = this.shop.addToCart(this.product, this.product.colors[0], this.product.sizes[0], 1);
    if (added) {
      this.justAdded.set(true);
      setTimeout(() => this.justAdded.set(false), 1200);
    }
  }
}
