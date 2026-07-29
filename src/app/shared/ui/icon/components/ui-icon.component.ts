import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
    IconName,
    IconColor,
    IconSize,
} from '../models';
import { NgIconComponent } from "@ng-icons/core";
import { ICON_REGISTRY } from 'src/app/shared/ui/icon/registry/icon-registry';
import { NgClass } from '@angular/common';

@Component({
    selector: 'ui-icon',
    standalone: true,
    imports: [
    NgIconComponent,
    NgClass,
],
    templateUrl: './ui-icon.component.html',
    styleUrl: './ui-icon.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class UiIconComponent {
    readonly name = input.required<IconName>();
    readonly size = input<IconSize>('md');
    readonly color = input<IconColor>('current');
    readonly decorative = input(true);
    readonly ariaLabel = input('');
    readonly iconName = computed(() => ICON_REGISTRY[this.name()]);



}