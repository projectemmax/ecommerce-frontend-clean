import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { UiDialogComponent } from './dialog.component';
import { DialogSize } from './dialog.types';

@Component({
  standalone: true,
  imports: [UiDialogComponent],
  template: `
    <ui-dialog
      [open]="open"
      (close)="close()">
      <h2 id="dialog-title">Dialog title</h2>
      <button type="button">Cancel</button>
      <button type="button">Save</button>
    </ui-dialog>
  `,
})
class DialogHostComponent {
  open = false;
  closed = 0;

  close(): void {
    this.closed++;
  }
}

describe('UiDialogComponent', () => {
  let fixture: ComponentFixture<UiDialogComponent>;
  let component: UiDialogComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function backdrop(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.ui-dialog__backdrop');
  }

  function panel(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.ui-dialog__panel');
  }

  describe('rendering', () => {
    it('renders nothing when closed', () => {
      expect(backdrop()).toBeNull();
      expect(panel()).toBeNull();
    });

    it('renders backdrop and panel when open', () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();
      expect(backdrop()).toBeTruthy();
      expect(panel()).toBeTruthy();
    });
  });

  describe('aria', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();
    });

    it('sets role and aria-modal on the panel', () => {
      expect(panel()!.getAttribute('role')).toBe('dialog');
      expect(panel()!.getAttribute('aria-modal')).toBe('true');
    });

    it('wires aria-labelledby when provided', () => {
      fixture.componentRef.setInput('ariaLabelledby', 'dialog-title');
      fixture.detectChanges();
      expect(panel()!.getAttribute('aria-labelledby')).toBe('dialog-title');
    });

    it('omits aria-labelledby when not provided', () => {
      expect(panel()!.hasAttribute('aria-labelledby')).toBeFalse();
    });
  });

  describe('size', () => {
    it('applies the size class for every supported size', () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      const sizes: DialogSize[] = ['sm', 'md', 'lg'];
      sizes.forEach((size: DialogSize) => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();
        expect(panel()!.classList.contains(`ui-dialog--${size}`)).toBeTrue();
      });
    });

    it('applies the maxWidth override', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('maxWidth', '1100px');
      fixture.detectChanges();
      expect(panel()!.style.maxWidth).toBe('1100px');
    });
  });

  describe('escape', () => {
    it('emits close on Escape when open', () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      let closed = 0;
      component.close.subscribe(() => closed++);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(closed).toBe(1);
    });

    it('ignores Escape when closed', () => {
      let closed = 0;
      component.close.subscribe(() => closed++);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(closed).toBe(0);
    });
  });

  describe('backdrop click', () => {
    it('emits close when closeOnBackdrop is set', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('closeOnBackdrop', true);
      fixture.detectChanges();

      let closed = 0;
      component.close.subscribe(() => closed++);

      backdrop()!.click();
      expect(closed).toBe(1);
    });

    it('does not emit close when closeOnBackdrop is not set', () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      let closed = 0;
      component.close.subscribe(() => closed++);

      backdrop()!.click();
      expect(closed).toBe(0);
    });
  });

  describe('body scroll lock', () => {
    it('locks body scroll when open and restores when closed', () => {
      document.body.style.overflow = '';

      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();
      expect(document.body.style.overflow).toBe('hidden');

      fixture.componentRef.setInput('open', false);
      fixture.detectChanges();
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('close button', () => {
    it('renders a close button that emits close when clicked', () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      let closed = 0;
      component.close.subscribe(() => closed++);

      const btn = fixture.nativeElement.querySelector('.ui-dialog__close') as HTMLButtonElement;
      expect(btn).toBeTruthy();
      expect(btn.getAttribute('aria-label')).toBe('Close dialog');

      btn.click();
      expect(closed).toBe(1);
    });

    it('hides the close button when showClose is false', () => {
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('showClose', false);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.ui-dialog__close')).toBeNull();
    });
  });
});

describe('UiDialogComponent (focus management)', () => {
  let fixture: ComponentFixture<DialogHostComponent>;
  let host: DialogHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function buttons(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('button'));
  }

  function closeButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.ui-dialog__close') as HTMLButtonElement;
  }

  it('focuses the close button when opened (first focusable)', () => {
    host.open = true;
    fixture.detectChanges();

    expect(document.activeElement).toBe(closeButton());
  });

  it('traps focus on Tab', () => {
    host.open = true;
    fixture.detectChanges();

    buttons()[2].focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));

    expect(document.activeElement).toBe(closeButton());
  });

  it('traps focus on Shift+Tab', () => {
    host.open = true;
    fixture.detectChanges();

    closeButton().focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true }));

    expect(document.activeElement).toBe(buttons()[2]);
  });

  it('emits a close request through the host binding', () => {
    host.open = true;
    fixture.detectChanges();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(host.closed).toBe(1);
  });
});
