import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-label',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label [class]="labelClasses">
      <ng-content></ng-content>
    </label>
  `,
})
export class LabelComponent {
  @Input() required = false;

  get labelClasses(): string {
    return 'block text-sm font-medium text-gray-900 mb-1.5';
  }
}
