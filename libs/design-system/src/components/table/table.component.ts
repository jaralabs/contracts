import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import {
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  LucideAngularModule,
} from 'lucide-angular';
import {
  ExpandableConfig,
  PaginationConfig,
  ResponsiveConfig,
  RowSelection,
  SorterResult,
  SortOrder,
  TableColumn,
} from './table.model';

@Component({
  selector: 'lib-ds-table',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './table.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DsTableComponent<T extends Record<string, unknown>>
  implements OnInit
{
  // Lucide Icons
  readonly ChevronDown = ChevronDown;
  readonly ChevronUp = ChevronUp;
  readonly ArrowUpDown = ArrowUpDown;
  readonly ChevronsLeft = ChevronsLeft;
  readonly ChevronsRight = ChevronsRight;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  @Input() dataSource: T[] = [];
  @Input() columns: TableColumn<T>[] = [];
  @Input() pagination: PaginationConfig | false = false;
  @Input() loading = false;
  @Input() bordered = false;
  @Input() size: 'small' | 'middle' | 'large' = 'middle';
  @Input() rowKey: string | ((record: T, index: number) => string) = 'id';
  @Input() rowSelection?: RowSelection<T>;
  @Input() expandable?: ExpandableConfig<T>;
  @Input() serverSide = false;
  @Input() error: Error | null = null;
  @Input() responsive: boolean | ResponsiveConfig = true;

  @Output() changeEvent = new EventEmitter<{
    pagination: PaginationConfig | false;
    filters: Record<string, string[]>;
    sorter: SorterResult<T>[];
    extra: {
      action: string;
      currentDataSource: T[];
    };
  }>();

  @Output() rowClickEvent = new EventEmitter<{ record: T; index: number }>();

  // Signals
  protected currentPage = signal(1);
  protected pageSize = signal(10);
  protected sorters = signal<SorterResult<T>[]>([]);
  protected filters = signal<Record<string, string[]>>({});
  protected selectedRowKeys = signal<string[]>([]);
  protected expandedRowKeys = signal<string[]>([]);

  // Computed values
  protected safeColumns = computed(() =>
    Array.isArray(this.columns) ? this.columns : []
  );

  protected safeData = computed(() =>
    Array.isArray(this.dataSource) ? this.dataSource : []
  );

  protected filteredData = computed(() => {
    if (this.serverSide) return this.safeData();

    const data = this.safeData();
    const activeFilters = Object.entries(this.filters()).filter(
      ([, values]) => values.length > 0
    );

    if (activeFilters.length === 0) return data;

    return data.filter((record) =>
      activeFilters.every(([key, values]) =>
        values.includes(String(record[key as keyof T]))
      )
    );
  });

  protected sortedData = computed(() => {
    if (this.serverSide) return this.filteredData();

    const data = [...this.filteredData()];
    const activeSorters = this.sorters().filter((s) => s.order);

    if (activeSorters.length === 0) return data;

    return data.sort((a, b) => {
      for (const sorter of activeSorters) {
        const column = this.safeColumns().find(
          (col) => col.dataIndex === sorter.field
        );

        if (column?.sorter && typeof column.sorter === 'function') {
          const result = column.sorter(a, b, sorter.order);
          if (result !== 0) return result;
        } else {
          const aVal = a[sorter.field as keyof T];
          const bVal = b[sorter.field as keyof T];
          if (aVal !== bVal) {
            return sorter.order === 'ascend'
              ? aVal > bVal
                ? 1
                : -1
              : aVal < bVal
              ? 1
              : -1;
          }
        }
      }
      return 0;
    });
  });

  protected paginatedData = computed(() => {
    if (this.pagination === false) return this.sortedData();
    if (this.serverSide) return this.sortedData();

    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.sortedData().slice(start, end);
  });

  protected shouldUseCardView = computed(() => {
    const config = this.getResponsiveConfig();
    if (!config) return false;

    if (config.cardView) {
      const breakpointWidths: Record<string, number> = {
        xs: 640,
        sm: 768,
        md: 1024,
        lg: 1280,
        xl: 1536,
        '2xl': 1920,
      };

      const breakpoint = config.breakpoint || 'lg';
      const breakpointWidth = breakpointWidths[breakpoint] || 1280;

      return (
        (typeof window !== 'undefined' ? window.innerWidth : 1920) <
        breakpointWidth
      );
    }

    return false;
  });

  ngOnInit(): void {
    if (this.pagination && typeof this.pagination === 'object') {
      if (this.pagination.current)
        this.currentPage.set(this.pagination.current);
      if (this.pagination.pageSize) this.pageSize.set(this.pagination.pageSize);
    }
  }

  protected getRowKey(record: T, index: number): string {
    if (typeof this.rowKey === 'function') {
      return this.rowKey(record, index);
    }
    return String(record[this.rowKey as keyof T] ?? index.toString());
  }

  protected getResponsiveConfig(): ResponsiveConfig | null {
    if (!this.responsive) return null;

    if (typeof this.responsive === 'boolean') {
      return {
        breakpoint: 'xl',
        cardView: true,
        scrollHorizontal: true,
      };
    }

    return this.responsive;
  }

  protected getNestedValue(
    obj: Record<string, unknown>,
    path: string
  ): unknown {
    if (!path.includes('.')) return obj[path];
    return path
      .split('.')
      .reduce(
        (current: unknown, key) =>
          current && typeof current === 'object' && key in current
            ? (current as Record<string, unknown>)[key]
            : undefined,
        obj
      );
  }

  protected renderCell(
    column: TableColumn<T>,
    record: T,
    index: number
  ): unknown {
    let value: unknown;

    if (column.dataIndex) {
      if (typeof column.dataIndex === 'string') {
        value = this.getNestedValue(
          record as Record<string, unknown>,
          column.dataIndex
        );
      } else if (Array.isArray(column.dataIndex)) {
        value = record[column.dataIndex[0] as keyof T];
      }
    }

    if (column.render) {
      return column.render(value, record, index);
    }

    return value ?? '';
  }

  protected handleSort(column: TableColumn<T>): void {
    if (!column.sorter) return;

    const currentSorter = this.sorters().find(
      (s) => s.field === column.dataIndex
    );
    const currentOrder = currentSorter?.order;

    let nextOrder: SortOrder;
    if (currentOrder === 'ascend') nextOrder = 'descend';
    else if (currentOrder === 'descend') nextOrder = null;
    else nextOrder = 'ascend';

    const newSorters = nextOrder
      ? [
          {
            column,
            field: column.dataIndex as string,
            order: nextOrder,
          },
        ]
      : [];

    this.sorters.set(newSorters);

    this.changeEvent.emit({
      pagination: this.pagination,
      filters: this.filters(),
      sorter: newSorters,
      extra: { action: 'sort', currentDataSource: this.sortedData() },
    });
  }

  protected handlePageChange(page: number, size: number): void {
    if (!this.serverSide) {
      this.currentPage.set(page);
      this.pageSize.set(size);
    }

    this.changeEvent.emit({
      pagination:
        typeof this.pagination === 'object'
          ? {
              ...this.pagination,
              current: page,
              pageSize: size,
            }
          : false,
      filters: this.filters(),
      sorter: this.sorters(),
      extra: { action: 'paginate', currentDataSource: this.safeData() },
    });
  }

  protected toggleRowSelection(record: T, index: number): void {
    if (!this.rowSelection) return;

    const rowKey = this.getRowKey(record, index);
    const keys = this.selectedRowKeys();
    const isSelected = keys.includes(rowKey);

    const newKeys = isSelected
      ? keys.filter((k) => k !== rowKey)
      : [...keys, rowKey];

    this.selectedRowKeys.set(newKeys);

    const selectedRows = this.paginatedData().filter((r, i) =>
      newKeys.includes(this.getRowKey(r, i))
    );

    this.rowSelection.onChange?.(newKeys, selectedRows);
  }

  protected toggleAllSelection(): void {
    if (!this.rowSelection) return;

    const allKeys = this.paginatedData().map((record, index) =>
      this.getRowKey(record, index)
    );

    const allSelected =
      allKeys.length > 0 &&
      allKeys.every((key) => this.selectedRowKeys().includes(key));

    const newKeys = allSelected ? [] : allKeys;
    this.selectedRowKeys.set(newKeys);

    const selectedRows = allSelected ? [] : this.paginatedData();
    this.rowSelection.onChange?.(newKeys, selectedRows);
  }

  protected toggleRowExpansion(record: T, index: number): void {
    if (!this.expandable) return;

    const rowKey = this.getRowKey(record, index);
    const keys = this.expandedRowKeys();
    const isExpanded = keys.includes(rowKey);

    const newKeys = isExpanded
      ? keys.filter((k) => k !== rowKey)
      : [...keys, rowKey];

    this.expandedRowKeys.set(newKeys);
    this.expandable.onExpand?.(!isExpanded, record);
  }

  protected handleRowClick(record: T, index: number): void {
    this.rowClickEvent.emit({ record, index });
  }

  protected getSortOrder(column: TableColumn<T>): SortOrder {
    const sorter = this.sorters().find((s) => s.field === column.dataIndex);
    return sorter?.order ?? null;
  }

  protected isRowSelected(record: T, index: number): boolean {
    return this.selectedRowKeys().includes(this.getRowKey(record, index));
  }

  protected isRowExpanded(record: T, index: number): boolean {
    return this.expandedRowKeys().includes(this.getRowKey(record, index));
  }

  // Métodos auxiliares para usar Math en el template
  protected get Math(): typeof Math {
    return Math;
  }

  protected getTotalPages(): number {
    if (this.pagination === false) return 1;
    const total = this.pagination.totalRows || this.sortedData().length;
    return Math.ceil(total / this.pageSize());
  }

  protected getPageNumbers(): number[] {
    const total = this.getTotalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    if (total <= 7) {
      // Mostrar todas las páginas si son 7 o menos
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Siempre mostrar primera página
      pages.push(1);

      if (current > 3) {
        pages.push(-1); // Ellipsis
      }

      // Páginas alrededor de la actual
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < total - 2) {
        pages.push(-1); // Ellipsis
      }

      // Siempre mostrar última página
      pages.push(total);
    }

    return pages;
  }
}
