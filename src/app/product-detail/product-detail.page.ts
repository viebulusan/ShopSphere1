import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from '../services/shop.service';
import { IconComponent } from '../components/icon/icon.component';
import { ProductCardComponent } from '../components/product-card/product-card.component';
import { Product, ProductColor, Order } from '../models/shop.models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
  imports: [CommonModule, FormsModule, IconComponent, ProductCardComponent]
})
export class ProductDetailPage implements OnInit, OnDestroy {
  readonly shop = inject(ShopService);
  private readonly route = inject(ActivatedRoute);

  product = computed(() => {
    const fromShop = this.shop.selectedProduct();
    if (fromShop) return fromShop;
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.shop.products().find(p => p.id === id);
      if (found) return found;
    }
    return this.shop.products()[0];
  });

  activeImageIndex = signal(0);
  activeImage = computed(() => {
    const p = this.product();
    if (!p) return '';
    return p.gallery[this.activeImageIndex()] || p.image;
  });

  selectedColor = signal<ProductColor>(this.product()?.colors[0] || { name: 'Deep Forest', hex: '#1D4533' });
  selectedSize = signal<string>(this.product()?.sizes[0] || 'Standard');
  quantity = signal<number>(1);
  Math = Math;

  relatedProducts = computed(() => {
    const current = this.product();
    return this.shop.products().filter(p => p.id !== current?.id).slice(0, 4);
  });

  deliveredOrder = computed<Order | null>(() => {
    const p = this.product();
    if (!p) return null;
    return this.shop.orders().find(o => 
      o.status === 'delivered' && o.items.some(i => i.product.id === p.id)
    ) || null;
  });

  isDeliveredBuyer = computed<boolean>(() => {
    return this.deliveredOrder() !== null;
  });

  isAlreadyReviewed = computed<boolean>(() => {
    const p = this.product();
    const ord = this.deliveredOrder();
    if (!p || !ord) return false;
    return this.shop.isItemReviewed(ord.id, p.id);
  });

  isDeliveryDropdownOpen = signal(false);

  toggleDeliveryDropdown() {
    this.isDeliveryDropdownOpen.update(v => !v);
  }

  private galleryTimer: any = null;
  private isGalleryPaused = false;

  ngOnInit() {
    this.startGalleryAutoPlay();
  }

  ngOnDestroy() {
    this.stopGalleryAutoPlay();
  }

  private startGalleryAutoPlay() {
    this.stopGalleryAutoPlay();
    this.galleryTimer = setInterval(() => {
      if (!this.isGalleryPaused) {
        const p = this.product();
        if (p && p.gallery.length > 1) {
          this.activeImageIndex.update(idx => (idx + 1) % p.gallery.length);
        }
      }
    }, 4000);
  }

  private stopGalleryAutoPlay() {
    if (this.galleryTimer) {
      clearInterval(this.galleryTimer);
      this.galleryTimer = null;
    }
  }

  pauseGalleryAutoPlay() {
    this.isGalleryPaused = true;
  }

  resumeGalleryAutoPlay() {
    this.isGalleryPaused = false;
  }

  setActiveImage(img: string, idx: number) {
    this.activeImageIndex.set(idx);
    this.isGalleryPaused = true;
    setTimeout(() => {
      this.isGalleryPaused = false;
    }, 5000);
  }

  incrementQty() {
    this.quantity.update(q => q + 1);
  }

  decrementQty() {
    this.quantity.update(q => Math.max(1, q - 1));
  }

  addToBag() {
    const p = this.product();
    if (!p) return;
    const added = this.shop.addToCart(p, this.selectedColor(), this.selectedSize(), this.quantity());
    if (added) {
      this.shop.navigateTo('bag');
    }
  }

  buyNow() {
    const p = this.product();
    if (!p) return;
    if (!this.shop.currentUser()) {
      this.shop.promptAuthRequired('Please sign in or create an account to proceed to checkout.');
      return;
    }
    const added = this.shop.addToCart(p, this.selectedColor(), this.selectedSize(), this.quantity());
    if (added) {
      this.shop.navigateTo('checkout');
    }
  }

  shareProduct() {
    if (navigator.share && this.product()) {
      navigator.share({
        title: this.product()?.title,
        text: this.product()?.subtitle,
        url: window.location.href
      }).catch(() => {});
    }
  }

  isReviewModalOpen = signal(false);
  reviewRating = signal(0);
  hoverRating = signal(0);
  reviewTitle = signal('');
  reviewComment = signal('');
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

  openWriteReviewModal(p: Product, ord?: Order | null) {
    const targetOrder = ord || this.deliveredOrder();
    if (!targetOrder) {
      alert('Only customers who have ordered and received this product can submit a review.');
      return;
    }
    this.reviewRating.set(0);
    this.hoverRating.set(0);
    this.reviewTitle.set('');
    this.reviewComment.set('');
    this.selectedTags.set([]);
    this.reviewSubmitted.set(false);
    this.isSubmittingReview.set(false);
    this.isReviewModalOpen.set(true);
  }

  closeWriteReviewModal() {
    this.isReviewModalOpen.set(false);
    this.reviewSubmitted.set(false);
    this.isSubmittingReview.set(false);
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

  toggleReviewTag(tag: string) {
    const current = this.selectedTags();
    if (current.includes(tag)) {
      this.selectedTags.set(current.filter(t => t !== tag));
    } else {
      this.selectedTags.set([...current, tag]);
    }
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

  submitProductReview() {
    const p = this.product();
    const ord = this.deliveredOrder();
    if (!p || !ord || this.reviewRating() <= 0) return;

    this.isSubmittingReview.set(true);

    setTimeout(() => {
      this.shop.addReview({
        productId: p.id,
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
        this.closeWriteReviewModal();
      }, 1400);
    }, 400);
  }
}
