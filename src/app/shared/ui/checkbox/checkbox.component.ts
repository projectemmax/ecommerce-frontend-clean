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
  selector: 'ui-checkbox',
  standalone: true,
  imports: [CommonModule, UiFieldComponent],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UiCheckboxComponent),
    multi: true,
  }],
})
export class UiCheckboxComponent implements ControlValueAccessor {
  readonly label = input<string>();
  readonly required = input(false, {
      transform: booleanAttribute,
  });
  readonly disabled = input(false, {
      transform: booleanAttribute,
  });
  readonly switchMode = input(false, {
      transform: booleanAttribute,
  });
  readonly hideLabel = input(false, {
      transform: booleanAttribute,
  });

  readonly helperText = input<string>();
  readonly error = input<string | null>();

  readonly checkboxId = `ui-checkbox-${nextId++}`;
  readonly innerValue = signal<boolean>(false);

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

  onChangeEvent(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    this.innerValue.set(checked);
    this.onChange(checked);
  }

  onBlur(): void {
    this.onTouched();
  }

  writeValue(value: unknown): void {
    this.innerValue.set(!!value);
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
