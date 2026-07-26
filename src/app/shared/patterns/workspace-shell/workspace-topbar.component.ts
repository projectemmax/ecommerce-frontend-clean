import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/core/auth/auth.service';
import { JwtPayload } from '@app/models/auth.model';
import { AdminProfileService } from '@app/services/admin/admin-profile.service';
import { SiteConfigAdminService } from '@app/services/admin/admin-site-config.service';
import { AppLogoComponent } from '@app/shared/ui/app-logo/app-logo.component';

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

  private readonly siteConfigService = inject(SiteConfigAdminService);
  private readonly profileService = inject(AdminProfileService);
  readonly auth = inject(AuthService);

  companyName = 'SariHub';
  currentUser: any = null;
  userMenuOpen = false;

  ngOnInit(): void {
    this.profileService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    if (!this.profileService.currentUser) {
      this.profileService.loadCurrentUser().subscribe();
    }

    this.siteConfigService.getAll().subscribe((res: any) => {
      const configs = res.data ?? [];
      const siteName = configs.find((config: any) => config.key === 'siteName');

      if (siteName?.value) {
        this.companyName = siteName.value;
      }
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
}

