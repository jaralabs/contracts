import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  DsTableComponent,
  FilterConfig,
  FilterValues,
  FiltersComponent,
  PaginationConfig,
  TableColumn,
} from '@contracts/design-system';
import { ContractFilters, ContractsService, Contrato } from '@contracts/shared';

@Component({
  selector: 'app-signature-page',
  standalone: true,
  imports: [CommonModule, DsTableComponent, FormsModule, FiltersComponent],
  templateUrl: './signature-page.component.html',
})
export class SignaturePageComponent implements OnInit {
  private contractsService = inject(ContractsService);
  private router = inject(Router);

  contracts = signal<Contrato[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Filtros
  searchQuery = signal<string>('');

  filterConfigs: FilterConfig[] = [
    {
      key: 'estado',
      label: 'Estatus Ops:',
      type: 'select',
      options: [
        { value: '', label: 'Todos los estados' },
        { value: 'activo', label: 'Activo' },
        { value: 'pendiente_firma', label: 'Pendiente de Firma' },
        { value: 'finalizado', label: 'Finalizado' },
        { value: 'borrador', label: 'Borrador' },
        { value: 'suspendido', label: 'Suspendido' },
      ],
    },
    {
      key: 'fecha_vencimiento',
      label: 'Fecha de Vencimiento:',
      type: 'date',
      placeholder: 'Seleccionar fecha',
    },
  ];

  columns = signal<TableColumn<Contrato>[]>([
    {
      title: '# Numero',
      dataIndex: 'id',
      sorter: true,
      width: '200px',
    },
    {
      title: 'Título',
      dataIndex: 'titulo',
      sorter: true,
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      sorter: true,
      render: (value: unknown) => {
        const estado = value as string;
        const badges: Record<string, string> = {
          activo:
            '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Activo</span>',
          pendiente_firma:
            '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pendiente</span>',
          finalizado:
            '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Finalizado</span>',
          borrador:
            '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Borrador</span>',
          suspendido:
            '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Suspendido</span>',
        };
        return badges[estado] || estado;
      },
    },
    {
      title: 'Fecha Inicio',
      dataIndex: 'fecha_inicio',
      sorter: true,

      render: (value: unknown) => {
        if (!value) return '-';
        const dateStr = value as string;
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
      },
    },
    {
      title: 'Fecha Fin',
      dataIndex: 'fecha_fin',
      sorter: true,

      render: (value: unknown) => {
        if (!value) return '-';
        const dateStr = value as string;
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
      },
    },
    {
      title: 'Valor',
      dataIndex: 'valor',
      sorter: true,

      align: 'left',
      render: (value: unknown, record: Contrato) => {
        const valor = value as number;
        return `${record.moneda} ${valor.toLocaleString()}`;
      },
    },
  ]);

  paginationConfig: PaginationConfig = {
    current: 1,
    pageSize: 5,
    total: 0,
    pageSizeOptions: [5, 10, 20, 50],
    showSizeChanger: true,
  };

  ngOnInit() {
    this.loadContracts();
  }

  onFiltersChange(filterValues: FilterValues): void {
    this.loadContracts(filterValues);
  }

  onClearFilters(): void {
    this.searchQuery.set('');
    this.loadContracts();
  }

  loadContracts(filterValues?: FilterValues) {
    this.loading.set(true);
    this.error.set(null);

    const filters: ContractFilters = {};

    if (this.searchQuery()) {
      filters.busqueda = this.searchQuery();
    }

    if (filterValues?.['estado']) {
      filters.estado = filterValues['estado'] as string;
    }

    if (filterValues?.['fecha_vencimiento']) {
      filters.fecha_fin = filterValues['fecha_vencimiento'] as string;
    }

    this.contractsService.getContracts(filters).subscribe({
      next: (contracts) => {
        this.contracts.set(contracts);
        this.paginationConfig = {
          ...this.paginationConfig,
          total: contracts.length,
        };
      },
      error: () => {
        this.error.set('Error al cargar los contratos');
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  onChange(event: {
    pagination: PaginationConfig | false;
    filters: Record<string, string[]>;
    sorter: unknown[];
    extra: { action: string; currentDataSource: unknown[] };
  }) {
    if (event.extra.action === 'paginate' && event.pagination) {
      this.paginationConfig = {
        ...this.paginationConfig,
        current: event.pagination.current || 1,
        pageSize: event.pagination.pageSize || 5,
      };
    }
  }

  onRowClick(event: { record: Contrato; index: number }) {
    this.router.navigate(['/erp/contract', event.record.id]);
  }
}
