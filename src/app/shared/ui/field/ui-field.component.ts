import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'ui-field',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './ui-field.component.html',
  styleUrl: './ui-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiFieldComponent {
  readonly label = input<string>();
  readonly required = input(false);
  readonly helperText = input<string>();
  readonly error = input<string | null>();
  readonly hideLabel = input(false);
  readonly controlId = input<string>();
}