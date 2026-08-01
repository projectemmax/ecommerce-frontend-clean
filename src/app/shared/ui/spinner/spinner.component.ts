import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { SpinnerSize } from './spinner.types';

@Component({
  selector: 'ui-spinner',
  standalone: true,
  imports: [NgClass],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSpinnerComponent {
  readonly size = input<SpinnerSize>('md');
}
