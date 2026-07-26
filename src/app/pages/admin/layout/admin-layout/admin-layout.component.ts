import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { AuthService } from '@app/core/auth/auth.service';
import { JwtPayload } from '@app/models/auth.model';

import { WorkspaceBreadcrumbsComponent } from '@app/shared/patterns/workspace-shell/workspace-breadcrumbs.component';
import { WorkspaceFooterComponent } from '@app/shared/patterns/workspace-shell/workspace-footer.component';
import { WorkspaceSidebarComponent } from '@app/shared/patterns/workspace-shell/workspace-sidebar.component';
import { WorkspaceTopbarComponent } from '@app/shared/patterns/workspace-shell/workspace-topbar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    WorkspaceTopbarComponent,
    WorkspaceSidebarComponent,
    WorkspaceBreadcrumbsComponent,
    WorkspaceFooterComponent
  ],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {

    payload: JwtPayload | null = null;
    isLoggedIn = false;
    sidebarOpen = false;

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.clearTemplateCss();

        this.loadCss('assets/admin/vendors/iconfonts/mdi/css/materialdesignicons.min.css');
        this.loadCss('assets/admin/vendors/font-awesome/css/font-awesome.min.css');

        this.isLoggedIn = this.authService.isLoggedIn();
        this.payload = this.authService.getJwtPayload();
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

    logout() {
        this.authService.logout();
    }

    toggleSidebar() {
        this.sidebarOpen = !this.sidebarOpen;
    }

    closeSidebar() {
        this.sidebarOpen = false;
    }

}
