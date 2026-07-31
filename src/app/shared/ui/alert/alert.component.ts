import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { AlertVariant } from './alert.types';

@Component({
  selector: 'ui-alert',
  standalone: true,
  imports: [NgClass],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiAlertComponent {
  readonly variant = input.required<AlertVariant>();
}
