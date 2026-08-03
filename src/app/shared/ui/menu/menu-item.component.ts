import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { MenuContext } from './menu-context';

@Component({
  selector: 'ui-menu-item',
  standalone: true,
  imports: [NgClass],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiMenuItemComponent {
  readonly disabled = input(false, {
      transform: booleanAttribute,
  });
  readonly destructive = input(false, {
      transform: booleanAttribute,
  });

  private readonly context = inject(MenuContext);
  private readonly buttonRef = viewChild<ElementRef<HTMLButtonElement>>('itemButton');

  onClick(): void {
    if (!this.disabled()) {
      this.context.requestClose();
    }
  }

  focus(): void {
    this.buttonRef()?.nativeElement.focus();
  }

  isFocused(): boolean {
    return this.buttonRef()?.nativeElement === document.activeElement;
  }
}
