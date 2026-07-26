import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SiteConfigService } from '@app/core/services/site-config.service';
import { MarketplaceFooterComponent } from '@app/shared/patterns/marketplace-shell/marketplace-footer.component';
import { MarketplaceHeaderComponent } from '@app/shared/patterns/marketplace-shell/marketplace-header.component';
import { MarketplaceMobileNavComponent } from '@app/shared/patterns/marketplace-shell/marketplace-mobile-nav.component';

@Component({
  selector: 'app-storefront-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MarketplaceHeaderComponent,
    MarketplaceFooterComponent,
    MarketplaceMobileNavComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class StorefrontLayoutComponent implements OnInit {

    constructor(
      private siteConfigService: SiteConfigService
    ){}

    ngOnInit() {
        this.clearTemplateCss();
        this.loadCss('assets/admin/vendors/font-awesome/css/font-awesome.min.css');
        this.siteConfigService.loadConfig().subscribe();
    }

    loadCss(path: string) {
        if (document.querySelector(`link[href="${path}"]`)) return;

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = path;
        link.classList.add('template-css');

        document.head.appendChild(link);
    }
    
    clearTemplateCss() {
        document.querySelectorAll('.template-css')
            .forEach(el => el.remove());
    }

}
