import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { UiBadgeComponent } from './badge.component';
import { BadgeVariant } from './badge.types';

describe('UiBadgeComponent', () => {
  let fixture: ComponentFixture<UiBadgeComponent>;
  let component: UiBadgeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('variant', () => {
    it('defaults to secondary', () => {
      expect(component.variant()).toBe('secondary');
    });

    it('applies the default secondary variant class', () => {
      const badge = fixture.debugElement.query(By.css('.ui-badge')).nativeElement;
      expect(badge.classList.contains('ui-badge--secondary')).toBeTrue();
    });

    it('applies the correct class for every supported variant', () => {
      const variants: BadgeVariant[] = ['primary', 'secondary', 'success', 'warning', 'danger', 'info'];

      variants.forEach((variant: BadgeVariant) => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();

        const badge = fixture.debugElement.query(By.css('.ui-badge')).nativeElement;
        expect(badge.classList.contains(`ui-badge--${variant}`)).toBeTrue();
      });
    });

    it('updates the variant class when the variant changes', () => {
      fixture.componentRef.setInput('variant', 'success');
      fixture.detectChanges();

      fixture.componentRef.setInput('variant', 'danger');
      fixture.detectChanges();

      const badge = fixture.debugElement.query(By.css('.ui-badge')).nativeElement;
      expect(badge.classList.contains('ui-badge--danger')).toBeTrue();
      expect(badge.classList.contains('ui-badge--success')).toBeFalse();
    });
  });

  describe('content projection', () => {
    it('uses a semantic span element', () => {
      const badge = fixture.debugElement.query(By.css('.ui-badge'));
      expect(badge.nativeElement.tagName).toBe('SPAN');
    });
  });

  describe('rendering', () => {
    it('renders the internal wrapper inside the host', () => {
      const host = fixture.nativeElement as HTMLElement;
      expect(host.querySelector('.ui-badge')).toBeTruthy();
    });

    it('does not render the variant class on the host element', () => {
      const host = fixture.nativeElement as HTMLElement;
      expect(host.classList.contains('ui-badge')).toBeFalse();
    });
  });
});

describe('UiBadgeComponent (with projected content)', () => {
  @Component({
    standalone: true,
    imports: [UiBadgeComponent],
    template: `
      <ui-badge variant="warning">
        <i class="fa fa-star"></i>
        Featured
      </ui-badge>
    `,
  })
  class TestHostComponent {}

  @Component({
    standalone: true,
    imports: [UiBadgeComponent],
    template: `
      <ui-badge variant="success">
        Published
      </ui-badge>
    `,
  })
  class TextOnlyHostComponent {}

  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, TextOnlyHostComponent],
    }).compileComponents();
  });

  it('projects text content', () => {
    const host = TestBed.createComponent(TextOnlyHostComponent);
    host.detectChanges();

    const badge = host.debugElement.query(By.css('.ui-badge')).nativeElement;
    expect(badge.textContent).toContain('Published');
  });

  it('projects icon and text content together', () => {
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const badge = fixture.debugElement.query(By.css('.ui-badge')).nativeElement;
    expect(badge.querySelector('i.fa-star')).toBeTruthy();
    expect(badge.textContent).toContain('Featured');
  });
});
