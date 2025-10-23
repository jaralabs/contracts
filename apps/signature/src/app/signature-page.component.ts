import { Component, OnInit } from '@angular/core';
import {
  DsTableComponent,
  PaginationConfig,
  TableColumn,
} from '@contracts/design-system';

interface Contract extends Record<string, unknown> {
  id: string;
  titulo: string;
  estado: 'activo' | 'inactivo' | 'pendiente';
  fecha_inicio: string;
  fecha_fin: string;
  valor: number;
  moneda: string;
}

@Component({
  selector: 'app-signature-page',
  standalone: true,
  imports: [DsTableComponent],
  templateUrl: './signature-page.component.html',
  styleUrl: './signature-page.component.scss',
})
export class SignaturePageComponent implements OnInit {
  // Mock data para probar la tabla
  contracts: Contract[] = [
    {
      id: 'CON-1001',
      titulo: 'Contrato de servicios IT',
      estado: 'activo',
      fecha_inicio: '2025-01-01',
      fecha_fin: '2025-12-31',
      valor: 10000,
      moneda: 'USD',
    },
    {
      id: 'CON-1002',
      titulo: 'Contrato de desarrollo web',
      estado: 'pendiente',
      fecha_inicio: '2025-02-01',
      fecha_fin: '2025-11-30',
      valor: 15000,
      moneda: 'USD',
    },
    {
      id: 'CON-1003',
      titulo: 'Contrato de consultoría',
      estado: 'inactivo',
      fecha_inicio: '2024-01-01',
      fecha_fin: '2024-12-31',
      valor: 8000,
      moneda: 'EUR',
    },
    {
      id: 'CON-1004',
      titulo: 'Contrato de soporte técnico',
      estado: 'activo',
      fecha_inicio: '2025-03-01',
      fecha_fin: '2026-03-01',
      valor: 12000,
      moneda: 'USD',
    },
    {
      id: 'CON-1005',
      titulo: 'Contrato de mantenimiento',
      estado: 'activo',
      fecha_inicio: '2025-01-15',
      fecha_fin: '2025-12-15',
      valor: 5000,
      moneda: 'USD',
    },
  ];

  // Configuración de columnas
  columns: TableColumn<Contract>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: true,
      width: '120px',
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
      width: '120px',
      render: (value: unknown) => {
        const estado = value as string;
        const badges: Record<string, string> = {
          activo: '<span class="badge badge-success">Activo</span>',
          inactivo: '<span class="badge badge-danger">Inactivo</span>',
          pendiente: '<span class="badge badge-warning">Pendiente</span>',
        };
        return badges[estado] || estado;
      },
    },
    {
      title: 'Fecha Inicio',
      dataIndex: 'fecha_inicio',
      sorter: true,
      width: '140px',
    },
    {
      title: 'Valor',
      dataIndex: 'valor',
      sorter: true,
      width: '120px',
      align: 'right',
      render: (value: unknown, record: Contract) => {
        const valor = value as number;
        return `${record.moneda} ${valor.toLocaleString()}`;
      },
    },
    {
      title: 'Acciones',
      dataIndex: 'id',
      key: 'actions',
      width: '150px',
      align: 'center',
      render: (_: unknown, record: Contract) => {
        return `
          <button class="btn-view" onclick="alert('Ver: ${record.id}')">Ver</button>
          <button class="btn-edit" onclick="alert('Editar: ${record.id}')">Editar</button>
        `;
      },
    },
  ];

  // Configuración de paginación
  paginationConfig: PaginationConfig = {
    current: 1,
    pageSize: 10,
    total: this.contracts.length,
    pageSizeOptions: [5, 10, 20, 50],
    showSizeChanger: true,
  };

  ngOnInit() {
    console.log('✅ SignaturePageComponent initialized');
    console.log('📊 Contracts loaded:', this.contracts.length);
  }

  onChange(event: {
    pagination: PaginationConfig | false;
    filters: Record<string, string[]>;
    sorter: unknown[];
    extra: { action: string; currentDataSource: unknown[] };
  }) {
    console.log('📊 Table changed:', event);

    if (event.extra.action === 'paginate' && event.pagination) {
      this.paginationConfig = {
        ...this.paginationConfig,
        current: event.pagination.current || 1,
        pageSize: event.pagination.pageSize || 10,
      };
    }

    if (event.extra.action === 'sort') {
      console.log('🔄 Sort changed:', event.sorter);
    }
  }

  onRowClick(event: { record: unknown; index: number }) {
    console.log('👆 Row clicked:', event.record as Contract);
  }
}
