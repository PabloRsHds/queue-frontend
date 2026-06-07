import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpService } from '../../backend/http.service';
import { ResponseAllCustomersDto } from '../../../dtos/customer/ResponseAllCustomersDto';
import { ResponseStatisticsDto } from '../../../dtos/statistics/ResponseStatisticsDto';
import { ResponseCustomerInfoDto } from '../../../dtos/customer/ResponseCustomerInfoDto';

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


  // ===== PAGINATION =====
  public page = signal<number>(0);
  public size = 4;
  public totalElements = signal<number>(0);

  // ===== SEARCH =====
  public search = signal<string>('');


  // ===== CUSTOMERS ========

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
}
