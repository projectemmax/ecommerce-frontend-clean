import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { UiRadioComponent } from './radio.component';

describe('UiRadioComponent', () => {
  let fixture: ComponentFixture<UiRadioComponent>;
  let component: UiRadioComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiRadioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiRadioComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('name', 'group');
    fixture.componentRef.setInput('value', 'A');
    fixture.detectChanges();
  });

  // ============================================================
  // ControlValueAccessor
  // ============================================================

  describe('writeValue', () => {
    it('stores the incoming value in innerValue', () => {
      component.writeValue('A');
      expect(component.innerValue()).toBe('A');
    });

    it('stores non-string values without coercion', () => {
      component.writeValue(42);
      expect(component.innerValue()).toBe(42);
    });

    it('stores null without coercion', () => {
      component.writeValue(null);
      expect(component.innerValue()).toBeNull();
    });
  });

  describe('registerOnChange', () => {
    it('invokes the registered callback with the radio value when checked', () => {
      const spy = jasmine.createSpy('onChange');
      component.registerOnChange(spy);

      const input = fixture.debugElement.query(By.css('input[type="radio"]')).nativeElement;
      input.checked = true;
      input.dispatchEvent(new Event('change'));

      expect(spy).toHaveBeenCalledWith('A');
    });

    it('does not invoke the callback when the radio is unchecked', () => {
      const spy = jasmine.createSpy('onChange');
      component.registerOnChange(spy);

      const input = fixture.debugElement.query(By.css('input[type="radio"]')).nativeElement;
      input.checked = false;
      input.dispatchEvent(new Event('change'));

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('registerOnTouched', () => {
    it('invokes the registered callback on blur', () => {
      const spy = jasmine.createSpy('onTouched');
      component.registerOnTouched(spy);

      const input = fixture.debugElement.query(By.css('input[type="radio"]')).nativeElement;
      input.dispatchEvent(new Event('blur'));

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('setDisabledState', () => {
    it('disables the native input when set to true', () => {
      component.setDisabledState(true);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[type="radio"]')).nativeElement;
      expect(input.disabled).toBeTrue();
    });

    it('enables the native input when set to false', () => {
      component.setDisabledState(true);
      fixture.detectChanges();

      component.setDisabledState(false);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[type="radio"]')).nativeElement;
      expect(input.disabled).toBeFalse();
    });
  });

  // ============================================================
  // Checked state computation
  // ============================================================

  describe('isChecked', () => {
    it('is true when innerValue strictly equals value', () => {
      component.writeValue('A');
      fixture.detectChanges();
      expect(component.isChecked()).toBeTrue();
    });

    it('is false when innerValue differs from value', () => {
      component.writeValue('B');
      fixture.detectChanges();
      expect(component.isChecked()).toBeFalse();
    });

    it('is false before any value is provided', () => {
      expect(component.isChecked()).toBeFalse();
    });
  });

  // ============================================================
  // ID generation
  // ============================================================

  describe('radioId', () => {
    it('generates a fallback id when id is omitted', () => {
      expect(component.radioId()).toMatch(/^ui-radio-\d+$/);
    });

    it('uses the explicit id override when provided', () => {
      fixture.componentRef.setInput('id', 'custom-radio-id');
      fixture.detectChanges();
      expect(component.radioId()).toBe('custom-radio-id');
    });

    it('associates the label with the input via for/id', () => {
      fixture.componentRef.setInput('label', 'Option A');
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[type="radio"]')).nativeElement;
      const label = fixture.debugElement.query(By.css('label')).nativeElement;
      expect(label.getAttribute('for')).toBe(input.id);
    });
  });

  // ============================================================
  // Rendering
  // ============================================================

  describe('template', () => {
    it('renders the native radio input', () => {
      const input = fixture.debugElement.query(By.css('input[type="radio"]')).nativeElement;
      expect(input).toBeTruthy();
    });

    it('binds the required name for native grouping', () => {
      const input = fixture.debugElement.query(By.css('input[type="radio"]')).nativeElement;
      expect(input.getAttribute('name')).toBe('group');
    });

    it('binds the value attribute', () => {
      const input = fixture.debugElement.query(By.css('input[type="radio"]')).nativeElement;
      expect(input.getAttribute('value')).toBe('A');
    });

    it('renders the label text', () => {
      fixture.componentRef.setInput('label', 'Option A');
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('label')).nativeElement;
      expect(label.textContent).toContain('Option A');
    });

    it('renders the required asterisk and required attribute', () => {
      fixture.componentRef.setInput('label', 'Option A');
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      const asterisk = fixture.debugElement.query(By.css('label .text-danger')).nativeElement;
      expect(asterisk.textContent).toContain('*');

      const input = fixture.debugElement.query(By.css('input[type="radio"]')).nativeElement;
      expect(input.hasAttribute('required')).toBeTrue();
    });

    it('omits the required attribute when not required', () => {
      const input = fixture.debugElement.query(By.css('input[type="radio"]')).nativeElement;
      expect(input.hasAttribute('required')).toBeFalse();
    });

    it('applies disabled state from the disabled input', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[type="radio"]')).nativeElement;
      expect(input.disabled).toBeTrue();
    });

    it('sets aria-invalid when an error is present', () => {
      fixture.componentRef.setInput('error', 'Select an option.');
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input[type="radio"]')).nativeElement;
      expect(input.getAttribute('aria-invalid')).toBe('true');
    });

    it('omits aria-invalid when no error is present', () => {
      const input = fixture.debugElement.query(By.css('input[type="radio"]')).nativeElement;
      expect(input.getAttribute('aria-invalid')).toBeNull();
    });

    it('visually hides the label when hideLabel is true', () => {
      fixture.componentRef.setInput('label', 'Option A');
      fixture.componentRef.setInput('hideLabel', true);
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('label')).nativeElement;
      expect(label.classList.contains('visually-hidden')).toBeTrue();
    });

    it('renders helper text through ui-field', () => {
      fixture.componentRef.setInput('helperText', 'Choose one.');
      fixture.detectChanges();

      const helper = fixture.debugElement.query(By.css('.ui-field__helper')).nativeElement;
      expect(helper.textContent).toContain('Choose one.');
    });

    it('renders error text through ui-field', () => {
      fixture.componentRef.setInput('error', 'Required.');
      fixture.detectChanges();

      const error = fixture.debugElement.query(By.css('.ui-field__error')).nativeElement;
      expect(error.textContent).toContain('Required.');
    });
  });
});
