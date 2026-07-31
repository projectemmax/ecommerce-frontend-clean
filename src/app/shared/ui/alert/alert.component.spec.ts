import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { UiAlertComponent } from './alert.component';
import { AlertVariant } from './alert.types';

describe('UiAlertComponent', () => {
  let fixture: ComponentFixture<UiAlertComponent>;
  let component: UiAlertComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiAlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiAlertComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('variant', 'info');
    fixture.detectChanges();
  });

  describe('variant', () => {
    it('requires a variant input', () => {
      expect(component.variant).toBeDefined();
    });

    it('applies the correct class for every supported variant', () => {
      const variants: AlertVariant[] = ['success', 'warning', 'danger', 'info'];

      variants.forEach((variant: AlertVariant) => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();

        const alert = fixture.debugElement.query(By.css('.ui-alert')).nativeElement;
        expect(alert.classList.contains(`ui-alert--${variant}`)).toBeTrue();
      });
    });

    it('updates the variant class when the variant changes', () => {
      fixture.componentRef.setInput('variant', 'danger');
      fixture.detectChanges();

      fixture.componentRef.setInput('variant', 'success');
      fixture.detectChanges();

      const alert = fixture.debugElement.query(By.css('.ui-alert')).nativeElement;
      expect(alert.classList.contains('ui-alert--success')).toBeTrue();
      expect(alert.classList.contains('ui-alert--danger')).toBeFalse();
    });
  });

  describe('rendering', () => {
    it('renders a semantic div element', () => {
      const alert = fixture.debugElement.query(By.css('.ui-alert'));
      expect(alert.nativeElement.tagName).toBe('DIV');
    });

    it('renders the internal wrapper inside the host', () => {
      const host = fixture.nativeElement as HTMLElement;
      expect(host.querySelector('.ui-alert')).toBeTruthy();
    });

    it('does not render the variant class on the host element', () => {
      const host = fixture.nativeElement as HTMLElement;
      expect(host.classList.contains('ui-alert')).toBeFalse();
    });
  });
});

describe('UiAlertComponent (with projected content)', () => {
  @Component({
    standalone: true,
    imports: [UiAlertComponent],
    template: `
      <ui-alert variant="danger">
        <i class="fa fa-warning"></i>
        Invalid credentials
      </ui-alert>
    `,
  })
  class IconTextHostComponent {}

  @Component({
    standalone: true,
    imports: [UiAlertComponent],
    template: `
      <ui-alert variant="warning">
        This will also deactivate
        <strong>{{ count }}</strong> descendant categories.
      </ui-alert>
    `,
  })
  class RichTextHostComponent {
    count = 3;
  }

  let fixture: ComponentFixture<IconTextHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconTextHostComponent, RichTextHostComponent],
    }).compileComponents();
  });

  it('projects plain text content', () => {
    const host = TestBed.createComponent(RichTextHostComponent);
    host.detectChanges();

    const alert = host.debugElement.query(By.css('.ui-alert')).nativeElement;
    expect(alert.textContent).toContain('descendant categories');
  });

  it('projects rich content including strong elements', () => {
    const host = TestBed.createComponent(RichTextHostComponent);
    host.detectChanges();

    const alert = host.debugElement.query(By.css('.ui-alert')).nativeElement;
    expect(alert.querySelector('strong')).toBeTruthy();
    expect(alert.querySelector('strong').textContent).toContain('3');
  });

  it('projects icon and text content together', () => {
    fixture = TestBed.createComponent(IconTextHostComponent);
    fixture.detectChanges();

    const alert = fixture.debugElement.query(By.css('.ui-alert')).nativeElement;
    expect(alert.querySelector('i.fa-warning')).toBeTruthy();
    expect(alert.textContent).toContain('Invalid credentials');
  });
});
