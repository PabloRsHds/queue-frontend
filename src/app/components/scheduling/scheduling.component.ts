import { Component, effect, HostListener, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulingStateService } from '../../services/states/scheduling/scheduling-state.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-scheduling',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './scheduling.component.html',
  styleUrl: './scheduling.component.css'
})
export class SchedulingComponent implements OnInit {

  ngOnInit() {
    this.customerState.loadCustomers();
  }

  // ==== Injections ====
  private customerState = inject(SchedulingStateService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

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
  registerCustomerForm!: FormGroup;
  updateCustomerForm!: FormGroup;

  // ==== CUSTOMERS STATES ====
  public customers = this.customerState.customers;
  public customerInfo = this.customerState.customerInfo;
  public customerPage = this.customerState.customerPage;
  public customerTotalPages = this.customerState.customerTotalPages;
  public customerTotalElements = this.customerState.customerTotalElements;
  public customerSearch = this.customerState.customerSearch;

  // ==== SCHEDULES STATES ====
  public schedules = this.customerState.schedules;
  public schedulePage = this.customerState.schedulePage;
  public scheduleTotalPages = this.customerState.scheduleTotalPages;
  public scheduleTotalElements = this.customerState.scheduleTotalElements;
  public scheduleSearch = this.customerState.scheduleSearch;

  constructor() {

    effect(() => {
      if (this.table() === 'Scheduling') {
        this.customerState.loadSchedules();
      }
    })

    this.registerCustomerForm = this.fb.group({
      name: [''],
      cpf: [''],
      rg: [''],
      email: [''],
      phone: [''],
    });

    this.updateCustomerForm = this.fb.group({
      customerId: [''],
      name: [''],
      cpf: [''],
      rg: [''],
      email: [''],
      phone: [''],
    });

    effect(() => {
      if (this.customerInfo() !== null) {
        this.updateCustomerForm.patchValue({
          customerId: this.customerInfo()?.customerId,
          name: this.customerInfo()?.name,
          cpf: this.customerInfo()?.cpf,
          rg: this.customerInfo()?.rg,
          email: this.customerInfo()?.email,
          phone: this.customerInfo()?.phone,
        });
      }
    })

    effect(() => {
      if (this.customerState.registerCustomerStatus() === 'success') {
        this.snackBar.open(this.customerState.registerCustomerMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.modalCustomerRegister = false;
        this.customerState.resetStatus();
      }

      if (this.customerState.registerCustomerStatus() === 'error') {
        this.snackBar.open(this.customerState.registerCustomerMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        this.customerState.resetStatus();
      }
    });

    effect(() => {
      if (this.customerState.updateCustomerStatus() === 'success') {
        this.snackBar.open(this.customerState.updateCustomerMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.modalCustomerUpdate = false;
        this.customerState.resetCustomerInfo();
        this.customerState.resetStatus();
      }

      if (this.customerState.updateCustomerStatus() === 'error') {
        this.snackBar.open(this.customerState.updateCustomerMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        this.customerState.resetStatus();
      }
    });

    effect(() => {
      if (this.customerState.deleteCustomerStatus() === 'success') {
        this.snackBar.open(this.customerState.deleteCustomerMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.modalCustomerDelete = false;
        this.customerState.resetStatus();
        this.customerState.resetCustomerInfo();
      }

      if (this.customerState.deleteCustomerStatus() === 'error') {
        this.snackBar.open(this.customerState.deleteCustomerMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        this.customerState.resetStatus();
      }
    })
  }

  // ====== MODALS ========
  public openCustomerModalRegister() {
    this.modalCustomerRegister = true;
  }

  public closeCustomerModalRegister() {
    this.modalCustomerRegister = false;
  }

  public openModalUpdate(customerId: string) {
    this.customerState.getInfoCustomer(customerId);
    this.modalCustomerUpdate = true;
  }

  public closeCustomerModalUpdate() {
    this.modalCustomerUpdate = false;
    this.customerState.resetCustomerInfo();
  }

  public openModalDelete(customerId: string) {
    this.modalCustomerDelete = true;
    this.customerState.getInfoCustomer(customerId);
  }

  public closeCustomerModalDelete() {
    this.modalCustomerDelete = false;
    this.customerState.resetCustomerInfo();
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
      this.customerState.setScheduleSearch(event.target.value);
    } else {
      this.customerState.setCustomerSearch(event.target.value);
    }
  }

  // ===================== PAGINATION =====================
  nextPage() {
    if (this.table() === 'Scheduling') {
      this.customerState.nextSchedulePage();
    } else {
      this.customerState.nextCustomerPage();
    }
  }

  previousPage() {
    if (this.table() === 'Scheduling') {
      this.customerState.previousSchedulePage();
    } else {
      this.customerState.previousCustomerPage();
    }
  }

  goToPage(page: number) {
    if (this.table() === 'Scheduling') {
      this.customerState.goToSchedulePage(page);
    } else {
      this.customerState.goToCustomerPage(page);
    }
  }

  getStartIndex(): number {
    if (this.table() === 'Scheduling') {
      return this.schedulePage() * this.itemsPerPage + 1;
    } else {
      return this.customerPage() * this.itemsPerPage + 1;
    }
  }

  getEndIndex(): number {
    if (this.table() === 'Scheduling') {
      return Math.min(
        (this.schedulePage() + 1) * this.itemsPerPage,
        this.scheduleTotalElements()
      );
    } else {
      return Math.min(
        (this.customerPage() + 1) * this.itemsPerPage,
        this.customerTotalElements()
      );
    }
  }

  getPagesArray(): number[] {
    let total: number;
    let current: number;

    if (this.table() === 'Scheduling') {
      total = this.scheduleTotalPages();
      current = this.schedulePage();
    } else {
      total = this.customerTotalPages();
      current = this.customerPage();
    }

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

  // DropDown
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
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
  registerCustomer() {
    if (this.registerCustomerForm.invalid) return;
    this.customerState.registerCustomer(this.registerCustomerForm.value);
  }

  updateCustomer() {
    if (this.updateCustomerForm.invalid) return;
    this.customerState.updateCustomer(this.updateCustomerForm.value);
  }

  deleteCustomer(customerId: string) {
    this.customerState.deleteCustomer(customerId);
  }

  // Handle
  public handleTable(table: string) {
    this.table.set(table);
  }
}
