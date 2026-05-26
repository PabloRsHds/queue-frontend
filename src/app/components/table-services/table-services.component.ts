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

  public totalElements = this.serviceState.totalElements;
  public totalElementsActive = this.serviceState.totalElementsActive;
  public totalElementsInactive = this.serviceState.totalElementsInactive;
  public percentageActive = this.serviceState.percentageActive;
  public percentageInactive = this.serviceState.percentageInactive;

  // Effects
  constructor() {

    this.updateForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      description: ['', Validators.required],
      departmentName: ['', Validators.required],
      active: [false]
    })

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
    })

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
    })

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
    })
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

  // Form update
  public updateForm!: FormGroup;

  // variables Modals
  public openDropdownDelete: string = '';
  public modalRegister: boolean = false;
  public modalUpdate: boolean = false;
  public openModalDelete: boolean = false;
  public modalView: boolean = false;
  // =========

  toggleDeleteModal(serviceId: string) {

    if (this.openDropdownDelete === serviceId) {
      this.openDropdownDelete = '';
      return;
    }

    this.openDropdownDelete = serviceId;
  }

  handleCloseModalDelete() {
    this.openDropdownDelete = '';
    this.openModalDelete = true;
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

  openModalView(serviceManagementId: string) {
    this.modalView = true;
    this.serviceState.getInfoService(serviceManagementId);
  }

  closeModalView() {
    this.modalView = false;
    this.serviceState.resetInfoService();
  }

  closeModalUpdate() {
    this.modalUpdate = false;
    this.serviceState.resetInfoService();
  }
}
