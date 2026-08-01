import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { CardVariant } from './card.types';

@Component({
  selector: 'ui-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.ui-card--elevated]': "variant() === 'elevated'",
  },
})
export class UiCardComponent {
  readonly variant = input<CardVariant>('outlined');
}
