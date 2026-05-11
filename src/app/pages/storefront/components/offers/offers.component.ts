import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SiteConfigService } from '@app/core/services/site-config.service';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.css'
})
export class OffersComponent {

    readonly fallbackImage = '/assets/storefront/medical-ppe.jpg';

    offerClasses = [
        'bg-secondary border-primary',
        'bg-dark border-dark',
        'bg-primary border-secondary'
    ];

    constructor(
        private siteConfig: SiteConfigService
    ) {}

    get config() {
        return this.siteConfig.snapshot ?? {};
    }

    get shopOffers(): any[] {
        const offers = this.config?.shopOffers;

        return Array.isArray(offers) ? offers : [];
    }

    trackByOffer(index: number, offer: any) {
        return offer?.title ?? index;
    }

}
