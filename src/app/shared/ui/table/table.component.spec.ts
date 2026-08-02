import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { UiTableComponent } from './table.component';
import { TableVariant } from './table.types';

describe('UiTableComponent', () => {
  let fixture: ComponentFixture<UiTableComponent>;
  let component: UiTableComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('variant', () => {
    it('defaults to default', () => {
      expect(component.variant()).toBe('default');
    });

    it('applies the correct class for every supported variant', () => {
      const variants: TableVariant[] = ['default', 'striped'];

      variants.forEach((variant: TableVariant) => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();

        const wrapper = fixture.debugElement.query(By.css('.ui-table')).nativeElement;
        expect(wrapper.classList.contains(`ui-table--${variant}`)).toBeTrue();
      });
    });
  });

  describe('rendering', () => {
    it('renders the responsive wrapper with a native table inside', () => {
      const wrapper = fixture.debugElement.query(By.css('.ui-table')).nativeElement;
      const table = fixture.debugElement.query(By.css('.ui-table__table')).nativeElement;
      expect(wrapper).toBeTruthy();
      expect(table.tagName).toBe('TABLE');
    });

    it('renders the wrapper inside the host, not on it', () => {
      const host = fixture.nativeElement as HTMLElement;
      expect(host.classList.contains('ui-table')).toBeFalse();
      expect(host.querySelector('.ui-table')).toBeTruthy();
    });
  });
});

describe('UiTableComponent (with projected content)', () => {
  @Component({
    standalone: true,
    imports: [UiTableComponent],
    template: `
      <ui-table variant="striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Acme</td>
            <td>Active</td>
          </tr>
        </tbody>
      </ui-table>
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

  it('projects the consumer thead and tbody', () => {
    const table = fixture.debugElement.query(By.css('.ui-table__table')).nativeElement;
    expect(table.querySelector('thead')).toBeTruthy();
    expect(table.querySelector('tbody')).toBeTruthy();
    expect(table.textContent).toContain('Acme');
  });

  it('applies the striped variant to the wrapper', () => {
    const wrapper = fixture.debugElement.query(By.css('.ui-table')).nativeElement;
    expect(wrapper.classList.contains('ui-table--striped')).toBeTrue();
  });
});
