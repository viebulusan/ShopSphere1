import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShopService } from '../services/shop.service';
import { IconComponent } from '../components/icon/icon.component';

@Component({
  selector: 'app-bag',
  standalone: true,
  templateUrl: './bag.page.html',
  styleUrls: ['./bag.page.scss'],
  imports: [CommonModule, FormsModule, IconComponent]
})
export class BagPage {
  readonly shop = inject(ShopService);

  promoInput = '';
  promoFeedback = signal<string>('');
  promoSuccess = signal<boolean>(false);

  progressPercentage = () => {
    const sub = this.shop.subtotal();
    return Math.min(100, Math.round((sub / 150) * 100));
  };

  shippingProgressText = () => {
    const sub = this.shop.subtotal();
    if (sub >= 150) return 'Qualified for Free Carbon-Neutral Delivery!';
    return `Add $${150 - sub} more for Free Delivery`;
  };

  applyPromoCode() {
    if (!this.promoInput) return;
    const res = this.shop.applyPromo(this.promoInput);
    this.promoFeedback.set(res.message);
    this.promoSuccess.set(res.success);
    if (res.success) {
      this.promoInput = '';
    }
  }

  proceedToCheckout() {
    if (!this.shop.currentUser()) {
      this.shop.promptAuthRequired('Please sign in or create an account to proceed to checkout.');
      return;
    }
    this.shop.navigateTo('checkout');
  }
}
