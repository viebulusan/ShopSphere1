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
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Home & Living',
      count: '6',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Workspace',
      count: '5',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Timepieces',
      count: '3',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'
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
