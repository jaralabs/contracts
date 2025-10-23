export type SortOrder = 'ascend' | 'descend' | null;

export interface TableColumn<T = Record<string, unknown>> {
  title?: string;
  dataIndex?: string | string[];
  key?: string;
  width?: number | string;
  ellipsis?: boolean | { showTitle?: boolean };
  align?: 'left' | 'center' | 'right';
  fixed?: boolean | 'left' | 'right';
  sorter?: boolean | ((a: T, b: T, sortOrder?: SortOrder) => number);
  defaultSortOrder?: SortOrder;
  render?: (value: unknown, record: T, index: number) => unknown;
  className?: string;
  visible?: boolean;
}

export interface PaginationConfig {
  current?: number;
  pageSize?: number;
  total?: number;
  totalRows?: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  pageSizeOptions?: number[];
  hideOnSinglePage?: boolean;
}

export interface RowSelection<T = Record<string, unknown>> {
  type?: 'checkbox' | 'radio';
  selectedRowKeys?: string[];
  onChange?: (selectedRowKeys: string[], selectedRows: T[]) => void;
  getCheckboxProps?: (record: T) => { disabled?: boolean };
  columnWidth?: number | string;
}

export interface ExpandableConfig<T = Record<string, unknown>> {
  expandedRowKeys?: string[];
  expandedRowRender?: (record: T, index: number) => unknown;
  onExpand?: (expanded: boolean, record: T) => void;
}

export interface ResponsiveConfig {
  breakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  cardView?: boolean;
  scrollHorizontal?: boolean;
}

export interface SorterResult<T = Record<string, unknown>> {
  column?: TableColumn<T>;
  field?: string;
  order?: SortOrder;
}
