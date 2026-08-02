import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  inject,
  input,
  output,
} from '@angular/core';
import { UiTabComponent } from './tab.component';
import { TabsContext } from './tabs-context';

let nextId = 0;

@Component({
  selector: 'ui-tabs',
  standalone: true,
  providers: [TabsContext],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTabsComponent implements AfterContentChecked {
  readonly activeIndex = input<number>(0);
  readonly activeIndexChange = output<number>();

  readonly tabs = contentChildren(UiTabComponent);
  private readonly context = inject(TabsContext);

  constructor() {
    this.context.setBaseId(`ui-tabs-${nextId++}`);
    this.context.setSelectFn((index) => this.activeIndexChange.emit(index));
    this.context.activeIndex.set(this.activeIndex());
  }

  ngAfterContentChecked(): void {
    this.context.activeIndex.set(this.activeIndex());
  }

  onKeydown(event: KeyboardEvent): void {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (!keys.includes(event.key)) {
      return;
    }

    event.preventDefault();

    const count = this.tabs().length;
    if (count === 0) {
      return;
    }

    const current = this.activeIndex();
    let next = current;

    switch (event.key) {
      case 'ArrowRight':
        next = (current + 1) % count;
        break;
      case 'ArrowLeft':
        next = (current - 1 + count) % count;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = count - 1;
        break;
    }

    if (next !== current) {
      this.activeIndexChange.emit(next);
    }

    this.tabs()[next]?.focus();
  }
}
