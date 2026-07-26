import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@app/core/auth/auth.service';
import { StorefrontCartService } from '@app/services/storefront/storefront-cart.service';

@Component({
  selector: 'sh-marketplace-mobile-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './marketplace-mobile-nav.component.html',
  styleUrl: './marketplace-mobile-nav.component.scss',
})
export class MarketplaceMobileNavComponent {
  readonly auth = inject(AuthService);
  readonly cartCount$ = inject(StorefrontCartService).cartCount$;

  get accountRoute(): string {
    return this.auth.isLoggedIn() ? '/storefront/account' : '/login';
  }
}

