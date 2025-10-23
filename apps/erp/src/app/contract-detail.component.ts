import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tab, TabsComponent } from '@contracts/design-system';
import { ContractsService, Contrato } from '@contracts/shared';

@Component({
  selector: 'app-contract-detail',
  standalone: true,
  imports: [CommonModule, TabsComponent],
  templateUrl: './contract-detail.component.html',
})
export class ContractDetailComponent implements OnInit {
  private contractsService = inject(ContractsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  contract = signal<Contrato | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  activeTab = signal<string>('details');

  tabs: Tab[] = [
    { key: 'details', label: 'Detalles del Contrato' },
    { key: 'history', label: 'Historial' },
  ];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadContract(id);
    } else {
      this.error.set('ID de contrato no proporcionado');
      this.loading.set(false);
    }
  }

  loadContract(id: string) {
    this.loading.set(true);
    this.error.set(null);

    this.contractsService.getContractById(id).subscribe({
      next: (contract) => {
        this.contract.set(contract);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar el contrato');
        this.loading.set(false);
      },
    });
  }

  goBack() {
    this.router.navigate(['/signature']);
  }

  getEstadoBadgeClass(estado: string): string {
    const classes: Record<string, string> = {
      activo: 'bg-green-100 text-green-800',
      pendiente_firma: 'bg-yellow-100 text-yellow-800',
      finalizado: 'bg-blue-100 text-blue-800',
      borrador: 'bg-gray-100 text-gray-800',
      suspendido: 'bg-red-100 text-red-800',
    };
    return classes[estado] || 'bg-gray-100 text-gray-800';
  }

  getEstadoLabel(estado: string): string {
    const labels: Record<string, string> = {
      activo: 'Activo',
      pendiente_firma: 'Pendiente de Firma',
      finalizado: 'Finalizado',
      borrador: 'Borrador',
      suspendido: 'Suspendido',
    };
    return labels[estado] || estado;
  }

  formatDate(date: string | null): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  formatCurrency(value: number, currency: string): string {
    return `${currency} ${value.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  onTabChange(key: string) {
    this.activeTab.set(key);
  }
}
