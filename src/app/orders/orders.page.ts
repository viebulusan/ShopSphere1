import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from '../services/shop.service';
import { IconComponent } from '../components/icon/icon.component';
import { Order, CartItem } from '../models/shop.models';

@Component({
  selector: 'app-orders',
  standalone: true,
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  imports: [CommonModule, FormsModule, IconComponent]
})
export class OrdersPage implements OnInit {
  readonly shop = inject(ShopService);
  private readonly route = inject(ActivatedRoute);

  viewMode = signal<'list' | 'detail'>('list');
  filterTab = signal<string>(this.shop.ordersFilterTab());
  currentOrder = signal<Order | null>(null);

  isReviewModalOpen = signal(false);
  reviewingOrder = signal<Order | null>(null);
  reviewingItem = signal<CartItem | null>(null);
  reviewRating = signal<number>(0);
  hoverRating = signal<number>(0);
  reviewTitle = signal<string>('');
  reviewComment = signal<string>('');
  selectedTags = signal<string[]>([]);
  isSubmittingReview = signal(false);
  reviewSubmitted = signal(false);

  canSubmitReview = computed(() => {
    return this.reviewRating() > 0 && !this.isSubmittingReview();
  });

  readonly availableTags = [
    'Superb Quality',
    'Fast Shipping',
    'True to Pictures',
    'Premium Materials',
    'Exquisite Design',
    'Highly Recommended'
  ];

  ngOnInit() {
    if (this.shop.ordersFilterTab()) {
      this.filterTab.set(this.shop.ordersFilterTab());
    }

    this.route.queryParamMap.subscribe(params => {
      const tab = params.get('tab');
      if (tab && ['All', 'Active', 'Delivered'].includes(tab)) {
        this.filterTab.set(tab);
        this.shop.ordersFilterTab.set(tab);
      }
    });

    this.route.paramMap.subscribe(params => {
      const orderId = params.get('id');
      if (orderId) {
        const found = this.shop.orders().find(o => o.id === orderId);
        if (found) {
          this.currentOrder.set(found);
          this.viewMode.set('detail');
          return;
        }
      }
      
      if (this.shop.activeScreen() === 'order-details' && this.shop.selectedOrder()) {
        this.currentOrder.set(this.shop.selectedOrder());
        this.viewMode.set('detail');
      } else {
        this.viewMode.set('list');
      }
    });
  }

  setTab(tab: string) {
    this.filterTab.set(tab);
    this.shop.ordersFilterTab.set(tab);
  }

  filteredOrders = () => {
    if (!this.shop.currentUser()) {
      return [];
    }
    const tab = this.filterTab();
    const all = this.shop.orders();
    if (tab === 'Active') {
      return all.filter(o => o.status !== 'delivered');
    }
    if (tab === 'Delivered') {
      return all.filter(o => o.status === 'delivered');
    }
    return all;
  };

  viewOrder(ord: Order) {
    this.currentOrder.set(ord);
    this.viewMode.set('detail');
    this.shop.openOrderDetails(ord);
  }

  showList() {
    this.viewMode.set('list');
    this.currentOrder.set(null);
    this.shop.navigateTo('orders');
  }

  openReviewModal(order: Order, item: CartItem) {
    this.reviewingOrder.set(order);
    this.reviewingItem.set(item);
    this.reviewRating.set(0);
    this.hoverRating.set(0);
    this.reviewTitle.set('');
    this.reviewComment.set('');
    this.selectedTags.set([]);
    this.reviewSubmitted.set(false);
    this.isSubmittingReview.set(false);
    this.isReviewModalOpen.set(true);
  }

  closeReviewModal() {
    this.isReviewModalOpen.set(false);
    this.reviewingOrder.set(null);
    this.reviewingItem.set(null);
    this.reviewSubmitted.set(false);
    this.isSubmittingReview.set(false);
  }

  toggleTag(tag: string) {
    const current = this.selectedTags();
    if (current.includes(tag)) {
      this.selectedTags.set(current.filter(t => t !== tag));
    } else {
      this.selectedTags.set([...current, tag]);
    }
  }

  setReviewRating(star: number) {
    this.reviewRating.set(star);
    this.hoverRating.set(0);
  }

  onStarHover(star: number) {
    this.hoverRating.set(star);
  }

  onStarLeave() {
    this.hoverRating.set(0);
  }

  getRatingLabel(r: number): string {
    switch (r) {
      case 5: return '5.0 • Outstanding — Exceeded expectations';
      case 4: return '4.0 • Very Good — High quality & craft';
      case 3: return '3.0 • Satisfactory — Meets expectations';
      case 2: return '2.0 • Fair — Room for improvement';
      case 1: return '1.0 • Poor — Did not meet expectations';
      default: return 'Tap a star to set your rating';
    }
  }

  getUnreviewedItem(ord: Order): CartItem | undefined {
    return ord.items.find(i => !this.shop.isItemReviewed(ord.id, i.product.id));
  }

  submitReview() {
    const item = this.reviewingItem();
    const ord = this.reviewingOrder();
    if (!item || !ord || this.reviewRating() <= 0) return;

    this.isSubmittingReview.set(true);

    setTimeout(() => {
      this.shop.addReview({
        productId: item.product.id,
        orderId: ord.id,
        orderNumber: ord.orderNumber,
        rating: this.reviewRating(),
        title: this.reviewTitle().trim(),
        comment: this.reviewComment().trim(),
        tags: this.selectedTags()
      });

      this.isSubmittingReview.set(false);
      this.reviewSubmitted.set(true);
      this.reviewTitle.set('');
      this.reviewComment.set('');
      this.reviewRating.set(0);

      setTimeout(() => {
        this.closeReviewModal();
      }, 1400);
    }, 400);
  }
}
