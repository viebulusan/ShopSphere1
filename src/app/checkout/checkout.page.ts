import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService } from '../services/shop.service';
import { IconComponent } from '../components/icon/icon.component';
import { Address, PaymentMethod } from '../models/shop.models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  imports: [CommonModule, IconComponent]
})
export class CheckoutPage {
  readonly shop = inject(ShopService);

  selectedAddress = signal<Address>(this.shop.addresses()[0]);
  selectedPayment = signal<PaymentMethod>(this.shop.paymentMethods()[0]);
  shippingMethod = signal<'standard' | 'express'>('standard');
  isSubmitting = signal(false);

  finalTotal = () => {
    let total = this.shop.orderTotal();
    if (this.shippingMethod() === 'express') {
      total += 18;
    }
    return total;
  };

  confirmOrder() {
    this.isSubmitting.set(true);
    setTimeout(() => {
      this.shop.placeOrder(this.selectedAddress(), this.selectedPayment());
      this.isSubmitting.set(false);
    }, 850);
  }
}
