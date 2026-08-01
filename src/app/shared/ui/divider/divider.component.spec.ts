import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UiDividerComponent } from './divider.component';

describe('UiDividerComponent', () => {
  let fixture: ComponentFixture<UiDividerComponent>;
  let component: UiDividerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiDividerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiDividerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('decorative', () => {
    it('defaults to false', () => {
      expect(component.decorative()).toBeFalse();
    });

    it('preserves native separator semantics by default (no aria-hidden)', () => {
      const hr = fixture.debugElement.query(By.css('hr')).nativeElement;
      expect(hr.hasAttribute('aria-hidden')).toBeFalse();
    });

    it('adds aria-hidden="true" when decorative is set', () => {
      fixture.componentRef.setInput('decorative', true);
      fixture.detectChanges();

      const hr = fixture.debugElement.query(By.css('hr')).nativeElement;
      expect(hr.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('rendering', () => {
    it('renders a semantic hr element', () => {
      const hr = fixture.debugElement.query(By.css('hr'));
      expect(hr.nativeElement.tagName).toBe('HR');
    });

    it('renders the internal wrapper inside the host', () => {
      const host = fixture.nativeElement as HTMLElement;
      expect(host.querySelector('hr.ui-divider')).toBeTruthy();
    });

    it('does not render the component class on the host element', () => {
      const host = fixture.nativeElement as HTMLElement;
      expect(host.classList.contains('ui-divider')).toBeFalse();
    });
  });
});
