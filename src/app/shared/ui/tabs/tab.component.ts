import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { TabsContext } from './tabs-context';

@Component({
  selector: 'ui-tab',
  standalone: true,
  imports: [NgClass],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTabComponent {
  private readonly context = inject(TabsContext);
  private readonly buttonRef = viewChild<ElementRef<HTMLButtonElement>>('tabButton');

  private readonly reg = this.context.registerTab();

  readonly id = this.reg.id;
  readonly index = this.reg.index;
  readonly isActive = computed(() => this.context.activeIndex() === this.index);
  readonly controlsId = computed(() => this.context.panelId(this.index));

  onClick(): void {
    if (!this.isActive()) {
      this.context.select(this.index);
    }
  }

  focus(): void {
    this.buttonRef()?.nativeElement.focus();
  }
}
