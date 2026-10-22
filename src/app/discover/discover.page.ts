import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShopService } from '../services/shop.service';
import { ProductCardComponent } from '../components/product-card/product-card.component';
import { IconComponent } from '../components/icon/icon.component';
import { Product } from '../models/shop.models';

@Component({
  selector: 'app-discover',
  standalone: true,
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
  imports: [CommonModule, FormsModule, ProductCardComponent, IconComponent]
})
export class DiscoverPage {
  readonly shop = inject(ShopService);

  searchQuery = '';
  readonly sortBy = signal<string>('featured');
  onlyNew = signal(false);
  onlyTrending = signal(false);
  isSearchFocused = signal(false);

  isFilterMenuOpen = signal(false);

  readonly sortMenuOptions = [
    { id: 'featured', label: 'Featured' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
    { id: 'rating', label: 'Top Customer Rating' }
  ];

  hasActiveFilter = computed(() => {
    return this.onlyNew() || this.onlyTrending() || this.sortBy() !== 'featured';
  });

  selectSort(sortId: string) {
    this.sortBy.set(sortId);
    this.isFilterMenuOpen.set(false);
  }

  readonly categoryTiles = [
    {
      name: 'Audio',
      count: '4',
      image: 'assets/images/categories/cat-audio.jpg'
    },
    {
      name: 'Home & Living',
      count: '6',
      image: 'assets/images/categories/cat-living.jpg'
    },
    {
      name: 'Workspace',
      count: '5',
      image: 'assets/images/categories/cat-workspace.jpg'
    },
    {
      name: 'Timepieces',
      count: '3',
      image: 'assets/images/categories/cat-timepieces.jpg'
    }
  ];

  liveSuggestions = computed(() => {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return [];
    return this.shop.products().filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  selectCategory(cat: string) {
    if (this.shop.selectedCategory() === cat) {
      this.shop.selectedCategory.set('All');
    } else {
      this.shop.selectedCategory.set(cat);
    }
  }

  toggleOnlyNew() {
    this.onlyNew.update(v => !v);
  }

  toggleOnlyTrending() {
    this.onlyTrending.update(v => !v);
  }

  onSearchChange() {
    this.shop.searchQuery.set(this.searchQuery);
  }

  clearSearch() {
    this.searchQuery = '';
    this.shop.searchQuery.set('');
    this.isSearchFocused.set(false);
  }

  selectItem(p: Product) {
    this.isSearchFocused.set(false);
    this.shop.openProductDetail(p);
  }

  resetAllFilters() {
    this.shop.selectedCategory.set('All');
    this.searchQuery = '';
    this.shop.searchQuery.set('');
    this.onlyNew.set(false);
    this.onlyTrending.set(false);
    this.sortBy.set('featured');
    this.isSearchFocused.set(false);
  }

  displayedProducts = computed(() => {
    let list = [...this.shop.filteredProducts()];
    
    if (this.onlyNew()) {
      list = list.filter(p => p.isNew);
    }
    if (this.onlyTrending()) {
      list = list.filter(p => p.isTrending);
    }

    const sort = this.sortBy();
    if (sort === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  });
}
