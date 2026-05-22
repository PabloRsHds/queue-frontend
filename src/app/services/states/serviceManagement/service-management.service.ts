import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpService } from '../../backend/http.service';
import { CreateServiceManagementDto } from '../../../dtos/services/CreateServiceManagementDto';
import { ResponseServiceManagementDto } from '../../../dtos/services/ResponseServiceManagementDto';
import { UpdateServiceManagementDto } from '../../../dtos/services/UpdateServiceManagementDto';

@Injectable({
  providedIn: 'root'
})
export class ServiceManagementService {

  private api = inject(HttpService);

  // ===== DATA =====
  public services = signal<ResponseServiceManagementDto[]>([]);
  public selectedService = signal<ResponseServiceManagementDto | null>(null);

  public serviceRegisterStatus = signal<'success' | 'error' | 'default'>('default');
  public serviceRegisterMessage = signal('');

  public serviceUpdateStatus = signal<'success' | 'error' | 'default'>('default');
  public serviceUpdateMessage = signal('');

  public serviceDeleteStatus = signal<'success' | 'error' | 'default'>('default');
  public serviceDeleteMessage = signal('');

  public serviceInfo = signal<ResponseServiceManagementDto | null>(null);

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

        this.serviceRegisterMessage.set('Serviço cadastrado com sucesso!');
        this.serviceRegisterStatus.set('success');
      },
      error: () => {

        this.serviceRegisterMessage.set('Erro ao cadastrar serviço.');
        this.serviceRegisterStatus.set('error');
      }
    })
  }

  // ===== Update ====
  updateServiceManagement(request : UpdateServiceManagementDto) {

    this.api.updateServiceManagement(request).subscribe({
      next: () => {

        this.page.set(0);
        this.loadServices();

        this.serviceUpdateMessage.set('Serviço atualizado com sucesso!');
        this.serviceUpdateStatus.set('success');
      },
      error: () => {

        this.serviceUpdateMessage.set('Erro ao atualizar serviço.');
        this.serviceUpdateStatus.set('error');
      }
    })
  }

  // ===== Delete =====
  deleteService(serviceManagementId : string) {
    this.api.deleteServiceManagement(serviceManagementId).subscribe({
      next: () => {

        this.page.set(0);
        this.loadServices();

        this.serviceDeleteMessage.set('Serviço excluído com sucesso!');
        this.serviceDeleteStatus.set('success');
      },
      error: () => {

        this.serviceDeleteMessage.set('Erro ao excluir serviço.');
        this.serviceDeleteStatus.set('error');
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
    this.serviceRegisterStatus.set('default');
    this.serviceUpdateStatus.set('default');
    this.serviceDeleteStatus.set('default');
  }
}
