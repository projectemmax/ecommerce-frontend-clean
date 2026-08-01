import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UiSpinnerComponent } from './spinner.component';

describe('UiSpinnerComponent', () => {
  let fixture: ComponentFixture<UiSpinnerComponent>;
  let component: UiSpinnerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiSpinnerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('size', () => {
    it('defaults to md', () => {
      expect(component.size()).toBe('md');
    });

    it('applies the sm class when size is sm', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();

      const spinner = fixture.debugElement.query(By.css('.ui-spinner')).nativeElement;
      expect(spinner.classList.contains('ui-spinner--sm')).toBeTrue();
    });

    it('applies the md class when size is md', () => {
      fixture.componentRef.setInput('size', 'md');
      fixture.detectChanges();

      const spinner = fixture.debugElement.query(By.css('.ui-spinner')).nativeElement;
      expect(spinner.classList.contains('ui-spinner--md')).toBeTrue();
    });
  });

  describe('rendering', () => {
    it('renders a semantic span element', () => {
      const spinner = fixture.debugElement.query(By.css('.ui-spinner'));
      expect(spinner.nativeElement.tagName).toBe('SPAN');
    });

    it('renders the internal wrapper inside the host', () => {
      const host = fixture.nativeElement as HTMLElement;
      expect(host.querySelector('.ui-spinner')).toBeTruthy();
    });

    it('does not render the size class on the host element', () => {
      const host = fixture.nativeElement as HTMLElement;
      expect(host.classList.contains('ui-spinner')).toBeFalse();
    });
  });

  describe('accessibility', () => {
    it('is decorative with aria-hidden="true"', () => {
      const spinner = fixture.debugElement.query(By.css('.ui-spinner')).nativeElement;
      expect(spinner.getAttribute('aria-hidden')).toBe('true');
    });
  });
});
