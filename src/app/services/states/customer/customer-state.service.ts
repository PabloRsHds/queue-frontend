import { computed, inject, Injectable, signal } from "@angular/core";
import { HttpService } from "../../backend/http.service";
import { ResponseAllCustomersDto } from "../../../dtos/customer/ResponseAllCustomersDto";
import { ResponseCustomerInfoDto } from "../../../dtos/customer/ResponseCustomerInfoDto";
import { ResponseCustomerIdsAndNames } from "../../../dtos/customer/ResponseCustomerIdsAndNames";
import { CreateCustomerDto } from "../../../dtos/customer/CreateCustomerDto";
import { UpdateCustomerDto } from "../../../dtos/customer/UpdateCustomerDto";

@Injectable({
  providedIn: 'root'
})
export class CustomerStateService {

  private http = inject(HttpService);

  // ===== STATES =====

  public customers = signal<ResponseAllCustomersDto[]>([]);
  public customerInfo = signal<ResponseCustomerInfoDto | null>(null);
  public customerIdsAndNames = signal<ResponseCustomerIdsAndNames[]>([]);

  // ===== MESSAGES =====

  public registerCustomerMessage = signal('');
  public registerCustomerStatus = signal<'success' | 'error' | 'default'>('default');

  public updateCustomerMessage = signal('');
  public updateCustomerStatus = signal<'success' | 'error' | 'default'>('default');

  public deleteCustomerMessage = signal('');
  public deleteCustomerStatus = signal<'success' | 'error' | 'default'>('default');

  // ===== PAGINATION =====

  public customerPage = signal(0);
  public customerSize = 4;
  public customerTotalElements = signal(0);
  public customerSearch = signal('');

  public customerTotalPages = computed(() =>
    Math.ceil(this.customerTotalElements() / this.customerSize)
  );

  // ===== METHODS =====

  loadCustomers() {
    this.http.getAllCustomers(
      this.customerPage(),
      this.customerSize,
      this.customerSearch()
    ).subscribe({
      next: response => {
        this.customers.set(response.content);
        this.customerTotalElements.set(response.totalElements);
      }
    });
  }

  loadCustomerIdsAndNames() {
    this.http.getCustomerIdsAndNames().subscribe({
      next: response => {
        this.customerIdsAndNames.set(response);
      }
    });
  }

  getInfoCustomer(customerId: string) {
    this.http.getCustomerById(customerId).subscribe({
      next: response => {
        this.customerInfo.set(response);
      }
    });
  }

  registerCustomer(request: CreateCustomerDto) {
    this.http.registerCustomer(request).subscribe({
      next: () => {
        this.registerCustomerMessage.set('Cliente registrado com sucesso!');
        this.registerCustomerStatus.set('success');
        this.loadCustomers();
      }
    });
  }

  updateCustomer(request: UpdateCustomerDto) {
    this.http.updateCustomer(request).subscribe({
      next: () => {
        this.updateCustomerMessage.set('Cliente atualizado com sucesso!');
        this.updateCustomerStatus.set('success');
        this.loadCustomers();
      }
    });
  }

  deleteCustomer(customerId: string) {
    this.http.deleteCustomer(customerId).subscribe({
      next: () => {
        this.deleteCustomerMessage.set('Cliente deletado com sucesso!');
        this.deleteCustomerStatus.set('success');
        this.loadCustomers();
      }
    });
  }

  nextPage() {
    if (this.customerPage() + 1 >= this.customerTotalPages()) return;

    this.customerPage.update(p => p + 1);
    this.loadCustomers();
  }

  previousPage() {
    if (this.customerPage() === 0) return;

    this.customerPage.update(p => p - 1);
    this.loadCustomers();
  }

  goToPage(page: number) {
    this.customerPage.set(page);
    this.loadCustomers();
  }

  setSearch(value: string) {
    this.customerSearch.set(value);
    this.customerPage.set(0);
    this.loadCustomers();
  }

  resetCustomerInfo() {
    this.customerInfo.set(null);
  }

  resetStatus() {
    this.registerCustomerStatus.set('default');
    this.updateCustomerStatus.set('default');
    this.deleteCustomerStatus.set('default');
  }
}
