import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService } from '../services/shop.service';
import { IconComponent } from '../components/icon/icon.component';

@Component({
  selector: 'app-order-complete',
  standalone: true,
  templateUrl: './order-complete.page.html',
  styleUrls: ['./order-complete.page.scss'],
  imports: [CommonModule, IconComponent]
})
export class OrderCompletePage {
  readonly shop = inject(ShopService);

  order = () => {
    return this.shop.selectedOrder() || (this.shop.orders().length > 0 ? this.shop.orders()[0] : null);
  };

  trackOrder() {
    const ord = this.order();
    if (ord) {
      this.shop.openOrderDetails(ord);
    } else {
      this.shop.navigateTo('orders');
    }
  }
}
