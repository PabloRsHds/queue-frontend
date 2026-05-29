import { Component, effect, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentStateService } from '../../services/states/department/department-state.service';
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

  // Injections
  private departmentState = inject(DepartmentStateService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  // States
  public departments = this.departmentState.departments;
  public departmentInfo = this.departmentState.departmentInfo;

  public statistics = this.departmentState.statistics;

  public page = this.departmentState.page;
  public totalPages = this.departmentState.totalPages;
  public totalElements = this.departmentState.totalElements;

  // Variables
  private itemsPerPage = 4;

  // variables Modals
  public dropDown: number | null = null;
  public modalRegister: boolean = false;
  public modalUpdate: boolean = false;
  public modalDelete: boolean = false;
  public modalView: boolean = false;

  // Form register
  public registerForm!: FormGroup;

  initializeRegisterForm() {
    this.registerForm = this.fb.group({
      name: [''],
      description: ['']
    });
  }

  // Form update
  public updateForm!: FormGroup;

  initializeUpdateForm() {
    this.updateForm = this.fb.group({
      name: [''],
      description: [''],
      active: [false]
    });
  }

  // Initialize
  ngOnInit() {
    this.departmentState.loadDepartments();
    this.departmentState.loadStatistics();
  }

  // Constructor
  constructor() {

    // Auto-fill on update
    effect(() => {

      const department = this.departmentInfo();

      if (this.modalUpdate && this.departmentInfo() !== null) {

        this.updateForm.patchValue({
          name: department?.name,
          description: department?.description,
          active: department?.active
        });
      }
    })

    // Register
    effect(() => {

      if (this.departmentState.registerStatus() === 'success') {

        this.departmentState.resetStatus();
        this.closeModalRegister();

        this.snackBar.open(this.departmentState.registerMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      }

      if (this.departmentState.registerStatus() === 'error') {

        this.departmentState.resetStatus();

        this.snackBar.open(this.departmentState.registerMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-danger']
        });
      }
    });

    // Update
    effect(() => {

      if (this.departmentState.updateStatus() === 'success') {

        this.departmentState.resetStatus();
        this.closeModalUpdate();

        this.snackBar.open(this.departmentState.updateMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      }

      if (this.departmentState.updateStatus() === 'error') {

        this.departmentState.resetStatus();

        this.snackBar.open(this.departmentState.updateMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-danger']
        });
      }
    });

    // Delete
    effect(() => {

      if (this.departmentState.deleteStatus() === 'success') {

        this.departmentState.resetStatus();
        this.closeModalDelete();

        this.snackBar.open(this.departmentState.deleteMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      }

      if (this.departmentState.deleteStatus() === 'error') {

        this.departmentState.resetStatus();

        this.snackBar.open(this.departmentState.deleteMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-danger']
        });
      }
    });
  }

  // ====== Modals ========
  openModalRegister() {
    this.initializeRegisterForm();
    this.modalRegister = true;
  }

  closeModalRegister() {
    this.modalRegister = false;
  }

  openModalUpdate(departmentId: string) {
    this.initializeUpdateForm();
    this.departmentState.getInfoDepartment(departmentId);
    this.modalUpdate = true;
  }

  closeModalUpdate() {
    this.modalUpdate = false;
    this.departmentState.resetDepartmentInfo();
  }

  openModalDelete(departmentId: string) {
    this.departmentState.getInfoDepartment(departmentId);
    this.dropDown = null;
    this.modalDelete = true;
  }

  closeModalDelete() {
    this.modalDelete = false;
    this.departmentState.resetDepartmentInfo();
  }

  openModalView(departmentId: string) {
    this.departmentState.getInfoDepartment(departmentId);
    this.modalView = true;
  }

  closeModalView() {
    this.modalView = false;
    this.departmentState.resetDepartmentInfo();
  }

  // Register Department
  registerDepartment() {
    if (this.registerForm.invalid) return;
    this.departmentState.createDepartment(this.registerForm.value);
  }

  // Update Department
  updateDepartment() {
    if (this.updateForm.invalid) return;
    this.departmentState.updateDepartment(
      {departmentId: this.departmentState.departmentInfo()?.departmentId, ...this.updateForm.value });
  }

  // Delete Department
  deleteDepartment(departmentId: string) {
    if (departmentId === '') return;
    this.departmentState.deleteDepartment(departmentId);
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
    const total = this.totalPages();
    const current = this.page();

    const maxVisible = 4;

    let start = current - Math.floor(maxVisible / 2);
    let end = current + Math.floor(maxVisible / 2) + 1;

    // Ajusta início
    if (start < 0) {
      start = 0;
      end = Math.min(maxVisible, total);
    }

    // Ajusta final
    if (end > total) {
      end = total;
      start = Math.max(0, total - maxVisible);
    }

    return Array.from(
      { length: end - start },
      (_, i) => start + i
    );
  }

  // DropDown
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {

    const target = event.target as HTMLElement;

    // verifica se clicou dentro do menu
    const clickedInsideDropdown = target.closest('.button-menu-table')
      || target.closest('.drop-down-delete');

    if (!clickedInsideDropdown) {
      this.closeDropDown();
    }
  }
  openDropDown(index: number) {

    if (this.dropDown === index) {
      this.dropDown = null;
      return;
    }

    this.dropDown = index;
  }

  closeDropDown() {
    this.dropDown = null;
  }

}
