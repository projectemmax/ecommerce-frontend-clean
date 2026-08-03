import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UiMenuItemComponent } from './menu-item.component';
import { MenuContext } from './menu-context';

describe('UiMenuItemComponent', () => {
  let fixture: ComponentFixture<UiMenuItemComponent>;
  let component: UiMenuItemComponent;
  let context: MenuContext;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiMenuItemComponent],
      providers: [MenuContext],
    }).compileComponents();

    context = TestBed.inject(MenuContext);

    fixture = TestBed.createComponent(UiMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function button(): HTMLButtonElement {
    return fixture.debugElement.query(By.css('button[role="menuitem"]')).nativeElement;
  }

  it('renders a button with the menuitem role', () => {
    expect(button()).toBeTruthy();
  });

  it('requests close through the context on click', () => {
    let closed = 0;
    context.setCloseFn(() => closed++);

    button().click();
    expect(closed).toBe(1);
  });

  it('does not request close when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    let closed = 0;
    context.setCloseFn(() => closed++);

    button().click();
    expect(closed).toBe(0);
  });

  it('sets aria-disabled and disables the button when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(button().getAttribute('aria-disabled')).toBe('true');
    expect(button().disabled).toBeTrue();
  });

  it('applies the destructive class when destructive is set', () => {
    fixture.componentRef.setInput('destructive', true);
    fixture.detectChanges();

    expect(button().classList.contains('ui-menu-item--destructive')).toBeTrue();
  });

  it('is focusable programmatically', () => {
    component.focus();
    expect(document.activeElement).toBe(button());
    expect(component.isFocused()).toBeTrue();
  });
});
