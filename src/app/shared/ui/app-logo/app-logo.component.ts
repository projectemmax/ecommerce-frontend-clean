import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'sh-app-logo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './app-logo.component.html',
  styleUrl: './app-logo.component.scss',
})
export class AppLogoComponent {
  @Input() siteName = 'SariHub';
  @Input() logoUrl: string | null | undefined;
  @Input() route: string | any[] = '/storefront';
  @Input() compact = false;
  @Input() inverse = false;
}
