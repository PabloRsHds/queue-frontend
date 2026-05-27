import { Component, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceManagementService } from '../../services/states/serviceManagement/service-management.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DepartmentStateService } from '../../services/states/department/department-state.service';

@Component({
  selector: 'app-table-services',
  imports: [ CommonModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './table-services.component.html',
  styleUrl: './table-services.component.css'
})
export class TableServicesComponent implements OnInit{

  // Initialize
  ngOnInit(): void {
    this.initializeRegisterForm();
    this.serviceState.loadServices();
    this.serviceState.loadStatistics();
  }

  // Injections
  public serviceState = inject(ServiceManagementService);
  private deparmentState = inject(DepartmentStateService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  // States
  public services = this.serviceState.services;
  public serviceInfo = this.serviceState.serviceInfo;
  public departmentNames = this.deparmentState.departmentNames;

  public page = this.serviceState.page;
  public totalPages = this.serviceState.totalPages;
  public totalElements = this.serviceState.totalElements;
  public statistics = this.serviceState.statistics;

   // Form update
  public updateForm!: FormGroup;

  // variables Modals
  public openDropdownDelete: string = '';
  public modalRegister: boolean = false;
  public modalUpdate: boolean = false;
  public modalDelete: boolean = false;
  public modalView: boolean = false;
  // =========

  // Search
  searchQuery = '';
  itemsPerPage = 4;

  // Effects
  constructor() {

    this.updateForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      description: ['', Validators.required],
      departmentName: ['', Validators.required],
      active: [false]
    });

    effect(() => {

      const service = this.serviceInfo();

      if (this.modalUpdate && this.serviceInfo() != null) {

        this.updateForm.patchValue({
          name: service?.name,
          code: service?.code,
          description: service?.description,
          departmentName: service?.departmentName,
          active: service?.active
        });
      }
    });

    effect(() => {

      if (this.serviceState.registerStatus() === 'success') {

        this.registerForm.reset();
        this.serviceState.resetStatus();
        this.modalRegister = false;

        this.snackBar.open(this.serviceState.registerMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      }

      if (this.serviceState.registerStatus() === 'error') {

        this.serviceState.resetStatus();

        this.snackBar.open(this.serviceState.registerMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-danger']
        });
      }
    });

    effect(() => {

      if (this.serviceState.updateStatus() === 'success') {

        this.updateForm.reset();
        this.serviceState.resetStatus();
        this.modalUpdate = false;

        this.snackBar.open(this.serviceState.updateMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      }

      if (this.serviceState.updateStatus() === 'error') {

        this.serviceState.resetStatus();

        this.snackBar.open(this.serviceState.updateMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-danger']
        });
      }
    });

    effect(() => {

      if (this.serviceState.deleteStatus() === 'success') {

        this.serviceState.resetStatus();
        this.modalDelete = false;

        this.snackBar.open(this.serviceState.deleteMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      }

      if (this.serviceState.deleteStatus() === 'error') {

        this.serviceState.resetStatus();

        this.snackBar.open(this.serviceState.deleteMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-danger']
        });
      }
    });
  }

  // Form register
  public registerForm!: FormGroup;

  initializeRegisterForm() {

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      description: ['', Validators.required],
      departmentName: ['', Validators.required]
    });
  }

  toggleDeleteModal(serviceId: string) {

    if (this.openDropdownDelete === serviceId) {
      this.openDropdownDelete = '';
      return;
    }

    this.openDropdownDelete = serviceId;
  }

  // Register
  registerServiceManagement() {
    if (this.registerForm.invalid) return;
    this.serviceState.registerServiceManagenent(this.registerForm.value);
  }
  //===========================

  // Update
  updateServiceManagement() {
    if (this.updateForm.invalid) return;
    this.serviceState.updateServiceManagement(
      { serviceManagementId: this.serviceInfo()?.serviceManagementId, ...this.updateForm.value }
    );

    console.log(this.updateForm.value);
  }

  //===========================

  deleteServiceManagement(serviceManagementId: string) {
    if(serviceManagementId === '') return;
    this.serviceState.deleteService(serviceManagementId);
  }

  // ==========================

  // ====== Modals ========
  openModalRegister() {
    this.deparmentState.loadDepartmentNames();
    this.modalRegister = true;
  }

  closeModalRegister() {
    this.modalRegister = false;
    this.deparmentState.resetDepartmentNames();
  }

  openModalUpdate(serviceManagementId: string) {
    this.modalUpdate = true;
    this.serviceState.getInfoService(serviceManagementId);
    this.deparmentState.loadDepartmentNames();
  }

  closeModalUpdate() {
    this.modalUpdate = false;
    this.serviceState.resetInfoService();
  }

  openModalDelete(serviceManagementId: string) {
    this.openDropdownDelete = '';
    this.modalDelete = true;
    this.serviceState.getInfoService(serviceManagementId);
  }

  closeModalDelete() {
    this.modalDelete = false;
    this.serviceState.resetInfoService();
  }

  openModalView(serviceManagementId: string) {
    this.modalView = true;
    this.serviceState.getInfoService(serviceManagementId);
  }

  closeModalView() {
    this.modalView = false;
    this.serviceState.resetInfoService();
  }

  // ===================== SEARCH =====================
  onSearch(event: any) {
    this.serviceState.setSearch(event.target.value);
  }

  // ===================== PAGINATION =====================
  nextPage() {
    this.serviceState.nextPage();
  }

  previousPage() {
    this.serviceState.previousPage();
  }

  goToPage(page: number) {
    this.serviceState.goToPage(page);
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
    return Array.from({ length: this.totalPages() }, (_, i) => i);
  }
}
