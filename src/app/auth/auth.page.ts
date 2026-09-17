import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShopService } from '../services/shop.service';
import { IconComponent } from '../components/icon/icon.component';

type AuthMode = 'login' | 'signup' | 'forgot' | 'verify' | 'new-password';

@Component({
  selector: 'app-auth',
  standalone: true,
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  imports: [CommonModule, FormsModule, IconComponent]
})
export class AuthPage implements OnInit, OnDestroy {
  readonly shop = inject(ShopService);

  mode = signal<AuthMode>('login');
  email = 'alex.rivera@icloud.com';
  name = 'Alex Rivera';
  password = '••••••••••••';
  confirmPassword = '';
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  newPassword = '';
  confirmNewPassword = '';
  showNewPassword = signal(false);
  showConfirmNewPassword = signal(false);

  otpDigits = ['', '', '', ''];
  errorMessage = signal<string>('');

  ngOnInit() {
    if (this.shop.currentUser()) {
      this.shop.navigateTo('home');
      return;
    }

    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    if (path.includes('/signup')) {
      this.mode.set('signup');
      this.shop.activeScreen.set('signup');
    } else if (path.includes('/forgot') || path.includes('/reset')) {
      this.mode.set('forgot');
      this.shop.activeScreen.set('reset-password');
    } else {
      this.mode.set('login');
      this.shop.activeScreen.set('login');
    }
  }

  continueToApp() {
    this.shop.closeAuthPrompt();
    this.shop.navigateTo('home');
  }

  ngOnDestroy() {
    if (['login', 'signup', 'reset-password', 'code-verification'].includes(this.shop.activeScreen())) {
      this.shop.activeScreen.set(this.shop.previousScreen() || 'home');
    }
  }

  titleText = () => {
    switch (this.mode()) {
      case 'signup': return 'Join ShopSphere';
      case 'forgot': return 'Reset Password';
      case 'verify': return 'Verification Code';
      case 'new-password': return 'Create New Password';
      default: return 'Welcome Back';
    }
  };

  subtitleText = () => {
    switch (this.mode()) {
      case 'signup': return 'Create your account to unlock private artisan drops and express delivery.';
      case 'forgot': return 'Enter your registered email and we will send a 4-digit code to verify your identity.';
      case 'verify': return 'We sent a 4-digit confirmation code to your email.';
      case 'new-password': return 'Set a new secure password for your ShopSphere account.';
      default: return 'Sign in to access your curated collections, orders, and payment methods.';
    }
  };

  switchMode(newMode: AuthMode) {
    this.errorMessage.set('');
    this.mode.set(newMode);
    if (newMode === 'signup') {
      this.shop.activeScreen.set('signup');
    } else if (newMode === 'login') {
      this.shop.activeScreen.set('login');
    } else if (newMode === 'verify') {
      this.shop.activeScreen.set('code-verification');
    } else {
      this.shop.activeScreen.set('reset-password');
    }
  }

  handleLogin(e: Event) {
    e.preventDefault();
    this.errorMessage.set('');
    if (!this.email) {
      this.errorMessage.set('Please enter your email address.');
      return;
    }
    this.shop.login(this.email);
  }

  handleSignup(e: Event) {
    e.preventDefault();
    this.errorMessage.set('');

    if (!this.name || !this.email) {
      this.errorMessage.set('Please enter your name and email address.');
      return;
    }

    if (!this.password || this.password.length < 8) {
      this.errorMessage.set('Password must be at least 8 characters long.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('Passwords do not match. Please retype carefully.');
      return;
    }

    this.shop.login(this.email, this.name);
  }

  handleForgot(e: Event) {
    e.preventDefault();
    this.errorMessage.set('');
    if (!this.email) {
      this.errorMessage.set('Please enter your registered email address.');
      return;
    }
    this.mode.set('verify');
    this.otpDigits = ['8', '2', '0', '4'];
  }

  handleVerify(e: Event) {
    e.preventDefault();
    this.errorMessage.set('');
    const code = this.otpDigits.join('');
    if (code.length < 4) {
      this.errorMessage.set('Please enter all 4 digits of your verification code.');
      return;
    }
    this.mode.set('new-password');
  }

  handleResetPassword(e: Event) {
    e.preventDefault();
    this.errorMessage.set('');

    if (!this.newPassword || this.newPassword.length < 8) {
      this.errorMessage.set('New password must be at least 8 characters long.');
      return;
    }

    if (this.newPassword !== this.confirmNewPassword) {
      this.errorMessage.set('New passwords do not match. Please retype carefully.');
      return;
    }

    this.shop.login(this.email || 'alex.rivera@icloud.com');
  }

  resendOtp() {
    this.errorMessage.set('');
    this.otpDigits = ['1', '9', '4', '7'];
  }
}
