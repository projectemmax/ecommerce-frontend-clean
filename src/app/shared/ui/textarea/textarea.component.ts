import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UiFieldComponent } from '@app/shared/ui/field';

let nextId = 0;

@Component({
  selector: 'ui-textarea',
  standalone: true,
  imports: [CommonModule, UiFieldComponent],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UiTextareaComponent),
    multi: true,
  }],
})
export class UiTextareaComponent implements ControlValueAccessor {
  readonly placeholder = input<string>();
  readonly disabled = input(false, {
      transform: booleanAttribute,
  });
  readonly required = input(false, {
      transform: booleanAttribute,
  });
  readonly hideLabel = input(false, {
      transform: booleanAttribute,
  });

  readonly label = input<string>();
  readonly helperText = input<string>();
  readonly error = input<string | null>();
  readonly rows = input<number>(3);
  readonly maxlength = input<number>();

  readonly textareaId = `ui-textarea-${nextId++}`;
  readonly innerValue = signal<string>('');

  readonly hasError = computed(() => !!this.error());
  readonly isDisabled = computed(() => this.disabled() || this.disabledInternal());

  private disabledInternal = signal(false);
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};
  readonly ariaInvalid = computed(() =>
      this.hasError()
          ? 'true'
          : null
  );

  onInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;

    this.innerValue.set(value);
    this.onChange(value);
  }

  onBlur(): void {
    this.onTouched();
  }

  writeValue(value: unknown): void {
    this.innerValue.set((value as string) ?? '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledInternal.set(isDisabled);
  }
}
