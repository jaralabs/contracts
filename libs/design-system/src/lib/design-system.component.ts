import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-design-system',
  standalone: true,
  imports: [CommonModule],
  template: `<p>design-system works!</p>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesignSystemComponent {}
