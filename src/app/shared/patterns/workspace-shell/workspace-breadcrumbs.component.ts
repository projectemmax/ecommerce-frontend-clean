import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, signal, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

interface WorkspaceCrumb {
  label: string;
  url: string | null;
}

@Component({
  selector: 'sh-workspace-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './workspace-breadcrumbs.component.html',
  styleUrl: './workspace-breadcrumbs.component.scss',
})
export class WorkspaceBreadcrumbsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  readonly crumbs = signal<WorkspaceCrumb[]>([]);

  ngOnInit(): void {
    this.updateCrumbs(this.router.url);

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(event => {
        this.updateCrumbs(event.urlAfterRedirects);
      });
  }

  private updateCrumbs(url: string): void {
    const segments = this.getPrimarySegments(url);
    const adminIndex = segments.indexOf('admin');
    const workspaceSegments = adminIndex >= 0 ? segments.slice(adminIndex + 1) : segments;
    const crumbs: WorkspaceCrumb[] = [
      { label: 'Workspace', url: '/admin/dashboard' },
    ];

    workspaceSegments.forEach((segment, index) => {
      crumbs.push({
        label: this.getLabel(segment),
        url: this.getNavigableUrl(workspaceSegments, index),
      });
    });

    this.crumbs.set(crumbs);
  }

  private getPrimarySegments(url: string): string[] {
    const tree = this.router.parseUrl(url);
    const primary = tree.root.children['primary'];

    return primary?.segments.map(segment => segment.path) ?? [];
  }

  private getNavigableUrl(segments: string[], index: number): string | null {
    const segment = segments[index];

    if (index !== 0) {
      return null;
    }

    const sectionRoutes = new Set([
      'brands',
      'carts',
      'categories',
      'customers',
      'dashboard',
      'orders',
      'products',
      'reviews',
    ]);

    return sectionRoutes.has(segment) ? `/admin/${segment}` : null;
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

    if (segment.length > 16 || /^\d+$/.test(segment) || /^[0-9a-f-]{8,}$/i.test(segment)) {
      return 'Details';
    }

    return decodeURIComponent(segment)
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
