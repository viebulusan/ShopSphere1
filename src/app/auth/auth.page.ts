import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ShopService } from '../services/shop.service';
import { IconComponent } from '../components/icon/icon.component';

export type AuthMode = 'login' | 'signup' | 'forgot' | 'verify' | 'new-password';

@Component({
  selector: 'app-auth',
  standalone: true,
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  imports: [CommonModule, FormsModule, IconComponent]
})
export class AuthPage implements OnInit, OnDestroy {
  readonly shop = inject(ShopService);
  private readonly router = inject(Router);

  mode = signal<AuthMode>('login');
  
  // Login / Common
  email = 'alex.rivera@icloud.com';
  password = '••••••••••••';
  rememberMe = signal(true);
  showPassword = signal(false);

  // Signup fields
  name = 'Alex Rivera';
  confirmPassword = '';
  showConfirmPassword = signal(false);
  agreeToTerms = signal(true);
  subscribeNewsletter = signal(true);

  // Password reset fields
  newPassword = '';
  confirmNewPassword = '';
  showNewPassword = signal(false);
  showConfirmNewPassword = signal(false);

  // Verification OTP
  otpDigits = ['', '', '', ''];
  resendSeconds = signal(59);
  private timerInterval: any = null;

  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  private routerSub: Subscription | null = null;

  passwordStrength = computed(() => {
    const p = this.mode() === 'signup' ? this.password : this.newPassword;
    if (!p || p === '••••••••••••') return { label: 'Good', score: 3, color: '#363434' };
    if (p.length < 6) return { label: 'Weak', score: 1, color: '#7C7B7B' };
    if (p.length < 10) return { label: 'Medium', score: 2, color: '#575555' };
    return { label: 'Strong', score: 3, color: '#070606' };
  });

  ngOnInit() {
    if (this.shop.currentUser()) {
      this.shop.navigateTo('home');
      return;
    }

    this.syncModeFromPath();

    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.syncModeFromPath();
      });

    this.startCountdown();
  }

  private syncModeFromPath() {
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    if (path.includes('/signup')) {
      this.mode.set('signup');
      this.shop.activeScreen.set('signup');
    } else if (path.includes('/forgot')) {
      this.mode.set('forgot');
      this.shop.activeScreen.set('reset-password');
    } else if (path.includes('/verify') || path.includes('/code-verification')) {
      this.mode.set('verify');
      this.shop.activeScreen.set('code-verification');
    } else if (path.includes('/new-password') || path.includes('/reset-password')) {
      this.mode.set('new-password');
      this.shop.activeScreen.set('reset-password');
    } else {
      this.mode.set('login');
      this.shop.activeScreen.set('login');
    }
  }

  private startCountdown() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.resendSeconds.set(59);
    this.timerInterval = setInterval(() => {
      if (this.resendSeconds() > 0) {
        this.resendSeconds.update(s => s - 1);
      }
    }, 1000);
  }

  continueToApp() {
    this.shop.closeAuthPrompt();
    this.shop.navigateTo('home');
  }

  goToOfflineScreen() {
    this.router.navigateByUrl('/offline');
  }

  fillDemoCredentials() {
    this.email = 'alex.rivera@icloud.com';
    this.password = 'LuxuryMinimal2026!';
    this.name = 'Alex Rivera';
    this.errorMessage.set('');
    this.successMessage.set('Demo VIP credentials autofilled.');
    setTimeout(() => this.successMessage.set(''), 3000);
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    if (['login', 'signup', 'reset-password', 'code-verification'].includes(this.shop.activeScreen())) {
      this.shop.activeScreen.set(this.shop.previousScreen() || 'home');
    }
  }

  titleText = () => {
    switch (this.mode()) {
      case 'signup': return 'Create Account';
      case 'forgot': return 'Forgot Password';
      case 'verify': return 'Verification Code';
      case 'new-password': return 'Create New Password';
      default: return 'Welcome Back';
    }
  };

  subtitleText = () => {
    switch (this.mode()) {
      case 'signup': return 'Join ShopSphere to access private drops, bespoke tracking, and priority concierge.';
      case 'forgot': return 'Enter your registered email and we will send a 4-digit code to verify your identity.';
      case 'verify': return 'We sent a 4-digit security code to ' + (this.email || 'your email') + '.';
      case 'new-password': return 'Set a new secure password for your ShopSphere account.';
      default: return 'Sign in to access your curated collection, saved bag, and order history.';
    }
  };

  switchMode(newMode: AuthMode) {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.mode.set(newMode);

    if (newMode === 'signup') {
      this.shop.activeScreen.set('signup');
      this.router.navigateByUrl('/signup');
    } else if (newMode === 'login') {
      this.shop.activeScreen.set('login');
      this.router.navigateByUrl('/login');
    } else if (newMode === 'verify') {
      this.shop.activeScreen.set('code-verification');
      this.router.navigateByUrl('/verify');
      this.startCountdown();
    } else if (newMode === 'forgot') {
      this.shop.activeScreen.set('reset-password');
      this.router.navigateByUrl('/forgot');
    } else {
      this.shop.activeScreen.set('reset-password');
      this.router.navigateByUrl('/reset-password');
    }
  }

  handleLogin(e: Event) {
    e.preventDefault();
    this.errorMessage.set('');
    if (!this.email) {
      this.errorMessage.set('Please enter your email address.');
      return;
    }
    this.shop.login(this.email, this.name || 'Alex Rivera');
  }

  handleSignup(e: Event) {
    e.preventDefault();
    this.errorMessage.set('');

    if (!this.name || !this.email) {
      this.errorMessage.set('Please enter your full name and email address.');
      return;
    }

    if (!this.password || (this.password !== '••••••••••••' && this.password.length < 8)) {
      this.errorMessage.set('Password must be at least 8 characters long.');
      return;
    }

    if (this.confirmPassword && this.password !== this.confirmPassword) {
      this.errorMessage.set('Passwords do not match. Please retype carefully.');
      return;
    }

    if (!this.agreeToTerms()) {
      this.errorMessage.set('Please agree to the Terms of Service to create an account.');
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
    this.switchMode('verify');
    this.otpDigits = ['8', '2', '0', '4'];
    this.successMessage.set('Verification code sent to ' + this.email);
  }

  handleVerify(e: Event) {
    e.preventDefault();
    this.errorMessage.set('');
    const code = this.otpDigits.join('');
    if (code.length < 4) {
      this.errorMessage.set('Please enter all 4 digits of your verification code.');
      return;
    }
    this.switchMode('new-password');
    this.successMessage.set('Code verified successfully.');
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

    this.shop.login(this.email || 'alex.rivera@icloud.com', this.name || 'Alex Rivera');
  }

  resendOtp() {
    this.errorMessage.set('');
    this.otpDigits = ['5', '8', '3', '1'];
    this.startCountdown();
    this.successMessage.set('A new 4-digit code was resent to ' + this.email);
    setTimeout(() => this.successMessage.set(''), 4000);
  }
}
