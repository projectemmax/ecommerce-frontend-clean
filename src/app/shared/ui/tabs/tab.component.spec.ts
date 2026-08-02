import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UiTabComponent } from './tab.component';
import { TabsContext } from './tabs-context';

describe('UiTabComponent', () => {
  let fixture: ComponentFixture<UiTabComponent>;
  let context: TabsContext;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiTabComponent],
      providers: [TabsContext],
    }).compileComponents();

    context = TestBed.inject(TabsContext);
    context.setBaseId('test-tabs');

    fixture = TestBed.createComponent(UiTabComponent);
    fixture.detectChanges();
  });

  it('renders a button with the tab role', () => {
    const button = fixture.debugElement.query(By.css('button[role="tab"]')).nativeElement;
    expect(button).toBeTruthy();
  });

  it('is active when the context active index matches its index', () => {
    context.activeIndex.set(0);
    fixture.detectChanges();
    expect(fixture.componentInstance.isActive()).toBeTrue();

    context.activeIndex.set(1);
    fixture.detectChanges();
    expect(fixture.componentInstance.isActive()).toBeFalse();
  });

  it('generates an id and a controls id from the base id', () => {
    expect(fixture.componentInstance.id).toBe('test-tabs-tab-0');
    expect(fixture.componentInstance.controlsId()).toBe('test-tabs-panel-0');
  });

  it('sets aria-controls on the button', () => {
    const button = fixture.debugElement.query(By.css('button[role="tab"]')).nativeElement;
    expect(button.getAttribute('aria-controls')).toBe('test-tabs-panel-0');
  });

  it('reports selection intent through the context on click', () => {
    context.activeIndex.set(1);
    fixture.detectChanges();

    const captured: number[] = [];
    context.setSelectFn((index) => captured.push(index));

    const button = fixture.debugElement.query(By.css('button[role="tab"]')).nativeElement;
    button.click();

    expect(captured).toEqual([0]);
  });
});
