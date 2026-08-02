import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { UiTabsComponent } from './tabs.component';
import { UiTabComponent } from './tab.component';
import { UiTabPanelComponent } from './tab-panel.component';

@Component({
  standalone: true,
  imports: [UiTabsComponent, UiTabComponent, UiTabPanelComponent],
  template: `
    <ui-tabs [activeIndex]="activeIndex" (activeIndexChange)="onChange($event)">
      <ui-tab>Products</ui-tab>
      <ui-tab>Orders</ui-tab>
      <ui-tab-panel>Products panel</ui-tab-panel>
      <ui-tab-panel>Orders panel</ui-tab-panel>
    </ui-tabs>
  `,
})
class ControlledHostComponent {
  activeIndex = 0;
  emitted: number[] = [];

  onChange(index: number): void {
    this.emitted.push(index);
    this.activeIndex = index;
  }
}

@Component({
  standalone: true,
  imports: [UiTabsComponent, UiTabComponent, UiTabPanelComponent],
  template: `
    <ui-tabs (activeIndexChange)="onChange($event)">
      <ui-tab>Products</ui-tab>
      <ui-tab>Orders</ui-tab>
      <ui-tab-panel>Products panel</ui-tab-panel>
      <ui-tab-panel>Orders panel</ui-tab-panel>
    </ui-tabs>
  `,
})
class NonUpdatingHostComponent {
  emitted: number[] = [];

  onChange(index: number): void {
    this.emitted.push(index);
  }
}

describe('UiTabsComponent', () => {
  describe('controlled host', () => {
    let fixture: ComponentFixture<ControlledHostComponent>;
    let host: ControlledHostComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ControlledHostComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(ControlledHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();
    });

    function tabs(): HTMLElement[] {
      return fixture.debugElement
        .queryAll(By.css('button[role="tab"]'))
        .map((d) => d.nativeElement);
    }

    function panels(): HTMLElement[] {
      return fixture.debugElement
        .queryAll(By.css('[role="tabpanel"]'))
        .map((d) => d.nativeElement);
    }

    function tablist(): HTMLElement {
      return fixture.debugElement.query(By.css('[role="tablist"]')).nativeElement;
    }

    async function settle(): Promise<void> {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    }

    it('renders two tabs and two panels', () => {
      expect(tabs().length).toBe(2);
      expect(panels().length).toBe(2);
      expect(tabs()[0].textContent).toContain('Products');
      expect(panels()[0].textContent).toContain('Products panel');
    });

    it('marks the first tab active and its panel visible by default', () => {
      expect(tabs()[0].getAttribute('aria-selected')).toBe('true');
      expect(tabs()[1].getAttribute('aria-selected')).toBe('false');
      expect(panels()[0].hasAttribute('hidden')).toBeFalse();
      expect(panels()[1].hasAttribute('hidden')).toBeTrue();
    });

    it('uses roving tabindex (active 0, inactive -1)', () => {
      expect(tabs()[0].tabIndex).toBe(0);
      expect(tabs()[1].tabIndex).toBe(-1);
    });

    it('pairs each tab with its panel via aria-controls/aria-labelledby', () => {
      const tabId0 = tabs()[0].getAttribute('id');
      const panelId0 = panels()[0].getAttribute('id');
      expect(tabs()[0].getAttribute('aria-controls')).toBe(panelId0);
      expect(panels()[0].getAttribute('aria-labelledby')).toBe(tabId0);
    });

    it('activates a tab on click and reveals its panel', async () => {
      tabs()[1].click();
      await settle();

      expect(host.emitted).toEqual([1]);
      expect(host.activeIndex).toBe(1);
      expect(tabs()[1].getAttribute('aria-selected')).toBe('true');
      expect(panels()[0].hasAttribute('hidden')).toBeTrue();
      expect(panels()[1].hasAttribute('hidden')).toBeFalse();
    });

    it('moves focus and activates on ArrowRight', async () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true });
      tablist().dispatchEvent(event);
      await settle();

      expect(host.emitted).toEqual([1]);
      expect(document.activeElement).toBe(tabs()[1]);
    });

    it('activates on ArrowLeft with wraparound', async () => {
      host.activeIndex = 0;
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true });
      tablist().dispatchEvent(event);
      await settle();

      expect(host.emitted).toEqual([1]);
      expect(document.activeElement).toBe(tabs()[1]);
    });

    it('activates the first tab on Home', async () => {
      host.activeIndex = 1;
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Home', cancelable: true });
      tablist().dispatchEvent(event);
      await settle();

      expect(host.emitted).toEqual([0]);
      expect(document.activeElement).toBe(tabs()[0]);
    });

    it('activates the last tab on End', async () => {
      const event = new KeyboardEvent('keydown', { key: 'End', cancelable: true });
      tablist().dispatchEvent(event);
      await settle();

      expect(host.emitted).toEqual([1]);
      expect(document.activeElement).toBe(tabs()[1]);
    });

    it('ignores non-navigation keys', async () => {
      const event = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
      tablist().dispatchEvent(event);
      await settle();

      expect(host.emitted).toEqual([]);
    });
  });

  describe('consumer is source of truth', () => {
    let fixture: ComponentFixture<NonUpdatingHostComponent>;
    let host: NonUpdatingHostComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [NonUpdatingHostComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(NonUpdatingHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('emits selection intent but keeps the displayed active tab when the consumer does not update state', () => {
      const tab2 = fixture.debugElement.queryAll(By.css('button[role="tab"]'))[1].nativeElement;
      tab2.click();
      fixture.detectChanges();

      expect(host.emitted).toEqual([1]);

      const activeTabs = fixture.debugElement.queryAll(By.css('button[role="tab"][aria-selected="true"]'));
      expect(activeTabs.length).toBe(1);
      expect(activeTabs[0].nativeElement.textContent).toContain('Products');
    });
  });

  describe('initial active index', () => {
    @Component({
      standalone: true,
      imports: [UiTabsComponent, UiTabComponent, UiTabPanelComponent],
      template: `
        <ui-tabs [activeIndex]="1">
          <ui-tab>Products</ui-tab>
          <ui-tab>Orders</ui-tab>
          <ui-tab-panel>Products panel</ui-tab-panel>
          <ui-tab-panel>Orders panel</ui-tab-panel>
        </ui-tabs>
      `,
    })
    class InitialActiveHostComponent {}

    it('reflects a non-default initial active index', async () => {
      await TestBed.configureTestingModule({
        imports: [InitialActiveHostComponent],
      }).compileComponents();

      const fixture = TestBed.createComponent(InitialActiveHostComponent);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const tabsEl = fixture.debugElement.queryAll(By.css('button[role="tab"]')).map((d) => d.nativeElement);
      const panelsEl = fixture.debugElement.queryAll(By.css('[role="tabpanel"]')).map((d) => d.nativeElement);

      expect(tabsEl[1].getAttribute('aria-selected')).toBe('true');
      expect(panelsEl[0].hasAttribute('hidden')).toBeTrue();
      expect(panelsEl[1].hasAttribute('hidden')).toBeFalse();
    });
  });
});
