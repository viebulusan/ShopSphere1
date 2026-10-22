import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  private readonly router = inject(Router);

  isRetrying = signal(false);
  retrySuccess = signal(false);

  retryConnection() {
    this.isRetrying.set(true);
    this.retrySuccess.set(false);
    setTimeout(() => {
      this.isRetrying.set(false);
      this.retrySuccess.set(true);
      setTimeout(() => {
        this.shop.navigateTo('home');
      }, 600);
    }, 1200);
  }

  goToScreen(path: string) {
    this.router.navigateByUrl(path);
  }
}
