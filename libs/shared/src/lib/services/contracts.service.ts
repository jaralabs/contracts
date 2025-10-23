import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environment';

export interface Contrato extends Record<string, unknown> {
  id: string;
  titulo: string;
  estado:
    | 'activo'
    | 'pendiente_firma'
    | 'finalizado'
    | 'borrador'
    | 'suspendido';
  fecha_creacion: string;
  fecha_inicio: string;
  fecha_fin: string;
  fecha_firma: string | null;
  valor: number;
  moneda: string;
  partes: Parte[];
  clausulas: Clausula[];
  documentos_adjuntos: Documento[];
  historial_estados: HistorialEstado[];
}

export interface Parte {
  id: string;
  nombre: string;
  rol: 'Proveedor' | 'Cliente';
  contacto_principal: {
    nombre: string;
    email: string;
  };
}

export interface Clausula {
  numero: number;
  texto: string;
}

export interface Documento {
  nombre: string;
  url: string;
}

export interface HistorialEstado {
  estado: string;
  fecha: string;
  usuario: string;
}

export interface ContractListResponse {
  data: Contrato[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ContractFilters {
  estado?: string;
  fecha_inicio_desde?: string;
  fecha_inicio_hasta?: string;
  fecha_fin?: string;
  busqueda?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root',
})
export class ContractsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl || 'http://localhost:3000';

  /**
   * Obtener lista de contratos con paginación y filtros
   */
  getContracts(filters?: ContractFilters): Observable<Contrato[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.estado) {
        params = params.set('estado', filters.estado);
      }
      // NO aplicamos busqueda aquí, la haremos en el frontend
      if (filters.fecha_fin) {
        params = params.set('fecha_fin', filters.fecha_fin);
      }
      if (filters.sortBy) {
        params = params.set('_sort', filters.sortBy);
        params = params.set('_order', filters.sortOrder || 'asc');
      }
      if (filters.page !== undefined && filters.pageSize) {
        params = params.set('_page', filters.page.toString());
        params = params.set('_limit', filters.pageSize.toString());
      }
    }

    return this.http
      .get<Contrato[]>(`${this.apiUrl}/contratos`, { params })
      .pipe(
        map((contratos) => {
          // Filtrar por búsqueda en frontend (id o titulo)
          if (filters?.busqueda) {
            const searchTerm = filters.busqueda.toLowerCase();
            return contratos.filter(
              (c) =>
                c.id.toLowerCase().includes(searchTerm) ||
                c.titulo.toLowerCase().includes(searchTerm)
            );
          }
          return contratos;
        })
      );
  }

  /**
   * Obtener un contrato por ID
   */
  getContractById(id: string): Observable<Contrato> {
    return this.http.get<Contrato>(`${this.apiUrl}/contratos/${id}`);
  }

  /**
   * Crear un nuevo contrato
   */
  createContract(contrato: Partial<Contrato>): Observable<Contrato> {
    return this.http.post<Contrato>(`${this.apiUrl}/contratos`, contrato);
  }

  /**
   * Actualizar un contrato
   */
  updateContract(
    id: string,
    contrato: Partial<Contrato>
  ): Observable<Contrato> {
    return this.http.put<Contrato>(`${this.apiUrl}/contratos/${id}`, contrato);
  }

  /**
   * Actualizar parcialmente un contrato
   */
  patchContract(id: string, changes: Partial<Contrato>): Observable<Contrato> {
    return this.http.patch<Contrato>(`${this.apiUrl}/contratos/${id}`, changes);
  }

  /**
   * Eliminar un contrato
   */
  deleteContract(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/contratos/${id}`);
  }

  /**
   * Cambiar estado de un contrato
   */
  changeContractStatus(
    id: string,
    nuevoEstado: Contrato['estado'],
    usuario: string
  ): Observable<Contrato> {
    return this.http.patch<Contrato>(`${this.apiUrl}/contratos/${id}`, {
      estado: nuevoEstado,
      historial_estados: {
        estado: nuevoEstado,
        fecha: new Date().toISOString(),
        usuario,
      },
    });
  }

  /**
   * Obtener estadísticas de contratos
   */
  getContractStats(): Observable<{
    total: number;
    activos: number;
    pendientes: number;
    finalizados: number;
  }> {
    return this.http.get<{
      total: number;
      activos: number;
      pendientes: number;
      finalizados: number;
    }>(`${this.apiUrl}/contratos/stats`);
  }
}
