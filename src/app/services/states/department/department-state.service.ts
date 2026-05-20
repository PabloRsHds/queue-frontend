import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpService } from '../../backend/http.service';
import { ResponseGetDepartmentDto } from '../../../dtos/department/ResponseGetDepartment';
import { ResponseDepartmentDto } from '../../../dtos/department/ResponseDepartmentDto';
import { CreateDepartmentDto } from '../../../dtos/department/CreateDepartmentDto';

@Injectable({
  providedIn: 'root'
})
export class DepartmentStateService {

  // ===== INJECTIONS =====
  private api = inject(HttpService);

  // ===== DATA =====
  public departments = signal<ResponseDepartmentDto[]>([]);
  public selectedDepartment = signal<ResponseGetDepartmentDto | null>(null);

  // Message/verifications of Response.
  public registerMessage = signal<string>('');
  public registerStatus = signal<'success' | 'error' | 'default'>('default');

  public deleteMessage = signal<string>('');
  public deleteStatus = signal<'success' | 'error' | 'default'>('default');

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

  // ==== REGISTER ===
  createDepartment(create: CreateDepartmentDto) {

    this.api.createDepartment(create).subscribe({
      next: (response) => {

        this.registerMessage.set('Departamento criado com successo!');
        this.registerStatus.set('success');

        this.page.set(0);
        this.departments.set([...this.departments(), response]);
      },

      error: (error) => {

        this.registerMessage.set('Erro ao criar um departamento');
        this.registerStatus.set('error');
      }
    })
  }

  // ====== Delete ======

  deleteDepartment(departmentId: string) {

    this.api.deleteDepartment(departmentId).subscribe({

      next: (response) => {

        this.departments.set(this.departments()
          .filter(d => d.departmentId !== departmentId));

        this.deleteMessage.set('Departamento excluido com sucesso!');
        this.deleteStatus.set('success');
        this.selectedDepartment.set(null);
      },

      error: () => {
        this.deleteMessage.set('Erro ao excluir departamento.');
        this.deleteStatus.set('error');
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
