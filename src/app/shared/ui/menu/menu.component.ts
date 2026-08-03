import {
  AfterViewChecked,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
} from '@angular/core';
import { MenuContext } from './menu-context';
import { UiMenuItemComponent } from './menu-item.component';

@Component({
  selector: 'ui-menu',
  standalone: true,
  providers: [MenuContext],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'onDocumentKeydown($event)',
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class UiMenuComponent implements AfterViewChecked, OnDestroy {
  readonly open = input(false, {
      transform: booleanAttribute,
  });
  readonly close = output<void>();

  readonly items = contentChildren(UiMenuItemComponent);
  private readonly context = inject(MenuContext);
  private readonly elementRef = inject(ElementRef);

  private wasOpen = false;
  private ignoreNextClick = false;
  private previousFocused: HTMLElement | null = null;

  constructor() {
    this.context.setCloseFn(() => this.close.emit());
  }

  ngAfterViewChecked(): void {
    const isOpen = this.open();

    if (isOpen && !this.wasOpen) {
      this.wasOpen = true;
      this.activate();
    } else if (!isOpen && this.wasOpen) {
      this.wasOpen = false;
      this.deactivate();
    }
  }

  ngOnDestroy(): void {
    if (this.wasOpen) {
      this.deactivate();
    }
  }

  onDocumentKeydown(event: KeyboardEvent): void {
    if (!this.open()) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.close.emit();
      return;
    }

    const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(event.key)) {
      return;
    }

    event.preventDefault();

    const enabled = this.items().filter((item) => !item.disabled());
    if (enabled.length === 0) {
      return;
    }

    const current = enabled.findIndex((item) => item.isFocused());
    const base = current === -1 ? 0 : current;
    let next = base;

    switch (event.key) {
      case 'ArrowDown':
        next = (base + 1) % enabled.length;
        break;
      case 'ArrowUp':
        next = (base - 1 + enabled.length) % enabled.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = enabled.length - 1;
        break;
    }

    enabled[next].focus();
  }

  onDocumentClick(event: MouseEvent): void {
    if (!this.open()) {
      return;
    }

    if (this.ignoreNextClick) {
      return;
    }

    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.close.emit();
    }
  }

  private activate(): void {
    this.previousFocused = document.activeElement as HTMLElement | null;
    this.ignoreNextClick = true;
    setTimeout(() => {
      this.ignoreNextClick = false;
    }, 0);

    const firstEnabled = this.items().find((item) => !item.disabled());
    firstEnabled?.focus();
  }

  private deactivate(): void {
    this.previousFocused?.focus();
    this.previousFocused = null;
  }
}
