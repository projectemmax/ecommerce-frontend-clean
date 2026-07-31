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
  selector: 'ui-radio',
  standalone: true,
  imports: [CommonModule, UiFieldComponent],
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UiRadioComponent),
    multi: true,
  }],
})
export class UiRadioComponent implements ControlValueAccessor {
  readonly label = input<string>();
  readonly helperText = input<string>();
  readonly error = input<string | null>();
  readonly required = input(false, {
      transform: booleanAttribute,
  });
  readonly disabled = input(false, {
      transform: booleanAttribute,
  });
  readonly value = input<unknown>();
  readonly name = input.required<string>();
  readonly id = input<string>();
  readonly hideLabel = input(false, {
      transform: booleanAttribute,
  });

  private readonly generatedId = `ui-radio-${nextId++}`;
  readonly radioId = computed(() => this.id() || this.generatedId);
  readonly innerValue = signal<unknown>(undefined);
  readonly isChecked = computed(() => this.innerValue() === this.value());

  readonly hasError = computed(() => !!this.error());
  readonly isDisabled = computed(() => this.disabled() || this.disabledInternal());

  private disabledInternal = signal(false);
  private onChange: (value: unknown) => void = () => {};
  private onTouched: () => void = () => {};
  readonly ariaInvalid = computed(() =>
      this.hasError()
          ? 'true'
          : null
  );

  onChangeEvent(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.onChange(this.value());
    }
  }

  onBlur(): void {
    this.onTouched();
  }

  writeValue(value: unknown): void {
    this.innerValue.set(value);
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
