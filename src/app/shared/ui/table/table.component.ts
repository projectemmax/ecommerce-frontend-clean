import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { TableVariant } from './table.types';

@Component({
  selector: 'ui-table',
  standalone: true,
  imports: [NgClass],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTableComponent {
  readonly variant = input<TableVariant>('default');
}
