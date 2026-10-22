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

      <div class="relative w-full aspect-square rounded-[14px] overflow-hidden bg-[#efe8de] flex items-center justify-center">

        <img 
          [src]="product.image" 
          [alt]="product.title"
          loading="lazy"
          class="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />

        <div class="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
          @if (product.badge) {
            <span class="badge-tag bg-[#d21624] text-white text-[8px] sm:text-[9px] shadow-xs px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
              {{ product.badge }}
            </span>
          } @else if (product.isNew) {
            <span class="badge-tag bg-[#1664b0] text-white text-[8px] sm:text-[9px] shadow-xs px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
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
            [color]="isWishlisted() ? '#FFFFFF' : '#1664b0'" 
            [strokeWidth]="2" 
            [filled]="isWishlisted()">
          </app-icon>
        </button>

        <div class="absolute bottom-2 left-2 flex items-center gap-1 bg-white/95 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-black/5 shadow-xs pointer-events-none">
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
          
          <div class="flex items-center justify-between text-[10px] font-bold text-[#1664b0] mb-0.5">
            <span class="tracking-wider uppercase truncate">{{ product.category }}</span>
            <div class="flex items-center gap-1 shrink-0">
              <app-icon name="star" [size]="10" color="#d21624" [filled]="true"></app-icon>
              <span class="text-[#1A1D20] font-bold">{{ product.rating }}</span>
            </div>
          </div>

          <h3 class="text-xs sm:text-sm font-bold text-[#1A1D20] line-clamp-1 leading-snug transition-colors group-hover:text-[#1664b0]">
            {{ product.title }}
          </h3>

          <p class="text-[11px] text-[#555B62] line-clamp-1 mt-0.5">
            {{ product.subtitle }}
          </p>
        </div>

        <div class="mt-2 pt-2 border-t border-[rgba(22,100,176,0.12)] flex items-center justify-between">
          <div class="flex items-baseline gap-1.5">
            <span class="text-sm sm:text-base font-black text-[#1664b0]">
              ₱{{ product.price }}
            </span>
            @if (product.originalPrice) {
              <span class="text-[10px] sm:text-[11px] text-[#555B62]/60 line-through">
                ₱{{ product.originalPrice }}
              </span>
            }
          </div>

          <button 
            (click)="onQuickAdd($event)"
            class="quick-add-btn" 
            [class.added]="justAdded()"
            title="Add to Bag">
            <app-icon [name]="justAdded() ? 'check' : 'plus'" [size]="13" color="#FFFFFF" [strokeWidth]="2.6"></app-icon>
          </button>
        </div>

      </div>

    </div>
  `,
  styles: [`
    .product-card {
      background: #FFFFFF;
      border-radius: 20px;
      padding: 10px;
      border: 1px solid rgba(22, 100, 176, 0.16);
      box-shadow: 0 4px 18px -2px rgba(22, 100, 176, 0.08);
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .product-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px -4px rgba(22, 100, 176, 0.16);
      border-color: rgba(22, 100, 176, 0.35);
    }
    .wishlist-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 28px;
      height: 28px;
      border-radius: 9999px;
      background: #FFFFFF;
      border: 1.5px solid rgba(22, 100, 176, 0.22);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(22, 100, 176, 0.06);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 10;
    }
    .wishlist-btn:hover {
      transform: scale(1.1);
      background: #efe8de;
      border-color: #1664b0;
    }
    .wishlist-btn:active {
      transform: scale(0.9);
    }
    .wishlist-btn.active {
      background: #d21624;
      border-color: #d21624;
      box-shadow: 0 2px 8px rgba(210, 22, 36, 0.35);
    }
    .quick-add-btn {
      width: 28px;
      height: 28px;
      border-radius: 9999px;
      background: #1664b0;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 2px 8px rgba(22, 100, 176, 0.25);
    }
    .quick-add-btn:hover {
      background: #0f4880;
      transform: scale(1.08);
      box-shadow: 0 0 12px rgba(22, 100, 176, 0.35);
    }
    .quick-add-btn:active {
      transform: scale(0.92);
    }
    .quick-add-btn.added {
      background: #d21624;
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
