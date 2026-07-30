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
import { UiFieldComponent } from '@app/shared/ui/field';
import { InputType } from './input.types';

let nextId = 0;

@Component({
  selector: 'ui-input',
  standalone: true,
  imports: [UiFieldComponent,],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UiInputComponent),
    multi: true,
  }],
})
export class UiInputComponent implements ControlValueAccessor {
  readonly type = input<InputType>('text');
  readonly placeholder = input<string>();
  readonly disabled = input(false, {
      transform: booleanAttribute,
  });
  readonly readonly = input(false, {
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

  readonly inputId = `ui-input-${nextId++}`;
  readonly innerValue = signal<string | number | null>('');

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
    const target = event.target as HTMLInputElement;
    const value =
      target.type === 'number'
        ? (target.value === '' ? null : target.valueAsNumber)
        : target.value;

    this.innerValue.set(value);
    this.onChange(value);
  }

  onBlur(): void {
    this.onTouched();
  }

  writeValue(value: unknown): void {
    this.innerValue.set((value as string | number | null) ?? '');
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
