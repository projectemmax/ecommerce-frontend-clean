import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UiTabPanelComponent } from './tab-panel.component';
import { TabsContext } from './tabs-context';

describe('UiTabPanelComponent', () => {
  let fixture: ComponentFixture<UiTabPanelComponent>;
  let context: TabsContext;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiTabPanelComponent],
      providers: [TabsContext],
    }).compileComponents();

    context = TestBed.inject(TabsContext);
    context.setBaseId('test-tabs');

    fixture = TestBed.createComponent(UiTabPanelComponent);
    fixture.detectChanges();
  });

  it('renders a div with the tabpanel role', () => {
    const panel = fixture.debugElement.query(By.css('[role="tabpanel"]')).nativeElement;
    expect(panel).toBeTruthy();
  });

  it('generates an id and a labelledby id from the base id', () => {
    expect(fixture.componentInstance.id).toBe('test-tabs-panel-0');
    expect(fixture.componentInstance.labelledbyId()).toBe('test-tabs-tab-0');
  });

  it('is hidden when inactive and visible when active', () => {
    context.activeIndex.set(1);
    fixture.detectChanges();

    const panel = fixture.debugElement.query(By.css('[role="tabpanel"]')).nativeElement;
    expect(panel.hasAttribute('hidden')).toBeTrue();

    context.activeIndex.set(0);
    fixture.detectChanges();
    expect(panel.hasAttribute('hidden')).toBeFalse();
  });
});
