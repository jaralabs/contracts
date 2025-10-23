import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'lib-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <input
      [type]="type"
      [placeholder]="placeholder"
      [disabled]="disabled"
      [value]="value"
      (input)="onInput($event)"
      (blur)="onTouched()"
      [class]="inputClasses"
    />
  `,
})
export class InputComponent implements ControlValueAccessor {
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() variant: 'default' | 'error' = 'default';

  value = '';
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (_value: string) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};

  get inputClasses(): string {
    const baseClasses =
      'w-full px-4 py-2.5 text-sm rounded-lg border transition-colors outline-none hover:border-secondary-400';

    const variantClasses = {
      default:
        'border-secondary-300 focus:border-primary-400 focus:hover:border-primary-400',
      error: 'border-red-300 focus:border-red-500 focus:hover:border-red-500',
    };

    const disabledClass = this.disabled
      ? 'bg-secondary-100 cursor-not-allowed text-secondary-500'
      : 'bg-white text-secondary-900';

    return `${baseClasses} ${variantClasses[this.variant]} ${disabledClass}`;
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
