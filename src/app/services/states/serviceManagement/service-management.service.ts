import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpService } from '../../backend/http.service';
import { ResponseServiceManagementsDto } from '../../../dtos/services/ResponseServiceManagementsDto';

@Injectable({
  providedIn: 'root'
})
export class ServiceManagementService {

  private api = inject(HttpService);

  // ===== DATA =====
  public services = signal<ResponseServiceManagementsDto[]>([]);
  public selectedService = signal<ResponseServiceManagementsDto | null>(null);

  // ===== PAGINATION =====
  public page = signal<number>(0);
  public size = 4;
  public totalElements = signal<number>(0);

  public totalPages = computed(() =>
    Math.ceil(this.totalElements() / this.size)
  );

  // ===== SEARCH =====
  public search = signal<string>('');

  public filteredServices = computed(() => {
    const term = this.search().toLowerCase().trim();
    const list = this.services();

    if (!term) return list;

    return list.filter(d =>
      d.name.toLowerCase().includes(term)
    );
  });

  // ===== LOAD =====
  loadServices() {
    this.api.getAllServicesManagement(this.page(), this.size, this.search()).subscribe({
      next: (res) => {
        this.services.set(res.content);
        this.totalElements.set(res.totalElements);
      }
    });
  }

  // ===== PAGINATION =====
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
}
