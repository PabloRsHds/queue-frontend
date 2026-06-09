import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulingStateService } from '../../services/states/scheduling/scheduling-state.service';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-scheduling',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './scheduling.component.html',
  styleUrl: './scheduling.component.css'
})
export class SchedulingComponent implements OnInit{

  ngOnInit() {
    this.customerState.loadCustomers();
    this.customerState.loadStatistics();
  }

  // ==== Injections ====
  private customerState = inject(SchedulingStateService);

  // Variables
  dropDown: number | null = null;
  itemsPerPage = 4;
  public table = signal<string>('Scheduling');

  // Modals
  modalCustomerRegister = false;
  modalCustomerUpdate = false;
  modalCustomerDelete = false;
  modalCustomerView = false;

  // Form
  registerForm!: FormGroup;
  updateForm!: FormGroup;

  // ==== CUSTOMERS STATES ====
  public customers = this.customerState.customers;
  public customerInfo = this.customerState.customerInfo;
  public customerPage = this.customerState.page;
  public customerTotalPages = this.customerState.totalPages;
  public customerTotalElements = this.customerState.totalElements;

  // ====== MODALS ========

  public openModalRegister() {

  }

  public openModalUpdate(customerId: string) {

  }

  public openModalDelete(customerId: string) {

  }



  public closeModalRegister() {

  }

  public closeModalUpdate() {

  }

  public closeModalDelete() {

  }

  public openCustomerModalView(customerId: string) {
    this.customerState.getInfoCustomer(customerId);
    this.modalCustomerView = true;
  }

  public closeCustomerModalView() {
    this.modalCustomerView = false;
    this.customerState.resetCustomerInfo();
  }

  // ===================== SEARCH =====================
  onSearch(event: any) {

    if (this.table() === 'Scheduling') {
      //
    } else {
      this.customerState.setSearch(event.target.value);
    }
  }

  // ===================== PAGINATION =====================
  nextPage() {
    if (this.table() === 'Scheduling') {
      //
    } else {
      this.customerState.nextPage();
    }
  }

  previousPage() {

    if (this.table() === 'Scheduling') {
      //
    } else {
      this.customerState.previousPage();
    }
  }

  goToPage(page: number) {

    if (this.table() === 'Scheduling') {
      //
    } else {
      this.customerState.goToPage(page);
    }
  }

  getStartIndex(): number {

    if (this.table() === 'Scheduling') {
      return 0;
    } else {
      return this.customerPage() * this.itemsPerPage + 1;
    }
  }

  getEndIndex(): number {

    if (this.table() === 'Scheduling') {
      return 0;
    } else {
      return Math.min(
        (this.customerPage() + 1) * this.itemsPerPage,
        this.customerTotalElements()
      )
    }
  }

  getPagesArray(): number[] {

    if (this.table() === 'Scheduling') {
      return [];
    } else {

      const total = this.customerTotalPages();
      const current = this.customerPage();

      const maxVisible = 4;

      let start = current - Math.floor(maxVisible / 2);
      let end = current + Math.floor(maxVisible / 2) + 1;

      if (start < 0) {
        start = 0;
        end = Math.min(maxVisible, total);
      }

      if (end > total) {
        end = total;
        start = Math.max(0, total - maxVisible);
      }

      return Array.from(
        { length: end - start },
        (_, i) => start + i
      );
    }

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

  // Register

  registerDepartment() {

  }

  updateDepartment() {

  }

  deleteDepartment(customerId: string) {

  }

  // Handle
  public handleTable(table: string) {
    this.table.set(table);
  }
}
