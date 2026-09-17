import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShopService } from '../services/shop.service';
import { IconComponent } from '../components/icon/icon.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  imports: [CommonModule, FormsModule, IconComponent]
})
export class ProfilePage implements OnInit {
  readonly shop = inject(ShopService);

  showAddressesModal = signal(false);
  showPaymentsModal = signal(false);
  showSettingsModal = signal(false);
  showSupportModal = signal(false);

  ngOnInit() {
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    if (path.includes('/addresses')) {
      this.showAddressesModal.set(true);
    } else if (path.includes('/payments')) {
      this.showPaymentsModal.set(true);
    } else if (path.includes('/settings')) {
      this.showSettingsModal.set(true);
    } else if (path.includes('/contact')) {
      this.showSupportModal.set(true);
    }
  }

  closeAllModals() {
    this.showAddressesModal.set(false);
    this.showPaymentsModal.set(false);
    this.showSettingsModal.set(false);
    this.showSupportModal.set(false);
    this.showEditProfileModal.set(false);
    this.showChangePasswordModal.set(false);
  }

  showAddAddressForm = signal(false);
  newAddrTitle = '';
  newAddrName = '';
  newAddrStreet = '';
  newAddrCity = '';
  newAddrState = 'CA';
  newAddrZip = '';
  newAddrPhone = '';
  newAddrDefault = false;

  showAddCardForm = signal(false);
  newCardName = '';
  newCardNumber = '';
  newCardExpiry = '';
  newCardCvv = '';

  showEditProfileModal = signal(false);
  editName = '';
  editEmail = '';
  editPhone = '';

  showChangePasswordModal = signal(false);
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';

  contactName = '';
  contactEmail = '';
  contactTopic = 'Order Tracking & Delivery';
  contactMessage = '';
  contactStatus = signal<string>('');
  liveChatNotice = signal<string>('');

  onAvatarSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        if (base64) {
          this.shop.updateAvatar(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  openEditProfileModal() {
    if (!this.shop.currentUser()) {
      this.shop.promptAuthRequired('Please sign in or create an account to edit profile details.');
      return;
    }
    const u = this.shop.currentUser();
    this.editName = u?.name || '';
    this.editEmail = u?.email || '';
    this.editPhone = u?.phone || '';
    this.showEditProfileModal.set(true);
  }

  openAddressesModal() {
    if (!this.shop.currentUser()) {
      this.shop.promptAuthRequired('Please sign in or create an account to view and manage your addresses.');
      return;
    }
    this.showAddressesModal.set(true);
  }

  openPaymentsModal() {
    if (!this.shop.currentUser()) {
      this.shop.promptAuthRequired('Please sign in or create an account to view and manage your payment methods.');
      return;
    }
    this.showPaymentsModal.set(true);
  }

  saveProfileChanges() {
    this.shop.updateProfile({
      name: this.editName,
      email: this.editEmail,
      phone: this.editPhone
    });
    this.showEditProfileModal.set(false);
  }

  submitPasswordChange() {
    if (!this.newPassword || this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match or cannot be empty.');
      return;
    }
    this.showChangePasswordModal.set(false);
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    alert('Your password has been successfully updated.');
  }

  updateSetting(key: string, event: any) {
    const val = event.target ? (event.target.type === 'checkbox' ? event.target.checked : event.target.value) : event;
    this.shop.updateSettings({ [key]: val });
  }

  clearCache() {
    alert('Local application cache cleared.');
  }

  exportData() {
    const data = JSON.stringify({
      user: this.shop.currentUser(),
      orders: this.shop.orders(),
      addresses: this.shop.addresses(),
      wishlist: this.shop.wishlist()
    }, null, 2);

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shopsphere-profile-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  scrollToContactForm() {
    const el = document.getElementById('contactFormBox');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onLiveChatClick() {
    this.liveChatNotice.set('Live Concierge Chat is currently being upgraded. Please use our concierge message form below or call us directly at +1 (800) 843-7743.');
    this.scrollToContactForm();
    setTimeout(() => {
      this.liveChatNotice.set('');
    }, 6000);
  }

  submitSupportForm() {
    if (!this.contactName || !this.contactEmail || !this.contactMessage) {
      this.contactStatus.set('Please fill out name, email, and your inquiry.');
      return;
    }

    this.shop.submitSupportMessage({
      name: this.contactName,
      email: this.contactEmail,
      topic: this.contactTopic,
      message: this.contactMessage
    });

    this.contactStatus.set('Thank you! Your message has been routed to our concierge.');
    this.contactMessage = '';
    setTimeout(() => {
      this.contactStatus.set('');
    }, 4000);
  }

  saveAddress() {
    if (!this.newAddrName || !this.newAddrStreet || !this.newAddrCity) return;
    this.shop.addAddress({
      title: this.newAddrTitle || 'Home',
      recipientName: this.newAddrName,
      phone: this.newAddrPhone || '+1 (555) 000-0000',
      street: this.newAddrStreet,
      city: this.newAddrCity,
      state: this.newAddrState || 'CA',
      zipCode: this.newAddrZip || '94107',
      country: 'United States',
      isDefault: this.newAddrDefault
    });

    this.newAddrTitle = '';
    this.newAddrName = '';
    this.newAddrStreet = '';
    this.newAddrCity = '';
    this.newAddrZip = '';
    this.newAddrPhone = '';
    this.showAddAddressForm.set(false);
  }

  saveCard() {
    if (!this.newCardNumber) return;
    const last4 = this.newCardNumber.slice(-4) || '8888';
    this.shop.addPaymentMethod({
      type: 'card',
      cardholderName: this.newCardName || 'Alex Rivera',
      last4,
      brand: 'visa',
      expiry: this.newCardExpiry || '12/28',
      isDefault: false
    });

    this.newCardName = '';
    this.newCardNumber = '';
    this.newCardExpiry = '';
    this.newCardCvv = '';
    this.showAddCardForm.set(false);
  }
}
