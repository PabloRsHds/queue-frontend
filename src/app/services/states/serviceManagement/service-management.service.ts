import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpService } from '../../backend/http.service';
import { CreateServiceManagementDto } from '../../../dtos/services/CreateServiceManagementDto';
import { ResponseServiceManagementDto } from '../../../dtos/services/ResponseServiceManagementDto';
import { UpdateServiceManagementDto } from '../../../dtos/services/UpdateServiceManagementDto';
import { ResponseGetServiceByIdDto } from '../../../dtos/services/ResponseGetServiceByIdDto';
import { ResponseStatisticsDto } from '../../../dtos/services/ResponseStatisticsDto';

@Injectable({
  providedIn: 'root'
})
export class ServiceManagementService {

  private api = inject(HttpService);

  // ===== DATA =====
  public services = signal<ResponseServiceManagementDto[]>([]);

  public selectedService = signal<ResponseServiceManagementDto | null>(null);

  public registerStatus = signal<'success' | 'error' | 'default'>('default');
  public registerMessage = signal('');

  public updateStatus = signal<'success' | 'error' | 'default'>('default');
  public updateMessage = signal('');

  public deleteStatus = signal<'success' | 'error' | 'default'>('default');
  public deleteMessage = signal('');

  public serviceInfo = signal<ResponseGetServiceByIdDto | null>(null);
  public statistics = signal<ResponseStatisticsDto | null>(null);

  // ===== PAGINATION =====
  public page = signal<number>(0);
  public size = 4;
  public totalElements = signal<number>(0);

  // ===== SEARCH =====
  public search = signal<string>('');

  // ===== Register =======
  registerServiceManagenent(request : CreateServiceManagementDto) {

    this.api.createServiceManagement(request).subscribe({
      next: () => {

        this.page.set(0);
        this.loadServices();

        this.registerMessage.set('Serviço cadastrado com sucesso!');
        this.registerStatus.set('success');
      },
      error: () => {

        this.registerMessage.set('Erro ao cadastrar serviço.');
        this.registerStatus.set('error');
      }
    })
  }

  // ===== Update ====
  updateServiceManagement(request : UpdateServiceManagementDto) {

    this.api.updateServiceManagement(request).subscribe({
      next: () => {

        this.page.set(0);
        this.loadServices();

        this.updateMessage.set('Serviço atualizado com sucesso!');
        this.updateStatus.set('success');

        this.loadStatistics();
      },
      error: () => {

        this.updateMessage.set('Erro ao atualizar serviço.');
        this.updateStatus.set('error');
      }
    })
  }

  // ===== Delete =====
  deleteService(serviceManagementId : string) {
    this.api.deleteServiceManagement(serviceManagementId).subscribe({
      next: () => {

        this.page.set(0);
        this.loadServices();

        this.deleteMessage.set('Serviço excluído com sucesso!');
        this.deleteStatus.set('success');

        this.loadStatistics();
      },
      error: () => {

        this.deleteMessage.set('Erro ao excluir serviço.');
        this.deleteStatus.set('error');
      }
    })
  }

  // ===== LOAD SERVICES =====
  loadServices() {
    this.api.getAllServicesManagement(this.page(), this.size, this.search()).subscribe({

      next: (res) => {

        this.services.set(res.content);
        this.totalElements.set(res.totalElements);
      }
    });
  }

  // ===== LOAD STATISTICS =====
  loadStatistics() {

    this.api.getStatistics().subscribe({
      next: (response) => {
        this.statistics.set(response);
      }
    })
  }

  // ==== GET SERVICE BY ID =====
  getInfoService(serviceManagementId : string) {

    this.api.getServiceManagementById(serviceManagementId).subscribe({
      next: (response) => {
        this.serviceInfo.set(response);
      }
    })
  }

  // ===== PAGINATION =====
  public totalPages = computed(() =>
    Math.ceil(this.totalElements() / this.size)
  );

  nextPage() {
    if (this.page() + 1 >= this.totalPages()) return;

    this.page.update(p => p + 1);
    this.loadServices();
  }

  previousPage() {
    if (this.page() === 0) return;

    this.page.update(p => p - 1);
    this.loadServices();
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages()) return;

    this.page.set(page);
    this.loadServices();
  }

  // ===== SEARCH =====
  setSearch(value: string) {
    this.search.set(value);
    this.page.set(0); // sempre volta pra página 1
    this.loadServices();
  }

  // ===== REFRESH =====
  refresh() {
    this.loadServices();
  }

  resetStatus() {
    this.registerStatus.set('default');
    this.updateStatus.set('default');
    this.deleteStatus.set('default');
  }

  resetInfoService() {
    this.serviceInfo.set(null);
  }
}
