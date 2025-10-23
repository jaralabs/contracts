import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'text' | 'date';
  options?: FilterOption[];
  placeholder?: string;
}

export interface FilterValues {
  [key: string]: string;
}

@Component({
  selector: 'lib-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
    >
      <!-- Header con botón Filtros -->
      <div class="px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg
            class="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >Filtros</span
          >
        </div>

        <button
          (click)="toggleFilters()"
          class="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          {{ showFilters() ? 'Ocultar filtros' : 'Mostrar filtros' }}
          <svg
            [class.rotate-180]="showFilters()"
            class="w-4 h-4 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      <!-- Contenido expandible con filtros -->
      @if (showFilters()) {
      <div class="px-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          @for (filter of filters; track filter.key) {
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              {{ filter.label }}
            </label>

            <!-- Select Filter -->
            @if (filter.type === 'select' && filter.options) {
            <select
              [(ngModel)]="filterValues[filter.key]"
              (ngModelChange)="onFilterChange()"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            >
              @for (option of filter.options; track option.value) {
              <option [value]="option.value">{{ option.label }}</option>
              }
            </select>
            }

            <!-- Text Filter -->
            @if (filter.type === 'text') {
            <input
              type="text"
              [(ngModel)]="filterValues[filter.key]"
              (ngModelChange)="onFilterChange()"
              [placeholder]="filter.placeholder || ''"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
            }

            <!-- Date Filter -->
            @if (filter.type === 'date') {
            <input
              type="date"
              [(ngModel)]="filterValues[filter.key]"
              (ngModelChange)="onFilterChange()"
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
            }
          </div>
          }
        </div>

        <!-- Botón Limpiar filtros -->
        <div class="flex justify-end">
          <button
            (click)="onClear()"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
      }
    </div>
  `,
})
export class FiltersComponent {
  @Input() filters: FilterConfig[] = [];
  @Output() filtersChange = new EventEmitter<FilterValues>();
  @Output() clear = new EventEmitter<void>();

  showFilters = signal<boolean>(false);
  filterValues: FilterValues = {};

  toggleFilters() {
    this.showFilters.set(!this.showFilters());
  }

  onFilterChange() {
    this.filtersChange.emit(this.filterValues);
  }

  onClear() {
    this.filterValues = {};
    this.filters.forEach((filter) => {
      this.filterValues[filter.key] = '';
    });
    this.clear.emit();
  }
}
