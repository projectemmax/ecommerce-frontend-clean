import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UiButtonComponent } from '@app/shared/ui/button';
import { UiIconComponent } from '@app/shared/ui/icon';
import { UiInputComponent } from '@app/shared/ui/input';
import { UiSelectComponent } from '@app/shared/ui/select';
import { SelectOption } from '@app/shared/ui/select';
import { UiTextareaComponent } from '@app/shared/ui/textarea';
import { UiCheckboxComponent } from '@app/shared/ui/checkbox';
import { UiRadioComponent } from '@app/shared/ui/radio';
import { UiBadgeComponent } from '@app/shared/ui/badge';

@Component({
  selector: 'app-ui-playground',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    UiButtonComponent,
    UiIconComponent,
    UiInputComponent,
    UiSelectComponent,
    UiTextareaComponent,
    UiCheckboxComponent,
    UiRadioComponent,
    UiBadgeComponent,
  ],
  templateUrl: './ui-select-playground.component.html',
  styleUrl: './ui-select-playground.component.scss',
})
export class UiPlaygroundComponent {
  // --- Button ---
  clickCount = 0;
  buttonLoading = signal(false);
  buttonDisabled = signal(false);

  simulateLoad(): void {
    this.buttonLoading.set(true);
    setTimeout(() => this.buttonLoading.set(false), 2000);
  }

  // --- Input (Reactive) ---
  inputControl = new FormControl<string>('');
  inputTemplateValue = '';

  // --- Select (Reactive) ---
  readonly categories: SelectOption[] = [
    { value: 'pharmaceuticals', label: 'Pharmaceuticals' },
    { value: 'medical-devices', label: 'Medical Devices' },
    { value: 'personal-care', label: 'Personal Care', disabled: true },
    { value: 'vitamins', label: 'Vitamins & Supplements' },
    { value: 'first-aid', label: 'First Aid' },
    { value: 'diagnostic-tools', label: 'Diagnostic Tools' },
  ];

  selectControl = new FormControl<string>('');
  selectTemplateValue = '';

  // --- Textarea (Reactive) ---
  textareaControl = new FormControl<string>('');
  textareaTemplateValue = '';

  // --- Checkbox (Reactive) ---
  checkboxControl = new FormControl<boolean>(false);
  checkboxRequiredControl = new FormControl<boolean>(false, { nonNullable: true });
  checkboxDisabledControl = new FormControl<boolean>({ value: false, disabled: true });
  checkboxTemplateValue = false;

  // --- Radio (Reactive) ---
  radioControl = new FormControl<string>('');
  radioTemplateValue = '';
  readonly radioOptions = ['MALE', 'FEMALE', 'OTHER'] as const;

  // --- Badge ---
  readonly badgeVariants = ['primary', 'secondary', 'success', 'warning', 'danger', 'info'] as const;

  // --- Showcase icons ---
  readonly showcaseIcons = [
    'home',
    'search',
    'user',
    'shoppingCart',
    'settings',
    'menu',
    'close',
    'success',
    'warning',
    'error',
  ] as const;

  readonly iconSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
}
