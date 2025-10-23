import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface Tab {
  key: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

@Component({
  selector: 'lib-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="border-b border-gray-200 dark:border-gray-700">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        @for (tab of tabs; track tab.key) {
        <button
          type="button"
          [disabled]="tab.disabled"
          (click)="onTabClick(tab.key)"
          [class]="getTabClasses(tab.key, tab.disabled)"
        >
          @if (tab.icon) {
          <span [innerHTML]="tab.icon" class="mr-2 h-5 w-5"></span>
          }
          {{ tab.label }}
        </button>
        }
      </nav>
    </div>
    <div class="mt-6">
      <ng-content></ng-content>
    </div>
  `,
})
export class TabsComponent {
  @Input() tabs: Tab[] = [];
  @Input() activeKey = '';
  @Output() activeKeyChange = new EventEmitter<string>();

  onTabClick(key: string) {
    if (this.activeKey !== key) {
      this.activeKey = key;
      this.activeKeyChange.emit(key);
    }
  }

  getTabClasses(key: string, disabled?: boolean): string {
    const baseClasses =
      'inline-flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200';

    if (disabled) {
      return `${baseClasses} border-transparent text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50`;
    }

    if (this.activeKey === key) {
      return `${baseClasses} border-primary-500 text-primary-600 dark:text-primary-400`;
    }

    return `${baseClasses} border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer`;
  }
}
