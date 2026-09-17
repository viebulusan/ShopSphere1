import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage),
  },
  {
    path: 'discover',
    loadComponent: () => import('./discover/discover.page').then(m => m.DiscoverPage),
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./product-detail/product-detail.page').then(m => m.ProductDetailPage),
  },
  {
    path: 'bag',
    loadComponent: () => import('./bag/bag.page').then(m => m.BagPage),
  },
  {
    path: 'cart',
    loadComponent: () => import('./bag/bag.page').then(m => m.BagPage),
  },
  {
    path: 'checkout',
    loadComponent: () => import('./checkout/checkout.page').then(m => m.CheckoutPage),
  },
  {
    path: 'order-confirmed',
    loadComponent: () => import('./order-complete/order-complete.page').then(m => m.OrderCompletePage),
  },
  {
    path: 'done',
    loadComponent: () => import('./order-complete/order-complete.page').then(m => m.OrderCompletePage),
  },
  {
    path: 'orders',
    loadComponent: () => import('./orders/orders.page').then(m => m.OrdersPage),
  },
  {
    path: 'orders/:id',
    loadComponent: () => import('./orders/orders.page').then(m => m.OrdersPage),
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./wishlist/wishlist.page').then(m => m.WishlistPage),
  },
  {
    path: 'notifications',
    loadComponent: () => import('./notifications/notifications.page').then(m => m.NotificationsPage),
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.page').then(m => m.ProfilePage),
  },
  {
    path: 'addresses',
    loadComponent: () => import('./profile/profile.page').then(m => m.ProfilePage),
  },
  {
    path: 'payments',
    loadComponent: () => import('./profile/profile.page').then(m => m.ProfilePage),
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/auth.page').then(m => m.AuthPage),
  },
  {
    path: 'signup',
    loadComponent: () => import('./auth/auth.page').then(m => m.AuthPage),
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./auth/auth.page').then(m => m.AuthPage),
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./auth/auth.page').then(m => m.AuthPage),
  },
  {
    path: 'error',
    loadComponent: () => import('./network-error/network-error.page').then(m => m.NetworkErrorPage),
  },
  {
    path: 'network-error',
    loadComponent: () => import('./network-error/network-error.page').then(m => m.NetworkErrorPage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
