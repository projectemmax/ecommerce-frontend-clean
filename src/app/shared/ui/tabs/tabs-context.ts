import { Injectable, signal } from '@angular/core';

@Injectable()
export class TabsContext {
  readonly baseId = signal<string>('');
  readonly activeIndex = signal<number>(0);

  private tabCount = 0;
  private panelCount = 0;
  private selectFn: (index: number) => void = () => {};

  setBaseId(id: string): void {
    this.baseId.set(id);
  }

  setSelectFn(fn: (index: number) => void): void {
    this.selectFn = fn;
  }

  select(index: number): void {
    this.selectFn(index);
  }

  registerTab(): { index: number; id: string } {
    const index = this.tabCount++;
    return { index, id: `${this.baseId()}-tab-${index}` };
  }

  registerPanel(): { index: number; id: string } {
    const index = this.panelCount++;
    return { index, id: `${this.baseId()}-panel-${index}` };
  }

  tabId(index: number): string {
    return `${this.baseId()}-tab-${index}`;
  }

  panelId(index: number): string {
    return `${this.baseId()}-panel-${index}`;
  }
}
