import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

interface WorkspaceCrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'sh-workspace-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './workspace-breadcrumbs.component.html',
  styleUrl: './workspace-breadcrumbs.component.scss',
})
export class WorkspaceBreadcrumbsComponent implements OnInit {
  private readonly router = inject(Router);

  readonly crumbs = signal<WorkspaceCrumb[]>([]);

  ngOnInit(): void {
    this.updateCrumbs(this.router.url);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateCrumbs(event.urlAfterRedirects);
      }
    });
  }

  private updateCrumbs(url: string): void {
    const path = url.split('?')[0];
    const segments = path.split('/').filter(Boolean);
    const crumbs: WorkspaceCrumb[] = [];
    let currentPath = '';

    for (const segment of segments) {
      currentPath += `/${segment}`;

      if (segment === 'admin') {
        crumbs.push({ label: 'Workspace', url: '/admin/dashboard' });
        continue;
      }

      crumbs.push({
        label: this.getLabel(segment),
        url: currentPath,
      });
    }

    this.crumbs.set(crumbs);
  }

  private getLabel(segment: string): string {
    const labels: Record<string, string> = {
      brands: 'Brands',
      carts: 'Carts',
      categories: 'Categories',
      create: 'Create',
      customers: 'Customers',
      dashboard: 'Dashboard',
      edit: 'Edit',
      orders: 'Orders',
      products: 'Products',
      profile: 'Profile',
      reviews: 'Reviews',
      settings: 'Settings',
      'site-config': 'Site Config',
    };

    if (labels[segment]) {
      return labels[segment];
    }

    if (segment.length > 16 || /^[0-9a-f-]{8,}$/i.test(segment)) {
      return 'Details';
    }

    return decodeURIComponent(segment)
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}

