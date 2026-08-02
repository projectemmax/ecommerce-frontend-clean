import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { TabsContext } from './tabs-context';

@Component({
  selector: 'ui-tab-panel',
  standalone: true,
  templateUrl: './tab-panel.component.html',
  styleUrl: './tab-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTabPanelComponent {
  private readonly context = inject(TabsContext);

  private readonly reg = this.context.registerPanel();

  readonly id = this.reg.id;
  readonly index = this.reg.index;
  readonly isActive = computed(() => this.context.activeIndex() === this.index);
  readonly labelledbyId = computed(() => this.context.tabId(this.index));
}
