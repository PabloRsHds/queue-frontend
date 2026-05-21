import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalStatesService } from '../../services/states/global-states.service';
import { DepartmentStateService } from '../../services/states/department/department-state.service';
import { HttpService } from '../../services/backend/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-departments',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './table-departments.component.html',
  styleUrl: './table-departments.component.css'
})
export class TableDepartmentsComponent implements OnInit {

  // ===================== INJECTS =====================

  public http = inject(HttpService);
  public snackBar = inject(MatSnackBar);
  public globalState = inject(GlobalStatesService);
  public departmentState = inject(DepartmentStateService);
  public fb = inject(FormBuilder);

  // ===================== STATE =====================

  public departments = this.departmentState.departments;
  public page = this.departmentState.page;
  public totalPages = this.departmentState.totalPages;
  public totalElements = this.departmentState.totalElements;
  public departmentInfo = this.departmentState.departmentInfo;
  public search = this.departmentState.search;
  public openTableDeparments = this.globalState.openTableDeparments;

  public updateStatus = this.departmentState.updateStatus;
  public updateMessage = this.departmentState.updateMessage;

  public deleteStatus = this.departmentState.deleteStatus;
  public deleteMessage = this.departmentState.deleteMessage;

  // ===================== MODAIS =====================

  public openModalDeleteDepartment = false;
  public openModalUpdateDepartment = false;
  public openModalDepartmentDetail = false;

  // ===================== SECTION =====================

  public currentSection: 'departamento' | 'servico' | 'config' = 'departamento';

  // ===================== FORM =====================

  public updateDepartmentForm!: FormGroup;

  initializeUpdateForm() {

    this.updateDepartmentForm = this.fb.group({
      departmentId: [''],
      name: [''],
      description: ['']
    });
  }

  // ===================== EXTRA =====================

  public itemsPerPage = 4;

  // ==================== Intialize ============
  constructor() {

    // Effect delete
    effect(() => {

      if (this.deleteStatus() === 'success') {

        this.closeModalDeleteDepartment();
        this.departmentState.resetStatus();

        this.snackBar.open( this.deleteMessage(),'Fechar',
          { duration: 3000,
            panelClass: ['snackbar-success']
          }
        );
      }

      if (this.deleteStatus() === 'error') {

        this.departmentState.resetStatus();

        this.snackBar.open(this.deleteMessage(),'Fechar',
          { duration: 3000,
            panelClass: ['snackbar-danger']
          }
        );
      }
    });

    // Effect update
    effect(() => {

      if (this.updateStatus() === 'success') {

        this.departmentState.resetStatus();
        this.updateDepartmentForm.reset();
        this.closeModalUpdateDepartment();

        this.snackBar.open(this.updateMessage(),'Fechar',
          { duration: 3000,
            panelClass: ['snackbar-success']
          }
        );
      }

      if (this.updateStatus() === 'error') {

        this.departmentState.resetStatus();

        this.snackBar.open(this.updateMessage(),'Fechar',
          { duration: 3000,
            panelClass: ['snackbar-danger']
          }
        );
      }
    });

    effect(() => {

      const department = this.departmentInfo();

      if (department) {

        this.updateDepartmentForm.patchValue({
          departmentId: department.departmentId,
          name: department.name,
          description: department.description
        });
      }
    });
  }

  ngOnInit() {
    this.departmentState.loadDepartments();
    this.initializeUpdateForm();
  }

  // ===================== SEARCH =====================

  onSearch(event: any) {
    this.departmentState.setSearch(event.target.value);
  }

  // ===================== PAGINATION =====================

  nextPage() {
    this.departmentState.nextPage();
  }

  previousPage() {
    this.departmentState.previousPage();
  }

  goToPage(page: number) {
    this.departmentState.goToPage(page);
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

    this.openModalDepartmentDetail = true;
    // Pego a informação e passo para o departmentInfo
    this.departmentState.getInfoDepartment(departmentId);
  }

  closeModalDepartmentDetail(){
    this.openModalDepartmentDetail = false;
    this.departmentState.resetDepartmentInfo();
  }

  // ===================== UPDATE =====================

  showModalUpdateDepartment(departmentId: string) {

    this.departmentState.getInfoDepartment(departmentId);
    this.openModalUpdateDepartment = true;
  }

  closeModalUpdateDepartment() {
    this.openModalUpdateDepartment = false;
    this.departmentState.resetDepartmentInfo();
  }

  onSubmitUpdateDepartment() {
    if (this.updateDepartmentForm.invalid) return;
    this.departmentState.updateDepartment(this.updateDepartmentForm.value);
  }

  // ===================== DELETE =====================

  showModalDeleteDepartment(departmentId: string) {
    this.departmentState.getInfoDepartment(departmentId);
    this.openModalDeleteDepartment = true;
  }

  closeModalDeleteDepartment() {
    this.openModalDeleteDepartment = false;
    this.departmentState.resetDepartmentInfo();
  }

  deleteDepartment(departmentId: string) {

    this.departmentState.deleteDepartment(departmentId);
  }
}
