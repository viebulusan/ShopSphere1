import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService } from '../services/shop.service';
import { IconComponent } from '../components/icon/icon.component';

@Component({
  selector: 'app-network-error',
  standalone: true,
  templateUrl: './network-error.page.html',
  styleUrls: ['./network-error.page.scss'],
  imports: [CommonModule, IconComponent]
})
export class NetworkErrorPage {
  readonly shop = inject(ShopService);
  isRetrying = signal(false);

  retryConnection() {
    this.isRetrying.set(true);
    setTimeout(() => {
      this.isRetrying.set(false);
      this.shop.navigateTo('home');
    }, 1000);
  }
}
