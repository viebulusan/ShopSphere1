import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShopService } from '../services/shop.service';
import { ProductCardComponent } from '../components/product-card/product-card.component';
import { IconComponent } from '../components/icon/icon.component';
import { Product } from '../models/shop.models';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [CommonModule, FormsModule, ProductCardComponent, IconComponent]
})
export class HomePage implements OnInit, OnDestroy {
  readonly shop = inject(ShopService);

  searchQuery = '';
  isSearchFocused = signal(false);
  
  trackIndex = signal(1);
  isDragging = signal(false);
  dragOffset = signal(0);
  disableTransition = signal(false);
  isTransitioning = signal(false);
  progressWidth = signal(0);

  private progressInterval: any = null;
  private transitionSafetyTimer: any = null;
  private isPaused = false;
  private didDrag = false;

  private touchStartX = 0;
  private touchStartY = 0;
  private touchStartTime = 0;
  private isSwipingHorizontal = false;
  private touchDirectionDetermined = false;
  private mouseStartX = 0;
  private mouseStartTime = 0;
  private isMouseDown = false;

  readonly heroBanners = [
    {
      id: 'banner-audio',
      tag: 'New Spatial Audio',
      title: 'Sphera One in Forest Pine',
      description: 'Custom acoustic dynamic drivers with personalized spatial tracking.',
      productId: 'sp-1',
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
      gradient: 'linear-gradient(135deg, #1D4533 0%, #132E22 100%)',
      orb1: '#F9D2BA',
      orb2: '#5E3122',
      badgeBg: '#F9D2BA',
      badgeColor: '#5E3122'
    },
    {
      id: 'banner-kettle',
      tag: 'Terracotta Artisan',
      title: 'Earthenware Pour-Over Kettle',
      description: 'Precision to-the-degree thermal extraction with solid walnut handle.',
      productId: 'sp-2',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
      gradient: 'linear-gradient(135deg, #5E3122 0%, #3B1F16 100%)',
      orb1: '#F9D2BA',
      orb2: '#1D4533',
      badgeBg: '#F9D2BA',
      badgeColor: '#5E3122'
    },
    {
      id: 'banner-folio',
      tag: 'Handcrafted Heritage',
      title: 'Tuscan Vegetable Leather Folio',
      description: 'Designed specifically for MacBook Pro with concealed MagSafe slot.',
      productId: 'sp-3',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
      gradient: 'linear-gradient(135deg, #2D3E33 0%, #1A2820 100%)',
      orb1: '#F7EAE0',
      orb2: '#5E3122',
      badgeBg: '#F7EAE0',
      badgeColor: '#1D4533'
    }
  ];

  readonly trackBanners = [
    { ...this.heroBanners[2], cloneKey: 'clone-prev-folio' },
    { ...this.heroBanners[0], cloneKey: 'item-audio' },
    { ...this.heroBanners[1], cloneKey: 'item-kettle' },
    { ...this.heroBanners[2], cloneKey: 'item-folio' },
    { ...this.heroBanners[0], cloneKey: 'clone-next-audio' }
  ];

  activeHeroIndex = computed(() => {
    const idx = this.trackIndex();
    if (idx <= 0) return 2;
    if (idx >= 4) return 0;
    return idx - 1;
  });

  activeHero = () => this.heroBanners[this.activeHeroIndex()];

  liveMatchingProducts = computed(() => {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return [];
    return this.shop.products().filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  ngOnInit() {
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
    if (this.transitionSafetyTimer) {
      clearTimeout(this.transitionSafetyTimer);
    }
  }

  private startAutoPlay() {
    this.stopAutoPlay();
    const duration = 4000;
    const stepTime = 50;
    const increment = (stepTime / duration) * 100;

    this.progressInterval = setInterval(() => {
      if (!this.isPaused && !this.isDragging()) {
        const nextVal = this.progressWidth() + increment;
        if (nextVal >= 100) {
          this.progressWidth.set(0);
          this.nextSlide();
        } else {
          this.progressWidth.set(nextVal);
        }
      }
    }, stepTime);
  }

  private stopAutoPlay() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  pauseAutoPlay() {
    this.isPaused = true;
  }

  resumeAutoPlay() {
    this.isPaused = false;
  }

  getTrackTransform(): string {
    const basePercent = -this.trackIndex() * 100;
    const offset = this.dragOffset();
    if (offset !== 0) {
      return `translateX(calc(${basePercent}% + ${offset}px))`;
    }
    return `translateX(${basePercent}%)`;
  }

  getTrackTransition(): string {
    if (this.isDragging() || this.disableTransition()) {
      return 'none';
    }
    return 'transform 0.42s cubic-bezier(0.25, 1, 0.5, 1)';
  }

  private triggerSlideTransition(newTrackIndex: number) {
    this.isTransitioning.set(true);
    this.trackIndex.set(newTrackIndex);
    this.dragOffset.set(0);
    this.progressWidth.set(0);

    if (this.transitionSafetyTimer) {
      clearTimeout(this.transitionSafetyTimer);
    }
    this.transitionSafetyTimer = setTimeout(() => {
      this.onTransitionEnd();
    }, 500);
  }

  nextSlide() {
    if (this.isTransitioning()) return;
    this.triggerSlideTransition(this.trackIndex() + 1);
  }

  prevSlide() {
    if (this.isTransitioning()) return;
    this.triggerSlideTransition(this.trackIndex() - 1);
  }

  setHeroIndex(idx: number) {
    if (this.isTransitioning()) return;
    this.triggerSlideTransition(idx + 1);
  }

  onTransitionEnd() {
    if (this.transitionSafetyTimer) {
      clearTimeout(this.transitionSafetyTimer);
      this.transitionSafetyTimer = null;
    }

    if (this.trackIndex() >= 4) {
      this.disableTransition.set(true);
      this.trackIndex.set(1);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.disableTransition.set(false);
          this.isTransitioning.set(false);
        });
      });
    } else if (this.trackIndex() <= 0) {
      this.disableTransition.set(true);
      this.trackIndex.set(3);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.disableTransition.set(false);
          this.isTransitioning.set(false);
        });
      });
    } else {
      this.isTransitioning.set(false);
    }
  }

  onTouchStart(e: TouchEvent) {
    this.pauseAutoPlay();
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.touchStartTime = Date.now();
    this.isSwipingHorizontal = false;
    this.touchDirectionDetermined = false;
    this.didDrag = false;
    this.dragOffset.set(0);
  }

  onTouchMove(e: TouchEvent) {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const diffX = touch.clientX - this.touchStartX;
    const diffY = touch.clientY - this.touchStartY;

    if (!this.touchDirectionDetermined) {
      if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
        this.touchDirectionDetermined = true;
        if (Math.abs(diffX) > Math.abs(diffY)) {
          this.isSwipingHorizontal = true;
          this.isDragging.set(true);
        } else {
          this.isSwipingHorizontal = false;
        }
      }
    }

    if (this.isSwipingHorizontal) {
      this.didDrag = true;
      if (e.cancelable) {
        e.preventDefault();
      }
      this.dragOffset.set(diffX);
    }
  }

  onTouchEnd() {
    if (this.isSwipingHorizontal) {
      const diffX = this.dragOffset();
      const elapsed = Date.now() - this.touchStartTime;
      const velocity = Math.abs(diffX) / (elapsed || 1);

      this.isDragging.set(false);

      if (diffX < -35 || (diffX < -15 && velocity > 0.3)) {
        this.nextSlide();
      } else if (diffX > 35 || (diffX > 15 && velocity > 0.3)) {
        this.prevSlide();
      } else {
        this.dragOffset.set(0);
      }
    } else {
      this.isDragging.set(false);
      this.dragOffset.set(0);
    }

    this.resumeAutoPlay();
    setTimeout(() => {
      this.didDrag = false;
    }, 120);
  }

  onTouchCancel() {
    this.isDragging.set(false);
    this.dragOffset.set(0);
    this.isSwipingHorizontal = false;
    this.resumeAutoPlay();
    setTimeout(() => {
      this.didDrag = false;
    }, 120);
  }

  onMouseDown(e: MouseEvent) {
    if (e.button !== 0) return;
    this.pauseAutoPlay();
    this.isMouseDown = true;
    this.mouseStartX = e.clientX;
    this.mouseStartTime = Date.now();
    this.didDrag = false;
    this.dragOffset.set(0);
  }

  onMouseMove(e: MouseEvent) {
    if (!this.isMouseDown) return;
    const diffX = e.clientX - this.mouseStartX;
    if (Math.abs(diffX) > 6) {
      this.didDrag = true;
      this.isDragging.set(true);
      this.dragOffset.set(diffX);
    }
  }

  onMouseUp() {
    if (!this.isMouseDown) return;
    this.isMouseDown = false;
    const diffX = this.dragOffset();
    const elapsed = Date.now() - this.mouseStartTime;
    const velocity = Math.abs(diffX) / (elapsed || 1);

    this.isDragging.set(false);

    if (diffX < -35 || (diffX < -15 && velocity > 0.3)) {
      this.nextSlide();
    } else if (diffX > 35 || (diffX > 15 && velocity > 0.3)) {
      this.prevSlide();
    } else {
      this.dragOffset.set(0);
    }

    this.resumeAutoPlay();
    setTimeout(() => {
      this.didDrag = false;
    }, 120);
  }

  onMouseLeave() {
    if (this.isMouseDown) {
      this.onMouseUp();
    } else {
      this.resumeAutoPlay();
    }
  }

  onHeroClick(hero: any) {
    if (this.didDrag) return;
    this.onHeroAction(hero);
  }

  onHeroAction(hero?: any) {
    if (this.didDrag) return;
    const target = hero || this.activeHero();
    const p = this.shop.products().find(i => i.id === target.productId);
    if (p) {
      this.shop.openProductDetail(p);
    } else {
      this.shop.navigateTo('discover');
    }
  }

  selectCategory(category: string) {
    this.shop.selectedCategory.set(category);
  }

  onSearchChange() {
    this.shop.searchQuery.set(this.searchQuery);
  }

  clearSearch() {
    this.searchQuery = '';
    this.shop.searchQuery.set('');
    this.isSearchFocused.set(false);
  }

  selectLiveItem(p: Product) {
    this.isSearchFocused.set(false);
    this.shop.openProductDetail(p);
  }
}
