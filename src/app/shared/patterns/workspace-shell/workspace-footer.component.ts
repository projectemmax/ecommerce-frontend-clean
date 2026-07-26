import { Component } from '@angular/core';

@Component({
  selector: 'sh-workspace-footer',
  standalone: true,
  templateUrl: './workspace-footer.component.html',
  styleUrl: './workspace-footer.component.scss',
})
export class WorkspaceFooterComponent {
  readonly currentYear = new Date().getFullYear();
}

