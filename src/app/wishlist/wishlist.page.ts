import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService } from '../services/shop.service';
import { IconComponent } from '../components/icon/icon.component';
import { ProductCardComponent } from '../components/product-card/product-card.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
  imports: [CommonModule, IconComponent, ProductCardComponent]
})
export class WishlistPage {
  readonly shop = inject(ShopService);

  addAllToBag() {
    this.shop.wishlist().forEach(p => {
      this.shop.addToCart(p, p.colors[0], p.sizes[0], 1);
    });
    this.shop.navigateTo('bag');
  }
}
