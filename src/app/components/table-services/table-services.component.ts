import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalStatesService } from '../../services/states/global-states.service';
import { ServiceManagementService } from '../../services/states/serviceManagement/service-management.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-services',
  imports: [ CommonModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './table-services.component.html',
  styleUrl: './table-services.component.css'
})
export class TableServicesComponent {

  // ===== Injections ====
  private globalState = inject(GlobalStatesService);
  private serviceState = inject(ServiceManagementService);
  private fb = inject(FormBuilder);
  // =====================

  // ===== States ====
  public openTableServices = this.globalState.openTableServices
  public services = this.serviceState.services;
  public page = this.serviceState.page;
  public totalPages = this.serviceState.totalPages;
  public totalElements = this.serviceState.totalElements;
  public search = this.serviceState.search;

  public openTableDeparments = this.globalState.openTableDeparments;
  public serviceInfo = this.serviceState.serviceInfo;
  // =====================

  // ===== Variables ====
  public itemsPerPage = 4;
  public openModalUpdate = false;
  public openModalDelete = false;

  // Form
  public updateServiceManagementForm! : FormGroup;

  // === Initializations ===
  ngOnInit(){
    this.serviceState.loadServices();
    this.initializeFormUpdateServiceManagement();
  }

  constructor() {

    effect(() => {

      if (this.serviceState.serviceInfo() != null) {

        let active = '';

        if (this.serviceInfo()?.active === true ) {
          active = 'Ativo'
        } else {
          active = 'Inativo'
        }

        this.updateServiceManagementForm = this.fb.group({
          serviceManagementId: this.serviceInfo()?.serviceManagementId,
          name: this.serviceInfo()?.name,
          code: this.serviceInfo()?.code,
          description: this.serviceInfo()?.description,
          active: active,
          departmentName: this.serviceInfo()?.departmentName
        })
      }
    })
  }

  // Initialize form
  initializeFormUpdateServiceManagement() {

    this.updateServiceManagementForm = this.fb.group({
      serviceManagementId: [''],
      name: [''],
      code: [''],
      description: [''],
      active: [''],
      departmentName: ['']
    })
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
    return Array.from(
      { length: this.totalPages() },
      (_, i) => i
    );
  }

  // ===== Modal ==========

  openModalUpdateService(serviceManagementId : string) {
    this.openModalUpdate = !this.openModalUpdate;
    this.serviceState.getInfoService(serviceManagementId);
  }

  closeModalUpdateService() {
    this.openModalUpdate = !this.openModalUpdate;
    this.serviceState.serviceInfo.set(null);
  }

  openModalDeleteService(serviceManagementId : string) {
    this.openModalDelete = !this.openModalDelete;
    this.serviceState.getInfoService(serviceManagementId);
  }

  closeModalDeleteService() {
    this.openModalDelete = !this.openModalDelete;
    this.serviceState.serviceInfo.set(null);
  }

  // OnSubmit

  onSubmitUpdateServiceManagement() {

  }
}
