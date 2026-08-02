import {
  AfterViewChecked,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  OnDestroy,
  output,
  viewChild,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { UiIconComponent } from '@app/shared/ui/icon';
import { DialogSize } from './dialog.types';

@Component({
  selector: 'ui-dialog',
  standalone: true,
  imports: [NgClass, UiIconComponent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'onDocumentKeydown($event)',
  },
})
export class UiDialogComponent implements AfterViewChecked, OnDestroy {
  readonly open = input(false, {
      transform: booleanAttribute,
  });
  readonly size = input<DialogSize>('md');
  readonly maxWidth = input<string>();
  readonly ariaLabelledby = input<string>();
  readonly closeOnBackdrop = input(false, {
      transform: booleanAttribute,
  });
  readonly showClose = input(true, {
      transform: booleanAttribute,
  });

  readonly close = output<void>();

  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('dialogPanel');

  private wasOpen = false;
  private previousOverflow = '';
  private previousFocusedElement: HTMLElement | null = null;

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

  onBackdropClick(): void {
    if (this.closeOnBackdrop()) {
      this.close.emit();
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

    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  private activate(): void {
    this.previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    this.previousFocusedElement = document.activeElement as HTMLElement | null;
    this.setInitialFocus();
  }

  private deactivate(): void {
    document.body.style.overflow = this.previousOverflow;
    this.previousOverflow = '';

    this.previousFocusedElement?.focus();
    this.previousFocusedElement = null;
  }

  private setInitialFocus(): void {
    const panel = this.panelRef()?.nativeElement;
    if (!panel) {
      return;
    }

    const first = this.getFocusableElements(panel)[0];
    if (first) {
      first.focus();
    } else {
      panel.focus();
    }
  }

  private trapFocus(event: KeyboardEvent): void {
    const panel = this.panelRef()?.nativeElement;
    if (!panel) {
      return;
    }

    const focusable = this.getFocusableElements(panel);
    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey) {
      if (active === first || !panel.contains(active)) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (active === last || !panel.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  private getFocusableElements(panel: HTMLElement): HTMLElement[] {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    return Array.from(panel.querySelectorAll<HTMLElement>(selector));
  }
}
