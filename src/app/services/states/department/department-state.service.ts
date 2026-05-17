import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpService } from '../../backend/http.service';
import { ResponseDepartmentsDto } from '../../../dtos/ResponseDepartments';
import { ResponseGetDepartmentDto } from '../../../dtos/ResponseGetDepartment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentStateService {

  private api = inject(HttpService);

  // ===== DATA =====
  public departments = signal<ResponseDepartmentsDto[]>([]);
  public selectedDepartment = signal<ResponseGetDepartmentDto | null>(null);

  // ===== PAGINATION =====
  public page = signal<number>(0);
  public size = 4;
  public totalElements = signal<number>(0);

  public totalPages = computed(() =>
    Math.ceil(this.totalElements() / this.size)
  );

  // ===== SEARCH =====
  public search = signal<string>('');

  public filteredDepartments = computed(() => {
    const term = this.search().toLowerCase().trim();
    const list = this.departments();

    if (!term) return list;

    return list.filter(d =>
      d.name.toLowerCase().includes(term)
    );
  });

  // ===== LOAD =====
  loadDepartments() {
    this.api.getAllDepartments(this.page(), this.size, this.search()).subscribe({
      next: (res) => {
        this.departments.set(res.content);
        this.totalElements.set(res.totalElements);
      }
    });
  }

  // ===== PAGINATION =====
  nextPage() {
    if (this.page() + 1 >= this.totalPages()) return;

    this.page.update(p => p + 1);
    this.loadDepartments();
  }

  previousPage() {
    if (this.page() === 0) return;

    this.page.update(p => p - 1);
    this.loadDepartments();
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages()) return;

    this.page.set(page);
    this.loadDepartments();
  }

  // ===== SEARCH =====
  setSearch(value: string) {
    this.search.set(value);
    this.page.set(0); // sempre volta pra página 1
    this.loadDepartments();
  }

  // ===== REFRESH =====
  refresh() {
    this.loadDepartments();
  }
}
