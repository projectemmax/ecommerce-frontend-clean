import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, HostListener, Input, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/auth/auth.service';
import { JwtPayload } from '@app/models/auth.model';
import { AdminProfileService } from '@app/services/admin/admin-profile.service';
import { SiteConfigAdminService } from '@app/services/admin/admin-site-config.service';
import { AppLogoComponent } from '@app/shared/ui/app-logo/app-logo.component';
import { filter } from 'rxjs';

@Component({
  selector: 'sh-workspace-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink, AppLogoComponent],
  templateUrl: './workspace-topbar.component.html',
  styleUrl: './workspace-topbar.component.scss',
})
export class WorkspaceTopbarComponent implements OnInit {
  @Input() payload: JwtPayload | null = null;
  @Output() menuToggle = new EventEmitter<void>();
  @Output() logoutClick = new EventEmitter<void>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly siteConfigService = inject(SiteConfigAdminService);
  private readonly profileService = inject(AdminProfileService);
  readonly auth = inject(AuthService);

  companyName = 'SariHub';
  currentUser: any = null;
  pageTitle = 'Dashboard';
  userMenuOpen = false;

  private readonly pageTitles: Record<string, string> = {
    brands: 'Brands',
    carts: 'Carts',
    categories: 'Categories',
    customers: 'Customers',
    dashboard: 'Dashboard',
    edit: 'Edit Product',
    orders: 'Orders',
    products: 'Products',
    profile: 'Profile',
    reviews: 'Reviews',
    'site-config': 'Site Config',
  };

  ngOnInit(): void {
    this.profileService.currentUser$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => {
        this.currentUser = user;
      });

    if (!this.profileService.currentUser) {
      this.profileService.loadCurrentUser().subscribe();
    }

    this.siteConfigService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        const configs = res.data ?? [];
        const siteName = configs.find((config: any) => config.key === 'siteName');

        if (siteName?.value) {
          this.companyName = siteName.value;
        }
      });

    this.setPageTitle(this.router.url);

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(event => {
        this.setPageTitle(event.urlAfterRedirects);
      });
  }

  get userInitials(): string {
    const first = this.currentUser?.firstName?.[0] ?? '';
    const last = this.currentUser?.lastName?.[0] ?? '';
    const fallback = this.auth.getUserInitials();

    return `${first}${last}`.toUpperCase() || fallback || 'U';
  }

  get roleLabel(): string {
    const role = this.auth.getRole() || this.payload?.role;
    return role === 'SELLER' ? 'Seller Workspace' : 'Admin Workspace';
  }

  get userDisplayName(): string {
    const name = `${this.currentUser?.firstName ?? ''} ${this.currentUser?.lastName ?? ''}`.trim();
    return name || this.payload?.email || this.roleLabel;
  }

  get userEmail(): string {
    return this.currentUser?.email || this.payload?.email || '';
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  logout(): void {
    this.userMenuOpen = false;
    this.logoutClick.emit();
  }

  @HostListener('document:click', ['$event'])
  closeUserMenu(event: Event): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.workspace-topbar__user')) {
      this.userMenuOpen = false;
    }
  }

  private setPageTitle(url: string): void {
    this.pageTitle = this.getPageTitle(url);
  }

  private getPageTitle(url: string): string {
    const path = url.split(/[?#]/)[0];
    const segments = path.split('/').filter(Boolean);
    const adminIndex = segments.indexOf('admin');
    const workspaceSegments = adminIndex >= 0 ? segments.slice(adminIndex + 1) : segments;
    const [section, action] = workspaceSegments;

    if (!section) {
      return 'Dashboard';
    }

    if (section === 'products' && action === 'create') {
      return 'Create Product';
    }

    if (section === 'products' && action === 'edit') {
      return 'Edit Product';
    }

    if (section === 'settings' && action) {
      return this.pageTitles[action] || this.toTitleCase(action);
    }

    return this.pageTitles[section] || this.toTitleCase(section);
  }

  private toTitleCase(value: string): string {
    return value
      .split('-')
      .filter(Boolean)
      .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ');
  }
}
