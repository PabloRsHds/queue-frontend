import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpService } from '../../backend/http.service';
import { ResponseAllCustomersDto } from '../../../dtos/customer/ResponseAllCustomersDto';
import { ResponseStatisticsDto } from '../../../dtos/statistics/ResponseStatisticsDto';
import { ResponseCustomerInfoDto } from '../../../dtos/customer/ResponseCustomerInfoDto';
import { CreateCustomerDto } from '../../../dtos/customer/CreateCustomerDto';
import { UpdateCustomerDto } from '../../../dtos/customer/UpdateCustomerDto';

@Injectable({
  providedIn: 'root'
})
export class SchedulingStateService {

  // Injections
  private http = inject(HttpService);

  // States
  public customers = signal<ResponseAllCustomersDto[]>([]);
  public statistics = signal<ResponseStatisticsDto | null>(null);
  public customerInfo = signal<ResponseCustomerInfoDto | null>(null);

  // Messages
  public registerCustomerMessage = signal('');
  public registerCustomerStatus = signal<'success' | 'error' | 'default'>('default');

  public updateCustomerMessage = signal('');
  public updateCustomerStatus = signal<'success' | 'error' | 'default'>('default');

  public deleteCustomerMessage = signal('');
  public deleteCustomerStatus = signal<'success' | 'error' | 'default'>('default');

  // ===== PAGINATION =====
  public page = signal<number>(0);
  public size = 4;
  public totalElements = signal<number>(0);

  // ===== SEARCH =====
  public search = signal<string>('');


  // ===== CUSTOMERS ========

  // register client
  registerCustomer(request: CreateCustomerDto) {

    this.http.registerCustomer(request).subscribe({

      next: (response) => {

        this.registerCustomerMessage.set('Cliente registrado com sucesso!');
        this.registerCustomerStatus.set('success');
        this.loadCustomers();
      },
      error: (error) => {

        this.registerCustomerMessage.set('Erro ao registrar cliente. Tente novamente.');
        this.registerCustomerStatus.set('error');
      }
    })
  }

  // Update Customer
  updateCustomer(request: UpdateCustomerDto) {

    this.http.updateCustomer(request).subscribe({

      next: () => {
        this.updateCustomerMessage.set('Cliente atualizado com sucesso!');
        this.updateCustomerStatus.set('success');
        this.loadCustomers();
      },
      error: () => {
        this.updateCustomerMessage.set('Erro ao atualizar cliente. Tente novamente.');
        this.updateCustomerStatus.set('error');
      }
    })
  }

  // Delete Customer
  deleteCustomer(customerId: string) {
    this.http.deleteCustomer(customerId).subscribe({
      next: () => {
        this.deleteCustomerMessage.set('Cliente deletado com sucesso!');
        this.deleteCustomerStatus.set('success');
        this.loadCustomers();
      },
      error: () => {
        this.deleteCustomerMessage.set('Erro ao deletar cliente. Tente novamente.');
        this.deleteCustomerStatus.set('error');
      }
    })
  }

  // Get all customers
  loadCustomers() {
    this.http.getAllCustomers(this.page(), this.size, this.search()).subscribe({
      next: (response) => {
        this.customers.set(response.content);
        this.totalElements.set(response.totalElements);
      }
    });
  }

  // Statistics
  loadStatistics() {
    this.http.getCustomerStatistics().subscribe({
      next: (response) => {
        this.statistics.set(response);
      }
    })
  }

  // Get customer by id
  getInfoCustomer(customerId : string) {

    this.http.getCustomerById(customerId).subscribe({
      next: (response) => {
        this.customerInfo.set(response);
      }
    })
  }

  // ========================

  // ===== PAGINATION =====
  public totalPages = computed(() =>
    Math.ceil(this.totalElements() / this.size)
  );

  nextPage() {
    if (this.page() + 1 >= this.totalPages()) return;

    this.page.update(p => p + 1);
    this.loadCustomers();
  }

  previousPage() {
    if (this.page() === 0) return;

    this.page.update(p => p - 1);
    this.loadCustomers();
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages()) return;

    this.page.set(page);
    this.loadCustomers();
  }

  // ===== SEARCH =====
  setSearch(value: string) {
    this.search.set(value);
    this.page.set(0); // sempre volta pra página 1
    this.loadCustomers();
  }

  // Resets
  resetStatus() {
    this.registerCustomerStatus.set('default');
    this.updateCustomerStatus.set('default');
    this.deleteCustomerStatus.set('default');
  }

  resetCustomerInfo() {
    this.customerInfo.set(null);
  }
}
