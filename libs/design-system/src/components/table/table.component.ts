import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  input,
  OnDestroy,
  OnInit,
  output,
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
  implements OnInit, OnDestroy
{
  readonly ChevronDown = ChevronDown;
  readonly ChevronUp = ChevronUp;
  readonly ArrowUpDown = ArrowUpDown;
  readonly ChevronsLeft = ChevronsLeft;
  readonly ChevronsRight = ChevronsRight;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  private resizeListener?: () => void;

  dataSource = input<T[]>([]);
  columns = input<TableColumn<T>[]>([]);
  pagination = input<PaginationConfig | false>(false);
  loading = input(false);
  bordered = input(false);
  size = input<'small' | 'middle' | 'large'>('middle');
  rowKey = input<string | ((record: T, index: number) => string)>('id');
  rowSelection = input<RowSelection<T> | undefined>(undefined);
  expandable = input<ExpandableConfig<T> | undefined>(undefined);
  serverSide = input(false);
  error = input<Error | null>(null);
  responsive = input<boolean | ResponsiveConfig>(true);

  changeEvent = output<{
    pagination: PaginationConfig | false;
    filters: Record<string, string[]>;
    sorter: SorterResult<T>[];
    extra: {
      action: string;
      currentDataSource: T[];
    };
  }>();

  rowClickEvent = output<{ record: T; index: number }>();

  protected windowWidth = signal(
    typeof window !== 'undefined' ? window.innerWidth : 1920
  );
  protected currentPage = signal(1);
  protected pageSize = signal(10);
  protected sorters = signal<SorterResult<T>[]>([]);
  protected filters = signal<Record<string, string[]>>({});
  protected selectedRowKeys = signal<string[]>([]);
  protected expandedRowKeys = signal<string[]>([]);

  protected safeColumns = computed(() =>
    Array.isArray(this.columns()) ? this.columns() : []
  );

  protected safeData = computed(() => {
    const data = this.dataSource();
    return Array.isArray(data) ? data : [];
  });

  protected filteredData = computed(() => {
    if (this.serverSide()) return this.safeData();

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
    if (this.serverSide()) return this.filteredData();

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
    if (this.pagination() === false) return this.sortedData();
    if (this.serverSide()) return this.sortedData();

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

      return this.windowWidth() < breakpointWidth;
    }

    return false;
  });

  protected paginationValue = computed(() => this.pagination());
  protected rowSelectionValue = computed(() => this.rowSelection());
  protected expandableValue = computed(() => this.expandable());
  protected sizeValue = computed(() => this.size());
  protected totalRows = computed(() => {
    const pag = this.pagination();
    return pag !== false && pag.totalRows
      ? pag.totalRows
      : this.sortedData().length;
  });
  protected pageSizeOptions = computed(() => {
    const pag = this.pagination();
    return pag !== false && pag.pageSizeOptions ? pag.pageSizeOptions : [];
  });
  protected showSizeChanger = computed(() => {
    const pag = this.pagination();
    return pag !== false && pag.showSizeChanger;
  });

  ngOnInit(): void {
    const paginationValue = this.pagination();
    if (paginationValue && typeof paginationValue === 'object') {
      if (paginationValue.current)
        this.currentPage.set(paginationValue.current);
      if (paginationValue.pageSize) this.pageSize.set(paginationValue.pageSize);
    }

    if (typeof window !== 'undefined') {
      this.resizeListener = () => {
        this.windowWidth.set(window.innerWidth);
      };
      window.addEventListener('resize', this.resizeListener);
    }
  }

  ngOnDestroy(): void {
    if (this.resizeListener && typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  protected getRowKey(record: T, index: number): string {
    const rowKeyValue = this.rowKey();
    if (typeof rowKeyValue === 'function') {
      return rowKeyValue(record, index);
    }
    return String(record[rowKeyValue as keyof T] ?? index.toString());
  }

  protected getResponsiveConfig(): ResponsiveConfig | null {
    const responsiveValue = this.responsive();
    if (!responsiveValue) return null;

    if (typeof responsiveValue === 'boolean') {
      return {
        breakpoint: 'xl',
        cardView: true,
        scrollHorizontal: true,
      };
    }

    return responsiveValue;
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
      pagination: this.pagination(),
      filters: this.filters(),
      sorter: newSorters,
      extra: { action: 'sort', currentDataSource: this.sortedData() },
    });
  }

  protected handlePageChange(page: number, size: number): void {
    if (!this.serverSide()) {
      this.currentPage.set(page);
      this.pageSize.set(size);
    }

    const paginationValue = this.pagination();
    this.changeEvent.emit({
      pagination:
        typeof paginationValue === 'object'
          ? {
              ...paginationValue,
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

    const rowSelectionValue = this.rowSelection();
    rowSelectionValue?.onChange?.(newKeys, selectedRows);
  }

  protected toggleAllSelection(): void {
    const rowSelectionValue = this.rowSelection();
    if (!rowSelectionValue) return;

    const allKeys = this.paginatedData().map((record, index) =>
      this.getRowKey(record, index)
    );

    const allSelected =
      allKeys.length > 0 &&
      allKeys.every((key) => this.selectedRowKeys().includes(key));

    const newKeys = allSelected ? [] : allKeys;
    this.selectedRowKeys.set(newKeys);

    const selectedRows = allSelected ? [] : this.paginatedData();
    rowSelectionValue.onChange?.(newKeys, selectedRows);
  }

  protected toggleRowExpansion(record: T, index: number): void {
    const expandableValue = this.expandable();
    if (!expandableValue) return;

    const rowKey = this.getRowKey(record, index);
    const keys = this.expandedRowKeys();
    const isExpanded = keys.includes(rowKey);

    const newKeys = isExpanded
      ? keys.filter((k) => k !== rowKey)
      : [...keys, rowKey];

    this.expandedRowKeys.set(newKeys);
    expandableValue.onExpand?.(!isExpanded, record);
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

  protected get Math(): typeof Math {
    return Math;
  }

  protected getTotalPages(): number {
    const paginationValue = this.pagination();
    if (paginationValue === false) return 1;
    const total = paginationValue.totalRows || this.sortedData().length;
    return Math.ceil(total / this.pageSize());
  }

  protected getPageNumbers(): number[] {
    const total = this.getTotalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (current > 3) {
        pages.push(-1);
      }

      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < total - 2) {
        pages.push(-1);
      }

      pages.push(total);
    }

    return pages;
  }
}
