import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  DsTableComponent,
  PaginationConfig,
  TableColumn,
} from '@contracts/design-system';
import { ContractsService, Contrato } from '@contracts/shared';

@Component({
  selector: 'app-signature-page',
  standalone: true,
  imports: [CommonModule, DsTableComponent],
  templateUrl: './signature-page.component.html',
})
export class SignaturePageComponent implements OnInit {
  private contractsService = inject(ContractsService);
  private router = inject(Router);

  contracts = signal<Contrato[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

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
        const date = new Date(value as string);
        return date.toLocaleDateString('es-ES');
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

  loadContracts() {
    this.loading.set(true);
    this.error.set(null);

    this.contractsService.getContracts().subscribe({
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
