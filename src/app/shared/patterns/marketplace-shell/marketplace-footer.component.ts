import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteConfigService } from '@app/core/services/site-config.service';
import { AppLogoComponent } from '@app/shared/ui/app-logo/app-logo.component';

interface FooterLink {
  label: string;
  url: string;
}

@Component({
  selector: 'sh-marketplace-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, AppLogoComponent],
  templateUrl: './marketplace-footer.component.html',
  styleUrl: './marketplace-footer.component.scss',
})
export class MarketplaceFooterComponent implements OnInit {
  private readonly siteConfig = inject(SiteConfigService);

  config: any = {};
  currentYear = new Date().getFullYear();
  showBackToTop = false;

  readonly defaultShopLinks: FooterLink[] = [
    { label: 'Shop all', url: '/storefront/shop' },
    { label: 'Featured products', url: '/storefront/shop' },
    { label: 'My cart', url: '/storefront/cart' },
  ];

  readonly defaultAccountLinks: FooterLink[] = [
    { label: 'My account', url: '/storefront/account' },
    { label: 'Orders', url: '/storefront/account/orders' },
    { label: 'Addresses', url: '/storefront/account/addresses' },
  ];

  ngOnInit(): void {
    this.siteConfig.get().subscribe(config => {
      this.config = config || {};
    });
  }

  get siteName(): string {
    return this.config?.siteName || 'SariHub';
  }

  get logoUrl(): string | null {
    return this.config?.logoUrl || null;
  }

  get aboutTitle(): string {
    return this.config?.footer?.aboutTitle || 'Marketplace for everyday sellers and shoppers';
  }

  get aboutText(): string {
    return this.config?.footer?.about || 'Discover products from trusted local sellers, manage orders, and shop with confidence across SariHub.';
  }

  get shopLinks(): FooterLink[] {
    return this.config?.footer?.shopLinks?.length ? this.config.footer.shopLinks : this.defaultShopLinks;
  }

  get accountLinks(): FooterLink[] {
    return this.config?.footer?.accountLinks?.length ? this.config.footer.accountLinks : this.defaultAccountLinks;
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.showBackToTop = window.scrollY > 300;
  }

  scrollToTop(event: Event): void {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
