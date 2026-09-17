import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './components/navbar/navbar.component';
import { TabBarComponent } from './components/tabbar/tabbar.component';
import { ShopService } from './services/shop.service';
import { ScreenType } from './models/shop.models';

import { IconComponent } from './components/icon/icon.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [CommonModule, RouterOutlet, NavBarComponent, TabBarComponent, IconComponent],
})
export class AppComponent {
  readonly shop = inject(ShopService);

  shouldShowNavbar(): boolean {
    const hiddenScreens: ScreenType[] = [
      'login',
      'signup',
      'reset-password',
      'code-verification'
    ];
    if (hiddenScreens.includes(this.shop.activeScreen())) {
      return false;
    }
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    if (path.includes('/login') || path.includes('/signup') || path.includes('/forgot') || path.includes('/reset')) {
      return false;
    }
    return true;
  }

  shouldShowTabBar(): boolean {
    const hiddenScreens: ScreenType[] = [
      'checkout',
      'done',
      'login',
      'signup',
      'reset-password',
      'code-verification',
      'network-error',
      'product-detail'
    ];
    if (hiddenScreens.includes(this.shop.activeScreen())) {
      return false;
    }
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    if (path.includes('/login') || path.includes('/signup') || path.includes('/forgot') || path.includes('/reset')) {
      return false;
    }
    return !hiddenScreens.includes(this.shop.activeScreen());
  }
}
