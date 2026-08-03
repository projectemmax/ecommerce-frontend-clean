import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { UiMenuComponent } from './menu.component';
import { UiMenuItemComponent } from './menu-item.component';

@Component({
  standalone: true,
  imports: [UiMenuComponent, UiMenuItemComponent],
  template: `
    <ui-menu [open]="open" (close)="close()">
      <ui-menu-item>First</ui-menu-item>
      <ui-menu-item>Second</ui-menu-item>
      <ui-menu-item disabled>Third</ui-menu-item>
    </ui-menu>
  `,
})
class MenuHostComponent {
  open = false;
  closed = 0;

  close(): void {
    this.closed++;
  }
}

describe('UiMenuComponent', () => {
  let fixture: ComponentFixture<MenuHostComponent>;
  let host: MenuHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function surface(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.ui-menu');
  }

  function items(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('[role="menuitem"]'));
  }

  describe('rendering', () => {
    it('renders nothing when closed', () => {
      expect(surface()).toBeNull();
    });

    it('renders the menu surface with items when open', () => {
      host.open = true;
      fixture.detectChanges();
      expect(surface()!.getAttribute('role')).toBe('menu');
      expect(items().length).toBe(3);
    });
  });

  describe('escape', () => {
    it('emits close on Escape when open', () => {
      host.open = true;
      fixture.detectChanges();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(host.closed).toBe(1);
    });

    it('ignores Escape when closed', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(host.closed).toBe(0);
    });
  });

  describe('outside click', () => {
    it('emits close when clicking outside the menu', async () => {
      host.open = true;
      fixture.detectChanges();
      await fixture.whenStable();

      document.body.click();
      expect(host.closed).toBe(1);
    });

    it('does not close when clicking inside the menu surface', async () => {
      host.open = true;
      fixture.detectChanges();
      await fixture.whenStable();

      surface()!.click();
      expect(host.closed).toBe(0);
    });
  });

  describe('item activation', () => {
    it('emits close when an item is activated', () => {
      host.open = true;
      fixture.detectChanges();
      items()[1].click();
      expect(host.closed).toBe(1);
    });
  });

  describe('keyboard navigation', () => {
    beforeEach(() => {
      host.open = true;
      fixture.detectChanges();
    });

    it('focuses the first enabled item when opened', () => {
      expect(document.activeElement).toBe(items()[0]);
    });

    it('moves focus to the next enabled item on ArrowDown', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      expect(document.activeElement).toBe(items()[1]);
    });

    it('skips disabled items on ArrowDown', () => {
      items()[1].focus();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      expect(document.activeElement).toBe(items()[0]);
    });

    it('wraps focus to the last item on ArrowUp', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      expect(document.activeElement).toBe(items()[1]);
    });

    it('moves focus to the first item on Home', () => {
      items()[1].focus();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
      expect(document.activeElement).toBe(items()[0]);
    });

    it('moves focus to the last enabled item on End', () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
      expect(document.activeElement).toBe(items()[1]);
    });
  });
});
