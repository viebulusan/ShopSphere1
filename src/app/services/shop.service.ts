import { Injectable, signal, computed, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { 
  Product, 
  CartItem, 
  Order, 
  Address, 
  PaymentMethod, 
  AppNotification, 
  UserProfile, 
  ScreenType,
  ProductColor,
  ProductReview
} from '../models/shop.models';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private readonly router = inject(Router);

  readonly activeScreen = signal<ScreenType>('home');
  readonly previousScreen = signal<ScreenType>('home');

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('shopsphere_theme');
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      } catch (e) {}
    }
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.syncScreenFromUrl(event.urlAfterRedirects || event.url);
      }
    });
    if (typeof window !== 'undefined' && window.location && window.location.pathname) {
      this.syncScreenFromUrl(window.location.pathname);
    }
  }

  private syncScreenFromUrl(url: string) {
    const cleanUrl = url.split('?')[0].split('#')[0];
    if (cleanUrl.startsWith('/discover')) {
      this.activeScreen.set('discover');
    } else if (cleanUrl.startsWith('/product')) {
      this.activeScreen.set('product-detail');
      const parts = cleanUrl.split('/');
      if (parts[2]) {
        const prod = this.products().find(p => p.id === parts[2]);
        if (prod) this.selectedProduct.set(prod);
      }
    } else if (cleanUrl.startsWith('/cart') || cleanUrl.startsWith('/bag')) {
      this.activeScreen.set('cart');
    } else if (cleanUrl.startsWith('/checkout')) {
      this.activeScreen.set('checkout');
    } else if (cleanUrl.startsWith('/order-confirmed') || cleanUrl.startsWith('/done')) {
      this.activeScreen.set('done');
    } else if (cleanUrl.startsWith('/orders/') && cleanUrl.length > 8) {
      this.activeScreen.set('order-details');
      const parts = cleanUrl.split('/');
      if (parts[2]) {
        const ord = this.orders().find(o => o.id === parts[2]);
        if (ord) this.selectedOrder.set(ord);
      }
    } else if (cleanUrl.startsWith('/orders')) {
      this.activeScreen.set('orders');
    } else if (cleanUrl.startsWith('/wishlist')) {
      this.activeScreen.set('wishlist');
    } else if (cleanUrl.startsWith('/notifications')) {
      this.activeScreen.set('notifications');
    } else if (cleanUrl.startsWith('/addresses')) {
      this.activeScreen.set('saved-addresses');
    } else if (cleanUrl.startsWith('/payments')) {
      this.activeScreen.set('saved-payments');
    } else if (cleanUrl.startsWith('/profile')) {
      this.activeScreen.set('profile');
    } else if (cleanUrl.startsWith('/login')) {
      this.activeScreen.set('login');
    } else if (cleanUrl.startsWith('/signup')) {
      this.activeScreen.set('signup');
    } else if (cleanUrl.startsWith('/forgot') || cleanUrl.startsWith('/reset-password')) {
      this.activeScreen.set('reset-password');
    } else if (cleanUrl.startsWith('/error') || cleanUrl.startsWith('/network-error')) {
      this.activeScreen.set('network-error');
    } else {
      this.activeScreen.set('home');
    }
  }

  readonly selectedProduct = signal<Product | null>(null);
  readonly selectedOrder = signal<Order | null>(null);
  readonly selectedCategory = signal<string>('All');
  readonly searchQuery = signal<string>('');

  readonly products = signal<Product[]>([
    {
      id: 'sp-1',
      title: 'Sphera One Spatial Headphones',
      subtitle: 'Lossless spatial audio with anodized forest green aluminum',
      price: 349,
      originalPrice: 399,
      rating: 4.9,
      reviewsCount: 142,
      category: 'Audio',
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80'
      ],
      colors: [
        { name: 'Forest Green', hex: '#1D4533' },
        { name: 'Warm Cream', hex: '#F7EAE0' },
        { name: 'Deep Terracotta', hex: '#5E3122' }
      ],
      sizes: ['Standard', 'Studio Fit'],
      description: 'Engineered with custom neodymium dynamic drivers and adaptive transparency. Precision milled aluminum ear cups paired with breathable woven mesh for all-day comfort.',
      features: [
        'Spatial Audio with dynamic head tracking',
        '32-hour battery life with Fast Fuel charge',
        'Dual beamforming microphones for crystal clear calls',
        'Apple H2 audio silicon compatible'
      ],
      inStock: true,
      isNew: true,
      isTrending: true,
      badge: 'Bestseller',
      reviews: [
        {
          id: 'rev-1',
          productId: 'sp-1',
          author: 'Marcus K.',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
          verifiedBuyer: true,
          rating: 5,
          date: 'Sep 02, 2026',
          title: 'Unmatched acoustic depth & craftsmanship',
          comment: 'Exceeded every expectation. The weight, tactile finish, and spatial imaging match high-end design studio standards. The aluminum ear cups feel cool and premium.',
          tags: ['Immersive Sound', 'Artisan Finish', 'All-Day Comfort']
        },
        {
          id: 'rev-2',
          productId: 'sp-1',
          author: 'Elena P.',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
          verifiedBuyer: true,
          rating: 5,
          date: 'Aug 28, 2026',
          title: 'Sublime unboxing and battery longevity',
          comment: 'The unboxing experience was sublime. Delivered in 2 days in beautiful recyclable packaging. Battery easily lasts through multiple workdays without recharging.',
          tags: ['Fast Delivery', 'Great Battery']
        }
      ]
    },
    {
      id: 'sp-2',
      title: 'Terracotta Gooseneck Kettle',
      subtitle: 'Artisanal precision pour-over electric kettle',
      price: 139,
      originalPrice: 160,
      rating: 4.8,
      reviewsCount: 89,
      category: 'Home & Living',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
      ],
      colors: [
        { name: 'Terracotta Red', hex: '#5E3122' },
        { name: 'Warm Cream', hex: '#F7EAE0' },
        { name: 'Forest Shadow', hex: '#1D4533' }
      ],
      sizes: ['0.9 Liters', '1.2 Liters'],
      description: 'Counterbalanced handle paired with an elongated fluted spout yields the ultimate control for specialized coffee and tea extractions.',
      features: [
        'Variable to-the-degree temperature control (135°F - 212°F)',
        'LCD ambient screen with live temp display',
        '60-minute temperature hold mode',
        'Natural solid walnut wooden accents'
      ],
      inStock: true,
      isTrending: true,
      badge: 'Design Award',
      reviews: [
        {
          id: 'rev-3',
          productId: 'sp-2',
          author: 'David L.',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          verifiedBuyer: true,
          rating: 5,
          date: 'Sep 06, 2026',
          title: 'The flow control is unmatched',
          comment: 'The fluted gooseneck spout provides perfect laminar flow for V60 pour-overs. The terracotta matte finish is gorgeous on the counter.',
          tags: ['Precision Pour', 'Counter Aesthetic']
        }
      ]
    },
    {
      id: 'sp-3',
      title: 'Minimalist Vegetable Leather Folio',
      subtitle: 'Hand-stitched Italian leather with magnetic snap closure',
      price: 260,
      rating: 4.9,
      reviewsCount: 64,
      category: 'Workspace',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'
      ],
      colors: [
        { name: 'Forest Green', hex: '#1D4533' },
        { name: 'Warm Cream', hex: '#F7EAE0' },
        { name: 'Soft Peach', hex: '#F9D2BA' }
      ],
      sizes: ['14-inch Laptop', '16-inch Laptop'],
      description: 'Crafted from certified Tuscan vegetable-tanned leather that develops a rich, personal patina over time. Includes microfibre lining and MagSafe pen slot.',
      features: [
        'Fits MacBook Pro up to 16-inch',
        'Concealed RFID-blocking passport & card sleeve',
        'YKK Excella polished metal hardware',
        'Lifetime warranty on stitching and edge paint'
      ],
      inStock: true,
      isNew: true,
      reviews: [
        {
          id: 'rev-4',
          productId: 'sp-3',
          author: 'Sophia R.',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
          verifiedBuyer: true,
          rating: 5,
          date: 'Aug 19, 2026',
          title: 'Gorgeous Tuscan leather with amazing patina',
          comment: 'The scent of genuine Tuscan vegetable leather hit me immediately upon unboxing. Fits my 16-inch MacBook Pro like a bespoke glove.',
          tags: ['Genuine Leather', 'Snug Fit']
        }
      ]
    },
    {
      id: 'sp-4',
      title: 'Aura Ceramic Ambient Lamp',
      subtitle: 'Tactile touch dimmer with warm sunset spectrum LEDs',
      price: 175,
      originalPrice: 195,
      rating: 4.7,
      reviewsCount: 52,
      category: 'Home & Living',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80'
      ],
      colors: [
        { name: 'Warm Cream', hex: '#F7EAE0' },
        { name: 'Soft Peach', hex: '#F9D2BA' },
        { name: 'Deep Terracotta', hex: '#5E3122' }
      ],
      sizes: ['Compact 25cm', 'Standard 38cm'],
      description: 'Hand-thrown stoneware lamp base paired with a spun aluminum shade. Emits warm indirect light engineered to protect circadian rhythms.',
      features: [
        'Full spectrum 2200K - 3000K warm circadian LED',
        'Stepless touch-dimming disc on top',
        'Integrated Qi wireless charger at base',
        'Braided fabric cord with inline memory switch'
      ],
      inStock: true
    },
    {
      id: 'sp-5',
      title: 'Chronos Titanium Automatic Watch',
      subtitle: 'Swiss mechanical caliber encased in Grade 5 titanium',
      price: 520,
      originalPrice: 580,
      rating: 5.0,
      reviewsCount: 38,
      category: 'Timepieces',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'
      ],
      colors: [
        { name: 'Forest Anodized', hex: '#1D4533' },
        { name: 'Warm Cream', hex: '#F7EAE0' },
        { name: 'Terracotta Red', hex: '#5E3122' }
      ],
      sizes: ['38mm Case', '42mm Case'],
      description: 'Ultra-lightweight titanium timepiece with anti-reflective sapphire crystal and exhibition caseback revealing the 28,800 bph self-winding movement.',
      features: [
        '42-hour power reserve automatic caliber',
        '100m water resistance with screw-down crown',
        'Super-LumiNova hour indices',
        'Quick-release fluoroelastomer & Milanese bands'
      ],
      inStock: true,
      badge: 'Editor Pick'
    },
    {
      id: 'sp-6',
      title: 'Merino Cashmere Minimal Crew',
      subtitle: 'Grade A Mongolian cashmere and 17.5-micron merino wool',
      price: 195,
      rating: 4.8,
      reviewsCount: 110,
      category: 'Apparel',
      image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80'
      ],
      colors: [
        { name: 'Warm Cream', hex: '#F7EAE0' },
        { name: 'Forest Knit', hex: '#1D4533' },
        { name: 'Terracotta', hex: '#5E3122' }
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      description: 'Seamless whole-garment 3D knitting technology creates zero textile waste while offering a custom-tailored drape that resists pilling.',
      features: [
        'Thermoregulating and naturally odor-resistant',
        'Pre-washed and shrink-tested',
        'Ribbed collar, cuffs, and hem with reinforced spandex',
        'Sustainable OEKO-TEX certified dyes'
      ],
      inStock: true,
      isNew: true
    },
    {
      id: 'sp-7',
      title: 'Haptic Mechanical Numpad',
      subtitle: 'Wireless custom tactile keypad for creators & finance',
      price: 119,
      originalPrice: 140,
      rating: 4.9,
      reviewsCount: 95,
      category: 'Workspace',
      image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80'
      ],
      colors: [
        { name: 'Forest Anodized', hex: '#1D4533' },
        { name: 'Warm Cream', hex: '#F7EAE0' },
        { name: 'Soft Peach', hex: '#F9D2BA' }
      ],
      sizes: ['Tactile Browns', 'Smooth Linears'],
      description: 'Solid CNC milled aluminum unibody with sound-dampening silicone gasket mount. Bluetooth 5.2 + 2.4GHz + Type-C tri-mode connectivity.',
      features: [
        'Hot-swappable switch sockets',
        'Programmable rotary dial with haptic feedback',
        'Up to 3 months battery life per charge',
        'Native macOS & iOS calculator integration'
      ],
      inStock: true,
      badge: 'Limited Run'
    },
    {
      id: 'sp-8',
      title: 'Terra Earthenware Tasting Set',
      subtitle: 'Set of 4 double-walled ceramic cups & serving tray',
      price: 85,
      rating: 4.6,
      reviewsCount: 42,
      category: 'Home & Living',
      image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80'
      ],
      colors: [
        { name: 'Terracotta Clay', hex: '#5E3122' },
        { name: 'Forest Glaze', hex: '#1D4533' },
        { name: 'Warm Cream', hex: '#F7EAE0' }
      ],
      sizes: ['Set of 4 (180ml each)'],
      description: 'Double-walled earthenware insulates hot espresso or cold brew while staying comfortable to hold without a handle.',
      features: [
        'Microwave and dishwasher safe',
        'Lead-free food-safe matte glaze',
        'Stackable nesting geometry',
        'Includes solid bamboo coaster tray'
      ],
      inStock: true
    }
  ]);

  readonly categories = ['All', 'Audio', 'Workspace', 'Home & Living', 'Timepieces', 'Apparel'];

  readonly cart = signal<CartItem[]>([]);

  readonly wishlist = signal<Product[]>([
    this.products()[2],
    this.products()[4]
  ]);

  readonly appliedPromo = signal<{ code: string; percent: number } | null>({
    code: 'APPLE20',
    percent: 20
  });

  readonly addresses = signal<Address[]>([
    {
      id: 'addr-1',
      title: 'Home',
      recipientName: 'Alex Rivera',
      phone: '+1 (555) 389-1029',
      street: '742 Evergreen Terrace, Apt 4B',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107',
      country: 'United States',
      isDefault: true
    },
    {
      id: 'addr-2',
      title: 'Studio',
      recipientName: 'Alex Rivera',
      phone: '+1 (555) 441-9921',
      street: '100 Innovation Way, Suite 800',
      city: 'Cupertino',
      state: 'CA',
      zipCode: '95014',
      country: 'United States',
      isDefault: false
    }
  ]);

  readonly paymentMethods = signal<PaymentMethod[]>([
    {
      id: 'pm-1',
      type: 'card',
      cardholderName: 'Alex Rivera',
      last4: '4242',
      brand: 'visa',
      expiry: '09/28',
      isDefault: true
    },
    {
      id: 'pm-2',
      type: 'card',
      cardholderName: 'Alex Rivera',
      last4: '8831',
      brand: 'mastercard',
      expiry: '11/27',
      isDefault: false
    },
    {
      id: 'pm-3',
      type: 'paypal',
      cardholderName: 'Alex Rivera',
      brand: 'paypal',
      isDefault: false
    }
  ]);

  readonly orders = signal<Order[]>([
    {
      id: 'ord-100',
      orderNumber: 'SP-88194',
      date: 'Sep 04, 2026',
      status: 'delivered',
      items: [
        {
          cartItemId: 'ci-100',
          product: this.products()[0],
          selectedColor: this.products()[0].colors[0],
          selectedSize: 'Standard',
          quantity: 1
        },
        {
          cartItemId: 'ci-101',
          product: this.products()[1],
          selectedColor: this.products()[1].colors[0],
          selectedSize: '0.9 Liters',
          quantity: 1
        }
      ],
      subtotal: 488,
      shipping: 0,
      discount: 48.8,
      tax: 36.23,
      total: 475.43,
      address: {
        id: 'addr-1',
        title: 'Home',
        recipientName: 'Alex Rivera',
        phone: '+1 (555) 389-1029',
        street: '742 Evergreen Terrace, Apt 4B',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94107',
        country: 'United States',
        isDefault: true
      },
      paymentMethod: {
        id: 'pm-1',
        type: 'card',
        cardholderName: 'Alex Rivera',
        last4: '4242',
        brand: 'visa',
        expiry: '09/28',
        isDefault: true
      },
      estimatedDelivery: 'Delivered on Sep 07, 2026',
      timeline: [
        { title: 'Order Confirmed', date: 'Sep 04, 09:20 AM', completed: true, current: false, description: 'Order verified and authorized.' },
        { title: 'Packed & Sealed', date: 'Sep 05, 11:45 AM', completed: true, current: false, description: 'Crafted packaging sealed in warehouse.' },
        { title: 'In Transit', date: 'Sep 06, 08:30 AM', completed: true, current: false, description: 'Dispatched via FedEx Express.' },
        { title: 'Delivered', date: 'Sep 07, 02:15 PM', completed: true, current: false, description: 'Signed and delivered to front porch.' }
      ]
    },
    {
      id: 'ord-101',
      orderNumber: 'SP-99281',
      date: 'Sep 12, 2026',
      status: 'shipped',
      items: [
        {
          cartItemId: 'ci-1',
          product: this.products()[2],
          selectedColor: this.products()[2].colors[0],
          selectedSize: '16-inch Laptop',
          quantity: 1
        }
      ],
      subtotal: 260,
      shipping: 0,
      discount: 26,
      tax: 18.72,
      total: 252.72,
      address: {
        id: 'addr-1',
        title: 'Home',
        recipientName: 'Alex Rivera',
        phone: '+1 (555) 389-1029',
        street: '742 Evergreen Terrace, Apt 4B',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94107',
        country: 'United States',
        isDefault: true
      },
      paymentMethod: {
        id: 'pm-1',
        type: 'card',
        cardholderName: 'Alex Rivera',
        last4: '4242',
        brand: 'visa',
        expiry: '09/28',
        isDefault: true
      },
      estimatedDelivery: 'Wednesday, Sep 16',
      timeline: [
        { title: 'Order Confirmed', date: 'Sep 12, 10:14 AM', completed: true, current: false, description: 'Order verified.' },
        { title: 'Packed & Sealed', date: 'Sep 13, 02:30 PM', completed: true, current: false, description: 'Packaged in recyclable casing.' },
        { title: 'In Transit', date: 'Sep 14, 08:45 AM', completed: true, current: true, description: 'FedEx Express tracking #982173.' },
        { title: 'Delivered', date: 'Est. Sep 16', completed: false, current: false, description: 'Signature upon delivery.' }
      ]
    }
  ]);

  readonly notifications = signal<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Order SP-99281 Dispatched',
      message: 'Your Minimalist Leather Folio is on the way via FedEx Express.',
      time: '2 hours ago',
      read: false,
      type: 'order'
    },
    {
      id: 'notif-2',
      title: 'Exclusive Member Drop',
      message: 'Early access to the Terracotta Ceramic collection is open.',
      time: '1 day ago',
      read: false,
      type: 'promo'
    }
  ]);

  readonly showAuthPromptModal = signal(false);
  readonly authPromptMessage = signal<string>('');

  promptAuthRequired(message?: string) {
    this.authPromptMessage.set(message || 'Please sign in or create an account to continue.');
    this.showAuthPromptModal.set(true);
  }

  closeAuthPrompt() {
    this.showAuthPromptModal.set(false);
    this.authPromptMessage.set('');
  }

  goToLoginFromPrompt() {
    this.closeAuthPrompt();
    this.navigateTo('login');
  }

  private loadSavedUser(): UserProfile | null {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('shopsphere_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  readonly currentUser = signal<UserProfile | null>(this.loadSavedUser());

  readonly cartCount = computed(() => {
    return this.cart().reduce((sum, item) => sum + item.quantity, 0);
  });

  readonly wishlistCount = computed(() => this.wishlist().length);

  readonly unreadNotificationsCount = computed(() => {
    return this.notifications().filter(n => !n.read).length;
  });

  readonly subtotal = computed(() => {
    return this.cart().reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  });

  readonly discountAmount = computed(() => {
    const promo = this.appliedPromo();
    if (!promo) return 0;
    return Math.round((this.subtotal() * promo.percent) / 100);
  });

  readonly shippingCost = computed(() => {
    const sub = this.subtotal();
    if (sub === 0) return 0;
    return sub >= 150 ? 0 : 15;
  });

  readonly estimatedTax = computed(() => {
    const taxable = this.subtotal() - this.discountAmount();
    if (taxable <= 0) return 0;
    return Math.round(taxable * 0.0825);
  });

  readonly orderTotal = computed(() => {
    const sub = this.subtotal();
    if (sub === 0) return 0;
    return sub - this.discountAmount() + this.shippingCost() + this.estimatedTax();
  });

  readonly filteredProducts = computed(() => {
    const category = this.selectedCategory();
    const query = this.searchQuery().toLowerCase().trim();
    
    return this.products().filter(p => {
      const matchCategory = category === 'All' || p.category === category;
      const matchQuery = !query || 
        p.title.toLowerCase().includes(query) || 
        p.subtitle.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query);
      return matchCategory && matchQuery;
    });
  });

  readonly ordersFilterTab = signal<string>('All');

  navigateToOrders(tab?: string) {
    if (tab) {
      this.ordersFilterTab.set(tab);
    }
    this.navigateTo('orders');
  }

  navigateTo(screen: ScreenType) {
    this.previousScreen.set(this.activeScreen());
    this.activeScreen.set(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    switch (screen) {
      case 'home':
        this.router.navigate(['/home']);
        break;
      case 'discover':
        this.router.navigate(['/discover']);
        break;
      case 'product-detail':
        const pid = this.selectedProduct()?.id || 'sp-1';
        this.router.navigate(['/product', pid]);
        break;
      case 'cart':
      case 'bag':
        this.router.navigate(['/bag']);
        break;
      case 'checkout':
        this.router.navigate(['/checkout']);
        break;
      case 'done':
        this.router.navigate(['/order-confirmed']);
        break;
      case 'orders':
        this.router.navigate(['/orders']);
        break;
      case 'order-details':
        const oid = this.selectedOrder()?.id || 'ord-101';
        this.router.navigate(['/orders', oid]);
        break;
      case 'wishlist':
        this.router.navigate(['/wishlist']);
        break;
      case 'notifications':
        this.router.navigate(['/notifications']);
        break;
      case 'profile':
        this.router.navigate(['/profile']);
        break;
      case 'saved-addresses':
      case 'add-address':
        this.router.navigate(['/addresses']);
        break;
      case 'saved-payments':
      case 'add-payment':
        this.router.navigate(['/payments']);
        break;
      case 'login':
      case 'signup':
      case 'reset-password':
      case 'code-verification':
        this.router.navigate(['/login']);
        break;
      case 'network-error':
        this.router.navigate(['/error']);
        break;
      default:
        this.router.navigate(['/home']);
    }
  }

  goBack() {
    if (this.activeScreen() === 'order-details') {
      this.navigateTo('orders');
      return;
    }
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      this.navigateTo('home');
    }
  }

  openProductDetail(product: Product) {
    this.selectedProduct.set(product);
    this.navigateTo('product-detail');
  }

  openOrderDetails(order: Order) {
    this.selectedOrder.set(order);
    this.navigateTo('order-details');
  }

  addToCart(product: Product, color: ProductColor, size: string, quantity: number = 1): boolean {
    if (!this.currentUser()) {
      this.promptAuthRequired('Please sign in or create an account to add items to your shopping bag.');
      return false;
    }
    const current = this.cart();
    const existingIndex = current.findIndex(
      item => item.product.id === product.id && 
              item.selectedColor.name === color.name && 
              item.selectedSize === size
    );

    if (existingIndex > -1) {
      const updated = [...current];
      updated[existingIndex].quantity += quantity;
      this.cart.set(updated);
    } else {
      const newItem: CartItem = {
        cartItemId: `ci-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        product,
        selectedColor: color,
        selectedSize: size,
        quantity
      };
      this.cart.set([newItem, ...current]);
    }
    return true;
  }

  updateQuantity(cartItemId: string, delta: number) {
    const current = this.cart();
    const item = current.find(i => i.cartItemId === cartItemId);
    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      this.removeFromCart(cartItemId);
    } else {
      this.cart.set(current.map(i => i.cartItemId === cartItemId ? { ...i, quantity: newQty } : i));
    }
  }

  removeFromCart(cartItemId: string) {
    this.cart.set(this.cart().filter(i => i.cartItemId !== cartItemId));
  }

  clearCart() {
    this.cart.set([]);
  }

  applyPromo(code: string): { success: boolean; message: string } {
    const clean = code.trim().toUpperCase();
    if (clean === 'APPLE20' || clean === 'SPHERE20') {
      this.appliedPromo.set({ code: clean, percent: 20 });
      return { success: true, message: '20% off promo applied!' };
    } else if (clean === 'FIRST10' || clean === 'WELCOME10') {
      this.appliedPromo.set({ code: clean, percent: 10 });
      return { success: true, message: '10% off welcome promo applied!' };
    }
    return { success: false, message: 'Invalid promo code' };
  }

  removePromo() {
    this.appliedPromo.set(null);
  }

  toggleWishlist(product: Product): boolean {
    if (!this.currentUser()) {
      this.promptAuthRequired('Please sign in or create an account to save pieces to your wishlist.');
      return false;
    }
    const current = this.wishlist();
    const exists = current.some(p => p.id === product.id);
    if (exists) {
      this.wishlist.set(current.filter(p => p.id !== product.id));
    } else {
      this.wishlist.set([product, ...current]);
    }
    return true;
  }

  isWishlisted(productId: string): boolean {
    return this.wishlist().some(p => p.id === productId);
  }

  placeOrder(address: Address, paymentMethod: PaymentMethod): Order {
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `SP-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'processing',
      items: [...this.cart()],
      subtotal: this.subtotal(),
      shipping: this.shippingCost(),
      discount: this.discountAmount(),
      tax: this.estimatedTax(),
      total: this.orderTotal(),
      address,
      paymentMethod,
      estimatedDelivery: 'Estimated in 3-5 days',
      timeline: [
        { title: 'Order Confirmed', date: 'Just now', completed: true, current: true, description: 'Order verified.' },
        { title: 'Processing', date: 'In 2-4 hours', completed: false, current: false, description: 'Preparing package.' },
        { title: 'Dispatched', date: 'Tomorrow', completed: false, current: false, description: 'Handed to carrier.' },
        { title: 'Delivered', date: 'In 3-5 days', completed: false, current: false, description: 'Contactless delivery.' }
      ]
    };

    this.orders.set([newOrder, ...this.orders()]);
    this.clearCart();
    this.selectedOrder.set(newOrder);
    this.navigateTo('done');
    return newOrder;
  }

  addAddress(address: Omit<Address, 'id'>) {
    const newAddr: Address = {
      ...address,
      id: `addr-${Date.now()}`
    };
    if (newAddr.isDefault) {
      this.addresses.set(this.addresses().map(a => ({ ...a, isDefault: false })));
    }
    this.addresses.set([newAddr, ...this.addresses()]);
  }

  setDefaultAddress(id: string) {
    this.addresses.set(this.addresses().map(a => ({ ...a, isDefault: a.id === id })));
  }

  deleteAddress(id: string) {
    this.addresses.set(this.addresses().filter(a => a.id !== id));
  }

  addPaymentMethod(pm: Omit<PaymentMethod, 'id'>) {
    const newPm: PaymentMethod = {
      ...pm,
      id: `pm-${Date.now()}`
    };
    if (newPm.isDefault) {
      this.paymentMethods.set(this.paymentMethods().map(p => ({ ...p, isDefault: false })));
    }
    this.paymentMethods.set([...this.paymentMethods(), newPm]);
  }

  setDefaultPayment(id: string) {
    this.paymentMethods.set(this.paymentMethods().map(p => ({ ...p, isDefault: p.id === id })));
  }

  deletePaymentMethod(id: string) {
    this.paymentMethods.set(this.paymentMethods().filter(p => p.id !== id));
  }

  markAllNotificationsRead() {
    this.notifications.set(this.notifications().map(n => ({ ...n, read: true })));
  }

  login(email: string, name?: string) {
    const user: UserProfile = {
      id: 'user-' + Date.now(),
      name: name || email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      tier: 'ShopSphere Member',
      memberSince: 'September 2026',
      phone: '+1 (555) 389-1029'
    };
    this.currentUser.set(user);
    try {
      localStorage.setItem('shopsphere_user', JSON.stringify(user));
    } catch {}
    this.closeAuthPrompt();
    this.navigateTo('home');
  }

  logout() {
    this.currentUser.set(null);
    try {
      localStorage.removeItem('shopsphere_user');
    } catch {}
    this.navigateTo('login');
  }

  updateAvatar(newAvatarUrl: string) {
    this.currentUser.update(u => {
      if (!u) return u;
      return { ...u, avatar: newAvatarUrl };
    });
    this.notifications.update(notifs => [
      {
        id: 'notif-' + Date.now(),
        title: 'Profile Updated',
        message: 'Your profile avatar has been updated.',
        time: 'Just now',
        read: false,
        type: 'order'
      },
      ...notifs
    ]);
  }

  updateProfile(updates: Partial<UserProfile>) {
    this.currentUser.update(u => {
      if (!u) return u;
      return { ...u, ...updates };
    });
  }

  readonly userSettings = signal({
    pushNotifications: true,
    orderAlerts: true,
    exclusiveDrops: false,
    faceId: true,
    currency: 'USD ($)',
    language: 'English',
    theme: 'Ivory Linen'
  });

  updateSettings(updates: Partial<{
    pushNotifications: boolean;
    orderAlerts: boolean;
    exclusiveDrops: boolean;
    faceId: boolean;
    currency: string;
    language: string;
    theme: string;
  }>) {
    this.userSettings.update(s => ({ ...s, ...updates }));
  }

  submitSupportMessage(data: { name: string; email: string; topic: string; message: string }) {
    this.notifications.update(notifs => [
      {
        id: 'notif-' + Date.now(),
        title: 'Support Inquiry Sent',
        message: `Thank you, ${data.name}. Our concierge team will reach out to ${data.email} shortly.`,
        time: 'Just now',
        read: false,
        type: 'order'
      },
      ...notifs
    ]);
    return { success: true, message: 'Support inquiry sent successfully.' };
  }

  readonly reviewedOrderItems = signal<Set<string>>(new Set<string>());

  isItemReviewed(orderId: string, productId: string): boolean {
    return this.reviewedOrderItems().has(`${orderId}-${productId}`);
  }

  addReview(data: {
    productId: string;
    orderId?: string;
    orderNumber?: string;
    rating: number;
    title: string;
    comment: string;
    tags?: string[];
    photos?: string[];
  }): { success: boolean; message: string } {
    const user = this.currentUser();
    const newReview: ProductReview = {
      id: 'rev-' + Date.now(),
      productId: data.productId,
      author: user?.name || 'Alex Rivera',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      verifiedBuyer: true,
      rating: data.rating,
      date: 'Just now',
      title: data.title.trim(),
      comment: data.comment.trim(),
      orderNumber: data.orderNumber,
      tags: data.tags || [],
      photos: data.photos || []
    };

    this.products.update(prods => {
      return prods.map(p => {
        if (p.id === data.productId) {
          const currentReviews = p.reviews || [];
          const updatedReviews = [newReview, ...currentReviews];
          const newCount = (p.reviewsCount || 0) + 1;
          const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
          const newAvgRating = Number((totalRating / updatedReviews.length).toFixed(1));
          return {
            ...p,
            reviews: updatedReviews,
            reviewsCount: newCount,
            rating: newAvgRating
          };
        }
        return p;
      });
    });

    if (data.orderId) {
      this.reviewedOrderItems.update(set => {
        const next = new Set(set);
        next.add(`${data.orderId}-${data.productId}`);
        return next;
      });
    }

    const targetProduct = this.products().find(p => p.id === data.productId);
    this.notifications.update(notifs => [
      {
        id: 'notif-' + Date.now(),
        title: 'Review Published',
        message: `Your verified buyer review for "${targetProduct?.title || 'product'}" is live!`,
        time: 'Just now',
        read: false,
        type: 'promo'
      },
      ...notifs
    ]);

    return { success: true, message: 'Review successfully published!' };
  }
}
