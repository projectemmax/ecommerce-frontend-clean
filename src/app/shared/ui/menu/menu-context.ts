import { Injectable } from '@angular/core';

@Injectable()
export class MenuContext {
  private closeFn: () => void = () => {};

  setCloseFn(fn: () => void): void {
    this.closeFn = fn;
  }

  requestClose(): void {
    this.closeFn();
  }
}
