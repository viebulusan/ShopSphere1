import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService } from '../services/shop.service';
import { IconComponent } from '../components/icon/icon.component';
import { AppNotification } from '../models/shop.models';

@Component({
  selector: 'app-notifications',
  standalone: true,
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  imports: [CommonModule, IconComponent]
})
export class NotificationsPage {
  readonly shop = inject(ShopService);

  activeFilter = signal<string>('All');

  filteredNotifications = () => {
    const list = this.shop.notifications();
    const f = this.activeFilter();
    if (f === 'Orders') {
      return list.filter(n => n.type === 'order');
    }
    if (f === 'Promos') {
      return list.filter(n => n.type === 'promo');
    }
    return list;
  };

  handleNotificationClick(notif: AppNotification) {
    notif.read = true;
    if (notif.type === 'order') {
      this.shop.navigateTo('orders');
    } else {
      this.shop.navigateTo('discover');
    }
  }
}
