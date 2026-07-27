import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { AuthService } from '@app/core/auth/auth.service';
import { SidebarItemComponent } from '@app/shared/ui/sidebar-item/sidebar-item.component';

type WorkspaceRole = 'ADMIN' | 'SELLER' | 'CUSTOMER';

interface WorkspaceNavItem {
  label: string;
  route: string;
  icon: string;
  roles: WorkspaceRole[];
  exact?: boolean;
}

interface WorkspaceNavGroup {
  title: string;
  items: WorkspaceNavItem[];
}

@Component({
  selector: 'sh-workspace-sidebar',
  standalone: true,
  imports: [CommonModule, SidebarItemComponent],
  templateUrl: './workspace-sidebar.component.html',
  styleUrl: './workspace-sidebar.component.scss',
})
export class WorkspaceSidebarComponent {
  @Input() open = false;
  @Output() closeSidebar = new EventEmitter<void>();

  private readonly auth = inject(AuthService);

  private readonly navGroups: WorkspaceNavGroup[] = [
    {
      title: 'Main',
      items: [
        { label: 'Dashboard', route: '/admin/dashboard', icon: 'D', roles: ['ADMIN', 'SELLER'], exact: true },
        { label: 'Products', route: '/admin/products', icon: 'P', roles: ['ADMIN', 'SELLER'] },
        { label: 'Orders', route: '/admin/orders', icon: 'O', roles: ['ADMIN', 'SELLER'] },
        { label: 'Reviews', route: '/admin/reviews', icon: 'R', roles: ['ADMIN', 'SELLER'] },
      ],
    },
    {
      title: 'Platform',
      items: [
        { label: 'Brands', route: '/admin/brands', icon: 'B', roles: ['ADMIN'] },
        { label: 'Categories', route: '/admin/categories', icon: 'C', roles: ['ADMIN'] },
        { label: 'Customers', route: '/admin/customers', icon: 'U', roles: ['ADMIN'] },
        { label: 'Carts', route: '/admin/carts', icon: 'K', roles: ['ADMIN'] },
      ],
    },
    {
      title: 'System',
      items: [
        { label: 'Profile', route: '/admin/settings/profile', icon: 'I', roles: ['ADMIN'] },
        { label: 'Site Config', route: '/admin/settings/site-config', icon: 'S', roles: ['ADMIN'] },
      ],
    },
  ];

  get roleLabel(): string {
    return this.auth.isSeller() ? 'Seller' : 'Admin';
  }

  get visibleGroups(): WorkspaceNavGroup[] {
    const role = this.auth.getRole();

    if (!role) {
      return [];
    }

    return this.navGroups
      .map(group => ({
        ...group,
        items: group.items.filter(item => item.roles.includes(role)),
      }))
      .filter(group => group.items.length > 0);
  }
}
