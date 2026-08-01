import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { AvatarSize } from './avatar.types';

@Component({
  selector: 'ui-avatar',
  standalone: true,
  imports: [NgClass],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiAvatarComponent {
  readonly src = input<string>();
  readonly alt = input<string>('avatar');
  readonly size = input<AvatarSize>('sm');
}
