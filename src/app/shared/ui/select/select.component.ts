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
import { SelectOption } from './select.types';

let nextId = 0;

@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [CommonModule, UiFieldComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UiSelectComponent),
    multi: true,
  }],
})
export class UiSelectComponent implements ControlValueAccessor {
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
  readonly options = input<SelectOption[]>([]);

  readonly selectId = `ui-select-${nextId++}`;
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

  onSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;

    this.innerValue.set(value);
    this.onChange(value);
  }

  onBlur(): void {
    this.onTouched();
  }

  trackByValue(_index: number, option: SelectOption): string {
    return option.value;
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
