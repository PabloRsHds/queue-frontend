import { computed, inject, Injectable, signal } from '@angular/core';

import { HttpService } from '../../backend/http.service';

import { ResponseGetDepartmentDto } from '../../../dtos/department/ResponseGetDepartment';
import { ResponseDepartmentDto } from '../../../dtos/department/ResponseDepartmentDto';
import { CreateDepartmentDto } from '../../../dtos/department/CreateDepartmentDto';
import { UpdateDepartmentDto } from '../../../dtos/department/UpdateDepartmentDto';
import { ResponseDepartmentNamesDto } from '../../../dtos/department/ResponseDepartmentNamesDto';
import { ResponseCountTotalDepartmentsStatisticsDto } from '../../../dtos/department/statistics/ResponseCountTotalDepartmentsStatisticsDto';
import { ResponseCountServicesByDepartmentsStatisticsDto } from '../../../dtos/department/statistics/ResponseCountServicesByDepartmentsStatisticsDto';
import { ResponseDepartmentPercentagesStatisticsDto } from '../../../dtos/department/statistics/ResponseDepartmentPercentagesStatisticsDto';
import { ResponseDepartmentsCreatedByMonthStatisticsDto } from '../../../dtos/department/statistics/ResponseDepartmentsCreatedByMonthStatisticsDto';

@Injectable({
  providedIn: 'root'
})
export class DepartmentStateService {

  // ===================== INJECTIONS =====================

  private http = inject(HttpService);

  // ===================== DATA =====================

  public departments = signal<ResponseDepartmentDto[]>([]);
  public departmentInfo = signal<ResponseGetDepartmentDto | null>(null);
  public departmentNames = signal<ResponseDepartmentNamesDto[] | null>(null);

  // Statistics
  public countServicesByDepartment  = signal<ResponseCountServicesByDepartmentsStatisticsDto[] | null>([]);
  public countTotalDepartment = signal<ResponseCountTotalDepartmentsStatisticsDto | null>(null);
  public getPercentagesByDepartment = signal<ResponseDepartmentPercentagesStatisticsDto | null>(null);
  public departmentsCreatedByMonth = signal<ResponseDepartmentsCreatedByMonthStatisticsDto[] | null>([]);


  // Modal
  public modalRegister = signal<Boolean>(false);

  // ===================== LOADING =====================

  public loading = signal(false);

  // ===================== RESPONSE STATUS =====================

  public registerMessage = signal('');
  public registerStatus = signal<'success' | 'error' | 'default'>('default');

  public updateMessage = signal('');
  public updateStatus = signal<'success' | 'error' | 'default'>('default');

  public deleteMessage = signal('');
  public deleteStatus = signal<'success' | 'error' | 'default'>('default');

  // ===================== PAGINATION =====================

  public page = signal(0);
  public readonly size = 4;
  public totalElements = signal(0);

  public totalPages = computed(() =>
    Math.ceil(this.totalElements() / this.size)
  );

  // ===================== SEARCH =====================

  public search = signal('');

  // ===================== LOAD =====================

  loadDepartments() {

    this.loading.set(true);

    this.http.getAllDepartments(this.page(), this.size, this.search()).subscribe({

      next: (response) => {
        this.departments.set(response.content);
        this.loadStatistics();
        this.totalElements.set(response.totalElements);

        this.loading.set(false);
      },

      error: (error) => {

        console.error('Erro ao carregar departamentos', error);
        this.loading.set(false);
      }
    });
  }

  // ========== LOAD STATISTICS ==========
  loadStatistics() {

    this.http.getDepartmentStatistics().subscribe({
      next: (response) => {
        this.countServicesByDepartment.set(response.countServicesByDepartments);
        this.countTotalDepartment.set(response.countTotalDepartmentsStatistics);
        this.getPercentagesByDepartment.set(response.departmentPercentagesStatistics);
        this.departmentsCreatedByMonth.set(response.departmentsCreatedByMonthStatistics);
      }
    })
  }

  // ===================== CREATE =====================

  createDepartment(create: CreateDepartmentDto) {

    this.http.createDepartment(create).subscribe({
      next: () => {

        // volta pra primeira página
        this.page.set(0);

        // backend recalcula paginação
        this.loadDepartments();
        this.loadStatistics();

        this.registerMessage.set('Departamento criado com sucesso!');
        this.registerStatus.set('success');
      },

      error: (error) => {

        console.error(error);

        this.registerMessage.set('Erro ao criar departamento');
        this.registerStatus.set('error');
      }
    });
  }

  // ===================== UPDATE =====================

  updateDepartment(department: UpdateDepartmentDto) {

    this.http.updateDepartment(department).subscribe({

      next: () => {

        // sincroniza com backend
        this.loadDepartments();
        this.loadStatistics();

        // atualiza detalhe aberto
        if (this.departmentInfo() && this.departmentInfo()?.departmentId === department.departmentId) {

          this.getInfoDepartment(department.departmentId);
        }

        this.updateMessage.set('Departamento atualizado com sucesso!');
        this.updateStatus.set('success');
      },

      error: (error) => {

        console.error(error);

        this.updateMessage.set('Erro ao atualizar departamento');
        this.updateStatus.set('error');
      }
    });
  }

  // ===================== DELETE =====================

  deleteDepartment(departmentId: string) {

    this.http.deleteDepartment(departmentId).subscribe({

      next: () => {

        // se deletou o último item da página
        // volta uma página
        if (this.departments().length === 1 && this.page() > 0
        ) {
          this.page.update(p => p - 1);
        }

        // backend recalcula tudo
        this.loadDepartments();
        this.loadStatistics();

        // limpa detalhe
        this.departmentInfo.set(null);

        this.deleteMessage.set('Departamento excluído com sucesso!');
        this.deleteStatus.set('success');
      },

      error: (error) => {

        console.error(error);

        this.deleteMessage.set('Erro ao excluir departamento');
        this.deleteStatus.set('error');
      }
    });
  }

  // ===================== DETAILS =====================

  getInfoDepartment(departmentId: string) {

    this.http.getDepartmentById(departmentId).subscribe({
      next: (response) => {

        this.departmentInfo.set(response);
      },

      error: (error) => {

        console.error(
          'Erro ao carregar departamento',
          error
        );
      }
    });
  }

  // ================= GET DEPARTMENT NAMES =================

  loadDepartmentNames() {

    this.http.getDeparmentNames().subscribe({
      next: (response) => {
        this.departmentNames.set(response);
      }
    })
  }

  // ===================== PAGINATION =====================

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

  // ===================== SEARCH =====================

  setSearch(value: string) {

    this.search.set(value);
    // volta pra primeira página
    this.page.set(0);

    this.loadDepartments();
  }

  // ===================== RESET =====================

  resetLoadDepartments() {
    this.loadDepartments();
  }

  resetStatus() {
    this.registerStatus.set('default');
    this.updateStatus.set('default');
    this.deleteStatus.set('default');
  }

  resetDepartmentInfo() {
    this.departmentInfo.set(null);
  }

  resetDepartmentNames() {
    this.departmentNames.set(null);
  }
}
