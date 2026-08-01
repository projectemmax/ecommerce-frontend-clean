import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { UiCardComponent } from './card.component';
import { CardVariant } from './card.types';

describe('UiCardComponent', () => {
  let fixture: ComponentFixture<UiCardComponent>;
  let component: UiCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('variant', () => {
    it('defaults to outlined', () => {
      expect(component.variant()).toBe('outlined');
    });

    it('does not apply the elevated class by default', () => {
      const host = fixture.nativeElement as HTMLElement;
      expect(host.classList.contains('ui-card--elevated')).toBeFalse();
    });

    it('applies the elevated class when variant is elevated', () => {
      fixture.componentRef.setInput('variant', 'elevated');
      fixture.detectChanges();

      const host = fixture.nativeElement as HTMLElement;
      expect(host.classList.contains('ui-card--elevated')).toBeTrue();
    });

    it('supports every variant', () => {
      const variants: CardVariant[] = ['outlined', 'elevated'];

      variants.forEach((variant: CardVariant) => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();

        const host = fixture.nativeElement as HTMLElement;
        expect(host.classList.contains('ui-card--elevated')).toBe(variant === 'elevated');
      });
    });
  });

  describe('rendering', () => {
    it('styles the host as the card (no internal wrapper)', () => {
      const host = fixture.nativeElement as HTMLElement;
      expect(host.children.length).toBe(0);
    });

    it('keeps consumer utility classes on the host element', () => {
      const host = fixture.nativeElement as HTMLElement;
      host.classList.add('p-4');
      host.classList.add('mb-3');
      expect(host.classList.contains('p-4')).toBeTrue();
      expect(host.classList.contains('mb-3')).toBeTrue();
    });
  });
});

describe('UiCardComponent (with projected content)', () => {
  @Component({
    standalone: true,
    imports: [UiCardComponent],
    template: `
      <ui-card class="p-4 mb-4">
        <h5>Section Title</h5>
        <p>Body content goes here.</p>
      </ui-card>
    `,
  })
  class HostComponent {}

  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('projects consumer content', () => {
    const host = fixture.nativeElement as HTMLElement;
    expect(host.textContent).toContain('Section Title');
    expect(host.textContent).toContain('Body content goes here.');
  });

  it('keeps consumer classes on the host element', () => {
    const card = fixture.nativeElement.querySelector('ui-card') as HTMLElement;
    expect(card.classList.contains('p-4')).toBeTrue();
    expect(card.classList.contains('mb-4')).toBeTrue();
  });
});
