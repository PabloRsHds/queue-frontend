import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpService } from '../../backend/http.service';
import { ResponseAllCustomersDto } from '../../../dtos/customer/ResponseAllCustomersDto';
import { ResponseCustomerInfoDto } from '../../../dtos/customer/ResponseCustomerInfoDto';
import { CreateCustomerDto } from '../../../dtos/customer/CreateCustomerDto';
import { UpdateCustomerDto } from '../../../dtos/customer/UpdateCustomerDto';
import { ResponseAllSchedulesDto } from '../../../dtos/schedule/ResponseAllSchedulesDto';

@Injectable({
  providedIn: 'root'
})
export class SchedulingStateService {

  // ===== INJECTIONS =====
  private http = inject(HttpService);

  // ===== STATES =====
  public customers = signal<ResponseAllCustomersDto[]>([]);
  public schedules = signal<ResponseAllSchedulesDto[]>([]);
  public customerInfo = signal<ResponseCustomerInfoDto | null>(null);

  // ===== MESSAGES =====
  public registerCustomerMessage = signal('');
  public registerCustomerStatus = signal<'success' | 'error' | 'default'>('default');

  public updateCustomerMessage = signal('');
  public updateCustomerStatus = signal<'success' | 'error' | 'default'>('default');

  public deleteCustomerMessage = signal('');
  public deleteCustomerStatus = signal<'success' | 'error' | 'default'>('default');

  // ==========================================================
  // =================== CUSTOMER PAGINATION ==================
  // ==========================================================

  public customerPage = signal<number>(0);
  public customerSize = 4;
  public customerTotalElements = signal<number>(0);
  public customerSearch = signal<string>('');

  public customerTotalPages = computed(() =>
    Math.ceil(this.customerTotalElements() / this.customerSize)
  );

  // ==========================================================
  // =================== SCHEDULE PAGINATION ==================
  // ==========================================================

  public schedulePage = signal<number>(0);
  public scheduleSize = 4;
  public scheduleTotalElements = signal<number>(0);
  public scheduleSearch = signal<string>('');

  public scheduleTotalPages = computed(() =>
    Math.ceil(this.scheduleTotalElements() / this.scheduleSize)
  );

  // ==========================================================
  // ====================== SCHEDULES =========================
  // ==========================================================

  loadSchedules() {
    this.http.getAllScheduling(
      this.schedulePage(),
      this.scheduleSize,
      this.scheduleSearch()
    ).subscribe({
      next: (response) => {
        this.schedules.set(response.content);
        this.scheduleTotalElements.set(response.totalElements);
      }
    });
  }

  nextSchedulePage() {
    if (this.schedulePage() + 1 >= this.scheduleTotalPages()) return;

    this.schedulePage.update(p => p + 1);
    this.loadSchedules();
  }

  previousSchedulePage() {
    if (this.schedulePage() === 0) return;

    this.schedulePage.update(p => p - 1);
    this.loadSchedules();
  }

  goToSchedulePage(page: number) {
    if (page < 0 || page >= this.scheduleTotalPages()) return;

    this.schedulePage.set(page);
    this.loadSchedules();
  }

  setScheduleSearch(value: string) {
    this.scheduleSearch.set(value);
    this.schedulePage.set(0);
    this.loadSchedules();
  }

  // ==========================================================
  // ======================= CUSTOMERS ========================
  // ==========================================================

  registerCustomer(request: CreateCustomerDto) {
    this.http.registerCustomer(request).subscribe({
      next: () => {
        this.registerCustomerMessage.set('Cliente registrado com sucesso!');
        this.registerCustomerStatus.set('success');
        this.loadCustomers();
      },
      error: () => {
        this.registerCustomerMessage.set(
          'Erro ao registrar cliente. Tente novamente.'
        );
        this.registerCustomerStatus.set('error');
      }
    });
  }

  updateCustomer(request: UpdateCustomerDto) {
    this.http.updateCustomer(request).subscribe({
      next: () => {
        this.updateCustomerMessage.set('Cliente atualizado com sucesso!');
        this.updateCustomerStatus.set('success');
        this.loadCustomers();
      },
      error: () => {
        this.updateCustomerMessage.set(
          'Erro ao atualizar cliente. Tente novamente.'
        );
        this.updateCustomerStatus.set('error');
      }
    });
  }

  deleteCustomer(customerId: string) {
    this.http.deleteCustomer(customerId).subscribe({
      next: () => {
        this.deleteCustomerMessage.set('Cliente deletado com sucesso!');
        this.deleteCustomerStatus.set('success');
        this.loadCustomers();
      },
      error: () => {
        this.deleteCustomerMessage.set(
          'Erro ao deletar cliente. Tente novamente.'
        );
        this.deleteCustomerStatus.set('error');
      }
    });
  }

  loadCustomers() {
    this.http.getAllCustomers(
      this.customerPage(),
      this.customerSize,
      this.customerSearch()
    ).subscribe({
      next: (response) => {
        this.customers.set(response.content);
        this.customerTotalElements.set(response.totalElements);
      }
    });
  }

  getInfoCustomer(customerId: string) {
    this.http.getCustomerById(customerId).subscribe({
      next: (response) => {
        this.customerInfo.set(response);
      }
    });
  }

  nextCustomerPage() {
    if (this.customerPage() + 1 >= this.customerTotalPages()) return;

    this.customerPage.update(p => p + 1);
    this.loadCustomers();
  }

  previousCustomerPage() {
    if (this.customerPage() === 0) return;

    this.customerPage.update(p => p - 1);
    this.loadCustomers();
  }

  goToCustomerPage(page: number) {
    if (page < 0 || page >= this.customerTotalPages()) return;

    this.customerPage.set(page);
    this.loadCustomers();
  }

  setCustomerSearch(value: string) {
    this.customerSearch.set(value);
    this.customerPage.set(0);
    this.loadCustomers();
  }

  // ==========================================================
  // ======================== RESETS ==========================
  // ==========================================================

  resetStatus() {
    this.registerCustomerStatus.set('default');
    this.updateCustomerStatus.set('default');
    this.deleteCustomerStatus.set('default');
  }

  resetCustomerInfo() {
    this.customerInfo.set(null);
  }
}
