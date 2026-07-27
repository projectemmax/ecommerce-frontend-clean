import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteConfigService } from '@app/core/services/site-config.service';
import { AppLogoComponent } from '@app/shared/ui/app-logo/app-logo.component';

interface FooterLink {
  label: string;
  url: string;
}

interface FooterTextItem {
  label: string;
  value?: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
  items: string[];
}

interface FooterContent {
  siteName: string;
  logoUrl: string | null;
  aboutTitle: string;
  aboutText: string;
  aboutCta: FooterLink | null;
  sections: FooterSection[];
  contactItems: FooterTextItem[];
  paymentMethods: string[];
  socialLinks: FooterLink[];
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

  currentYear = new Date().getFullYear();
  showBackToTop = false;
  content: FooterContent = this.createContent({});

  private readonly defaultCompanyLinks: FooterLink[] = [
    { label: 'Home', url: '/storefront' },
    { label: 'Shop', url: '/storefront/shop' },
    { label: 'Cart', url: '/storefront/cart' },
  ];

  private readonly defaultCustomerServiceLinks: FooterLink[] = [
    { label: 'My account', url: '/storefront/account' },
    { label: 'Orders', url: '/storefront/account/orders' },
    { label: 'Addresses', url: '/storefront/account/addresses' },
  ];

  private readonly sellerLinks: FooterLink[] = [
    { label: 'Sell on SariHub', url: '/register' },
    { label: 'Seller Center', url: '/admin/dashboard' },
  ];

  private readonly legalItems = [
    'Terms of service',
    'Privacy notice',
    'Returns policy',
  ];

  ngOnInit(): void {
    this.siteConfig.get().subscribe(config => {
      this.content = this.createContent(config || {});
    });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.showBackToTop = window.scrollY > 300;
  }

  scrollToTop(event: Event): void {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private createContent(config: any): FooterContent {
    const footer = config?.footer ?? {};

    return {
      siteName: config?.siteName || 'SariHub',
      logoUrl: config?.logoUrl || null,
      aboutTitle: footer.aboutTitle || 'Marketplace for everyday sellers and shoppers',
      aboutText: footer.about || 'Discover products from trusted local sellers, manage orders, and shop with confidence across SariHub.',
      aboutCta: this.createAboutCta(footer),
      sections: [
        {
          title: 'Company',
          links: this.normalizeRouteLinks(footer.shopLinks, this.defaultCompanyLinks),
          items: [],
        },
        {
          title: 'Customer Service',
          links: this.normalizeRouteLinks(footer.accountLinks, this.defaultCustomerServiceLinks),
          items: [],
        },
        {
          title: 'Sellers',
          links: this.sellerLinks,
          items: [],
        },
        {
          title: 'Legal',
          links: [],
          items: this.legalItems,
        },
      ],
      contactItems: this.normalizeContactItems(footer.contact),
      paymentMethods: this.normalizePaymentMethods(footer.payments),
      socialLinks: this.normalizeExternalLinks(footer.socialLinks),
    };
  }

  private createAboutCta(footer: any): FooterLink | null {
    if (!footer?.aboutButtonText || !footer?.aboutButtonLink) {
      return null;
    }

    return {
      label: footer.aboutButtonText,
      url: footer.aboutButtonLink,
    };
  }

  private normalizeRouteLinks(value: any, fallback: FooterLink[]): FooterLink[] {
    const links = Array.isArray(value)
      ? value
        .filter(item => item?.label && item?.url)
        .map(item => ({ label: item.label, url: item.url }))
      : [];

    return links.length ? links : fallback;
  }

  private normalizeContactItems(value: any): FooterTextItem[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .filter(item => item?.label && item?.value)
      .map(item => ({ label: item.label, value: item.value }));
  }

  private normalizePaymentMethods(value: any): string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map(item => typeof item === 'string' ? item : item?.label || item?.name)
      .filter(Boolean);
  }

  private normalizeExternalLinks(value: any): FooterLink[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .filter(item => item?.label && item?.url)
      .map(item => ({ label: item.label, url: item.url }));
  }
}
