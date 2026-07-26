import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@app/core/auth/auth.service';
import { SiteConfigService } from '@app/core/services/site-config.service';
import { Category } from '@app/models/category.model';
import { StorefrontCartService } from '@app/services/storefront/storefront-cart.service';
import { StorefrontCategoryService } from '@app/services/storefront/storefront-category.service';
import { AppLogoComponent } from '@app/shared/ui/app-logo/app-logo.component';
import { NavSearchComponent } from '@app/shared/ui/nav-search/nav-search.component';

@Component({
  selector: 'sh-marketplace-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    AppLogoComponent,
    NavSearchComponent,
  ],
  templateUrl: './marketplace-header.component.html',
  styleUrl: './marketplace-header.component.scss',
})
export class MarketplaceHeaderComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly siteConfig = inject(SiteConfigService);
  private readonly categoryService = inject(StorefrontCategoryService);
  readonly auth = inject(AuthService);
  readonly cartService = inject(StorefrontCartService);

  config: any = {};
  categories: Category[] = [];
  mobileOpen = false;
  accountOpen = false;

  readonly cartCount$ = this.cartService.cartCount$;

  ngOnInit(): void {
    this.siteConfig.get().subscribe(config => {
      this.config = config || {};
    });

    this.categoryService.getCategories().subscribe({
      next: res => {
        this.categories = res?.data?.data ?? [];
      },
      error: () => {
        this.categories = [];
      },
    });
  }

  get siteName(): string {
    return this.config?.siteName || 'SariHub';
  }

  get logoUrl(): string | null {
    return this.config?.logoUrl || null;
  }

  get announcementText(): string {
    return (
      this.config?.announcementBar?.message ||
      this.config?.marketplace?.announcement ||
      'Fresh finds, local sellers, and reliable delivery in one marketplace.'
    );
  }

  get sellerCtaLabel(): string {
    return this.auth.isSeller() || this.auth.isAdmin() ? 'Seller Center' : 'Sell on SariHub';
  }

  get sellerCtaRoute(): string {
    return this.auth.isSeller() || this.auth.isAdmin() ? '/admin/dashboard' : '/register';
  }

  get accountRoute(): string {
    return this.auth.isLoggedIn() ? '/storefront/account' : '/login';
  }

  get accountLabel(): string {
    return this.auth.isLoggedIn() ? this.auth.getUserInitials() : 'Account';
  }

  get visibleCategories(): Category[] {
    return this.categories.slice(0, 8);
  }

  onSearch(value: string): void {
    const search = value.trim();

    this.router.navigate(['/storefront/shop'], {
      queryParams: {
        search: search || null,
        page: 1,
      },
      queryParamsHandling: search ? undefined : 'merge',
    });

    this.closeMobileMenu();
  }

  toggleMobileMenu(): void {
    this.mobileOpen = !this.mobileOpen;
  }

  closeMobileMenu(): void {
    this.mobileOpen = false;
  }

  toggleAccountMenu(): void {
    this.accountOpen = !this.accountOpen;
  }

  logout(): void {
    this.accountOpen = false;
    this.auth.logout();
  }

  @HostListener('document:click', ['$event'])
  closeAccountOnOutsideClick(event: Event): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.marketplace-header__account')) {
      this.accountOpen = false;
    }
  }
}

