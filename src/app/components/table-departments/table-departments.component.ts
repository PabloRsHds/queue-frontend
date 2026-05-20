import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalStatesService } from '../../services/states/global-states.service';
import { DepartmentStateService } from '../../services/states/department/department-state.service';
import { HttpService } from '../../services/backend/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResponseGetDepartmentDto } from '../../dtos/department/ResponseGetDepartment';

@Component({
  selector: 'app-table-departments',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './table-departments.component.html',
  styleUrl: './table-departments.component.css'
})
export class TableDepartmentsComponent {

  // ===================== INJECTS =====================

  public http = inject(HttpService);
  public snackBar = inject(MatSnackBar);
  public globalState = inject(GlobalStatesService);
  public fb = inject(FormBuilder);

  // ===================== STATE =====================

  private state = inject(DepartmentStateService);

  departments = this.state.filteredDepartments;
  page = this.state.page;
  totalPages = this.state.totalPages;
  totalElements = this.state.totalElements;
  selectedDepartment = this.state.selectedDepartment;
  search = this.state.search;
  openTableDeparments = this.globalState.openTableDeparments;


  // ===================== MODAIS =====================

  openModalDeleteDepartment = false;
  openModalUpdateDepartment = false;
  openModalDepartmentDetail = false;

  // ===================== SECTION =====================

  currentSection: 'departamento' | 'servico' | 'config' = 'departamento';

  // ===================== FORM =====================

  updateDepartmentForm!: FormGroup;

  // ===================== EXTRA =====================

  department = signal<ResponseGetDepartmentDto | null>(null);

  itemsPerPage = 4;

  // ===================== INIT =====================

  ngOnInit() {
    this.state.loadDepartments();
  }

  // ===================== SEARCH =====================

  onSearch(event: any) {
    this.state.setSearch(event.target.value);
  }

  // ===================== PAGINATION =====================

  nextPage() {
    this.state.nextPage();
  }

  previousPage() {
    this.state.previousPage();
  }

  goToPage(page: number) {
    this.state.goToPage(page);
  }

  getStartIndex(): number {
    return this.page() * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    return Math.min(
      (this.page() + 1) * this.itemsPerPage,
      this.totalElements()
    );
  }

  getPagesArray(): number[] {
    return Array.from(
      { length: this.totalPages() },
      (_, i) => i
    );
  }

  // ===================== DETAIL =====================

  showDepartmentDetail(departmentId: string) {

    this.openModalDepartmentDetail = !this.openModalDepartmentDetail;

    this.http.getDepartmentById(departmentId).subscribe({
      next: (response) => {
        this.selectedDepartment.set(response);
      }
    });
  }

  // ===================== DELETE =====================

  showModalDeleteDepartment(departmentId: string) {

    if (this.selectedDepartment() == null) {

      this.http.getDepartmentById(departmentId).subscribe({
        next: (response) => {
          this.selectedDepartment.set(response);
          this.department.set(response);
        }
      });

    }

    this.openModalDeleteDepartment = true;
  }

  closeModalDeleteDepartment() {
    this.openModalDeleteDepartment = false;
  }

  deleteDepartment() {

    const departmentId = this.department()?.departmentId;

    if (!departmentId) return;

    this.http.deleteDepartment(departmentId).subscribe({

      next: () => {

        this.state.loadDepartments();

        this.closeModalDeleteDepartment();

        this.selectedDepartment.set(null);
        this.department.set(null);

        this.snackBar.open(
          'Departamento excluido com sucesso!',
          'Fechar',
          {
            duration: 3000
          }
        );
      },

      error: () => {

        this.snackBar.open(
          'Erro ao excluir departamento.',
          'Fechar',
          {
            duration: 3000
          }
        );
      }
    });
  }

  // ===================== UPDATE =====================

  showModalUpdateDepartment(departmentId: string) {

    this.http.getDepartmentById(departmentId).subscribe({

      next: (response) => {

        this.selectedDepartment.set(response);

        this.updateDepartmentForm = this.fb.group({
          departmentId: [response.departmentId],
          name: [response.name],
          description: [response.description]
        });

        this.openModalUpdateDepartment = true;
      }
    });
  }

  closeModalUpdateDepartment() {
    this.openModalUpdateDepartment = false;
  }

  onSubmitUpdateDepartment(): void {

    if (this.updateDepartmentForm.invalid) return;

    this.http.updateDepartment(this.updateDepartmentForm.value).subscribe({

      next: () => {

        this.state.page.set(0);

        this.state.refresh();

        this.updateDepartmentForm.reset();

        this.closeModalUpdateDepartment();

        this.snackBar.open(
          'Departamento atualizado com sucesso!',
          'Fechar',
          {
            duration: 3000
          }
        );
      },

      error: () => {

        this.snackBar.open(
          'Erro ao atualizar departamento.',
          'Fechar',
          {
            duration: 3000
          }
        );
      }
    });
  }
}
