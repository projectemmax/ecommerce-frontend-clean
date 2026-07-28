import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  booleanAttribute,
} from '@angular/core';
import { NgClass } from '@angular/common';

import {
  ButtonSize,
  ButtonType,
  ButtonVariant,
} from './button.types';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiButtonComponent {
    readonly variant = input<ButtonVariant>('primary');
    readonly size = input<ButtonSize>('md');
    readonly type = input<ButtonType>('button');
    readonly loading = input(false, {
        transform: booleanAttribute,
    });

    readonly disabled = input(false, {
        transform: booleanAttribute,
    });

    readonly fullWidth = input(false, {
        transform: booleanAttribute,
    });
    readonly ariaLabel = input<string>();
    readonly clicked = output<MouseEvent>();
    readonly isDisabled = computed(
        () => this.disabled() || this.loading()
    );

    onClick(event: MouseEvent): void {
        if (this.isDisabled()) {
            event.preventDefault();
            return;
        }

        this.clicked.emit(event);
    }
}