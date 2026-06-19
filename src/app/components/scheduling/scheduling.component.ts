import { Component, effect, HostListener, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerStateService } from '../../services/states/customer/customer-state.service';
import { ScheduleStateService } from '../../services/states/scheduling/scheduling-state.service';
import { ServiceManagementService } from '../../services/states/serviceManagement/service-management.service';
import { TicketStateService } from '../../services/states/ticket/ticket-state.service';
import { ResponseAllCustomersDto } from '../../dtos/customer/ResponseAllCustomersDto';

@Component({
  selector: 'app-scheduling',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './scheduling.component.html',
  styleUrl: './scheduling.component.css'
})
export class SchedulingComponent implements OnInit {

  ngOnInit() {
    this.customerState.loadCustomers();
    this.schedulingState.loadScheduleStatistics();
  }

  // ==== Injections ====
  private customerState = inject(CustomerStateService);
  private schedulingState = inject(ScheduleStateService);
  private serviceState = inject(ServiceManagementService);
  private ticketState = inject(TicketStateService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  // Variables
  dropDown: number | null = null;
  itemsPerPage = 4;
  table = signal<string>('Scheduling');
  currentDate = new Date();
  searchCustomerInput = '';
  updateCustomerSearch = '';

  // MODAIS SCHEDULING
  modalSchedulingRegister = false;
  modalSchedulingUpdate = false;
  modalSchedulingDelete = false;
  modalSchedulingView = false;

  // MODAIS CUSTOMER
  modalCustomerRegister = false;
  modalCustomerUpdate = false;
  modalCustomerDelete = false;
  modalCustomerView = false;

  // MODAL TICKET
  modalTicket = false;
  modalTicketPrinting = false;

  // Form Customers
  registerCustomerForm!: FormGroup;
  updateCustomerForm!: FormGroup;

  // Form Schedules
  registerScheduleForm!: FormGroup;
  updateScheduleForm!: FormGroup;

  // ==== SERVICES STATES ====
  public serviceNamesAndDepartments = this.serviceState.serviceNamesAndDepartments;

  // ==== CUSTOMERS STATES ====
  public customers = this.customerState.customers;
  public customerInfo = this.customerState.customerInfo;
  public customerPage = this.customerState.customerPage;
  public customerTotalPages = this.customerState.customerTotalPages;
  public customerTotalElements = this.customerState.customerTotalElements;
  public customerSearch = this.customerState.customerSearch;
  public customerIdsAndNames = this.customerState.customerIdsAndNames;
  public customerSuggestions = this.customerState.customerSuggestions;

  // ==== SCHEDULES STATES ====
  public schedules = this.schedulingState.schedules;
  public scheduleInfo = this.schedulingState.scheduleInfo;
  public schedulePage = this.schedulingState.schedulePage;
  public scheduleTotalPages = this.schedulingState.scheduleTotalPages;
  public scheduleTotalElements = this.schedulingState.scheduleTotalElements;
  public scheduleSearch = this.schedulingState.scheduleSearch;
  public scheduleStatistics = this.schedulingState.scheduleStatistics;

  // ==== TICKET STATES =====
  public ticketInfo = this.ticketState.ticketInfo;

  // ==== STATES ====
  public customerId = signal<string>('');
  public serviceManagementId = signal<string>('');

  constructor() {

    effect(() => {
      if (this.table() === 'Scheduling') {
        this.schedulingState.loadSchedules();
      }
    })

    this.registerScheduleForm = this.fb.group({
      customerId: [''],
      serviceManagementId: [''],
      priority: [''],
      scheduledDate: [''],
    });

    this.updateScheduleForm = this.fb.group({
      scheduleId: [''],
      customerId: [''],
      serviceManagementId: [''],
      priority: [''],
      scheduledDate: [''],
      status: ['']
    });

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

      const schedule = this.scheduleInfo();
      const customers = this.customerIdsAndNames();

      if (!schedule) return;

      this.updateScheduleForm.patchValue({
        scheduleId: schedule.scheduleId,
        customerId: schedule.customerId,
        serviceManagementId: schedule.serviceManagementId,
        priority: schedule.priority,
        scheduledDate: schedule.scheduledDate,
        status: schedule.status
      });

      const customer = customers.find(
        c => c.customerId === schedule.customerId
      );

      this.updateCustomerSearch = customer?.name ?? '';

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

      if (this.schedulingState.registerStatus() === 'success') {
        this.snackBar.open(this.schedulingState.registerMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.modalSchedulingRegister = false;
        this.registerScheduleForm.reset();
        this.schedulingState.resetStatus();
      }

      if (this.schedulingState.registerStatus() === 'error') {
        this.snackBar.open(this.schedulingState.registerMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        this.schedulingState.resetStatus();
      }
    })

    effect(() => {

      if (this.schedulingState.updateStatus() === 'success') {
        this.snackBar.open(this.schedulingState.updateMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.schedulingState.resetStatus();
        this.updateScheduleForm.reset();
        this.serviceNamesAndDepartments.set([]);
        this.customerIdsAndNames.set([]);
        this.modalSchedulingUpdate = false;
        this.schedulingState.resetScheduleInfo();
      }

      if (this.schedulingState.updateStatus() === 'error') {
        this.snackBar.open(this.schedulingState.updateMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        this.schedulingState.resetStatus();
      }
    })

    effect(() => {
      if (this.customerState.registerCustomerStatus() === 'success') {
        this.snackBar.open(this.customerState.registerCustomerMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.modalCustomerRegister = false;
        this.registerCustomerForm.reset();
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
      if (this.schedulingState.deleteStatus() === 'success') {
        this.snackBar.open(this.schedulingState.deleteMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.modalSchedulingDelete = false;
        this.schedulingState.resetStatus();
        this.schedulingState.resetScheduleInfo();
      }

      if (this.schedulingState.deleteStatus() === 'error') {
        this.snackBar.open(this.schedulingState.deleteMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        this.schedulingState.resetStatus();
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
    });

    effect(() => {

      if (this.ticketState.createStatus() === 'success') {
        this.snackBar.open(this.ticketState.createMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.ticketState.resetStatus();
        this.modalTicket = false;
        this.modalTicketPrinting = true;
        this.printTicket();
      }

      if (this.ticketState.createStatus() === 'error') {
        this.snackBar.open(this.ticketState.createMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        this.ticketState.resetStatus();
      }
    });

    effect(() => {

      if (this.ticketState.deleteStatus() === 'success') {
        this.snackBar.open(this.ticketState.deleteMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.ticketState.resetStatus();
        this.modalTicket = false;
        this.modalTicketPrinting = true;
        this.printTicket();
      }

      if (this.ticketState.deleteStatus() === 'error') {
        this.snackBar.open(this.ticketState.deleteMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        this.ticketState.resetStatus();
      }
    });
  }

  // ====== MODALS SCHEDULE =========
  public openScheduleModalRegister() {
    this.modalSchedulingRegister = true;
    this.customerState.loadCustomerIdsAndNames();
    this.serviceState.loadServiceNamesAndDepartments();
  }

  public closeScheduleModalRegister() {
    this.modalSchedulingRegister = false;
  }

  public openScheduleModalUpdate(scheduleId: string) {
    this.schedulingState.getScheduleById(scheduleId);
    this.customerState.loadCustomerIdsAndNames();
    this.serviceState.loadServiceNamesAndDepartments();
    this.modalSchedulingUpdate = true;
  }

  public closeScheduleModalUpdate() {
    this.modalSchedulingUpdate = false;
    this.updateScheduleForm.reset();
    this.customerIdsAndNames.set([]);
    this.scheduleInfo.set(null);
    this.updateCustomerSearch = '';
  }

  public openScheduleModalDelete(scheduleId: string) {
    this.schedulingState.getScheduleById(scheduleId);
    this.modalSchedulingDelete = true;
  }

  public closeScheduleModalDelete() {
    this.modalSchedulingDelete = false;
    this.scheduleInfo.set(null);
  }

  public openScheduleModalView(scheduleId: string, customerId: string) {
    this.customerState.getInfoCustomer(customerId);
    this.schedulingState.getScheduleById(scheduleId);
    this.modalSchedulingView = true;
  }

  public closeScheduleModalView() {
    this.modalSchedulingView = false;
    this.scheduleInfo.set(null);
  }

  // ====== MODALS CUSTOMER =========
  public openCustomerModalRegister() {
    this.modalCustomerRegister = true;
  }

  public closeCustomerModalRegister() {
    this.modalCustomerRegister = false;
  }

  public openCustomerModalUpdate(customerId: string) {
    this.customerState.getInfoCustomer(customerId);
    this.modalCustomerUpdate = true;
  }

  public closeCustomerModalUpdate() {
    this.modalCustomerUpdate = false;
    this.customerState.resetCustomerInfo();
  }

  public openCustomerModalDelete(customerId: string) {
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

  public openTicketModal(scheduleId: string) {
    this.modalTicket = true;
    this.schedulingState.getScheduleById(scheduleId);
  }

  public closeTicketModal() {
    this.modalTicket = false;
  }

  public closeTicketPrintingModal() {
    this.modalTicketPrinting = false;
  }

  // ===================== SEARCH =====================
  onSearch(event: any) {
    if (this.table() === 'Scheduling') {
      this.schedulingState.setSearch(event.target.value);
    } else {
      this.customerState.setSearch(event.target.value);
    }
  }

  onDateFilter(event: any) {
    if (this.table() === 'Scheduling') {

      this.schedulingState.setSearchDate(event.target.value);
      console.log(event.target.value);
    }
  }

  // ===================== PAGINATION =====================
  nextPage() {
    if (this.table() === 'Scheduling') {
      this.schedulingState.nextPage();
    } else {
      this.customerState.nextPage();
    }
  }

  previousPage() {
    if (this.table() === 'Scheduling') {
      this.schedulingState.previousPage();
    } else {
      this.customerState.previousPage();
    }
  }

  goToPage(page: number) {
    if (this.table() === 'Scheduling') {
      this.schedulingState.goToPage(page);
    } else {
      this.customerState.goToPage(page);
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

  // ===================== SCHEDULE =====================

  registerSchedule() {
    if (this.registerScheduleForm.invalid) return;
    this.schedulingState.registerSchedule(this.registerScheduleForm.value);
  }

  updateSchedule() {
    this.schedulingState.updateSchedule(this.updateScheduleForm.value);
  }

  deleteSchedule(scheduleId: string) {
    this.schedulingState.deleteSchedule(scheduleId);
  }

  // ===================== CUSTOMER =====================

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

  // ================= TICKET ============================
  createTicket() {

    if (this.scheduleInfo() === null) return;

    this.ticketState.createTicket(
      {
        customerId: this.scheduleInfo()?.customerId ?? '',
        serviceManagementId: this.scheduleInfo()?.serviceManagementId ?? '',
        scheduleId: this.scheduleInfo()?.scheduleId ?? '',
        priority: 'NORMAL'
      });
  }

  deleteTicket(ticketId: string) {

    if (ticketId === '') return;
    this.ticketState.deleteTicket(ticketId);
  }

  // ================= HANDLE ============================
  public handleTable(table: string) {
    this.table.set(table);
  }

  public getStatusSchedule(status: string) {
    if (status === 'SCHEDULED') return 'Agendado';
    if (status === 'PRESENT') return 'Presente';
    if (status === 'CANCELED') return 'Cancelado';
    if (status === 'ABSENT') return 'Ausente';
    return '';
  }

  public getStatusClass(status: string): string {
    if (status === 'SCHEDULED') return 'status-scheduled';
    if (status === 'PRESENT') return 'status-present';
    if (status === 'CANCELED') return 'status-canceled';
    if (status === 'ABSENT') return 'status-absent';
    return '';
  }

  public printTicket(): void {
    setTimeout(() => {
      window.print();
    }, 100);
  }

  public getNamePriority(priority: string) {
    if (priority === 'NORMAL') return 'Normal';
    if (priority === 'PRIORITY') return 'Prioridade';
    return '';
  }

  public getDocumentForTableSchedule(cpf: string, rg: string, phone: string, email: string): string {

    if (cpf !== '') return cpf;
    if (rg !== '') return rg;
    if (phone !== '') return phone;
    if (email !== '') return email;
    return '';
  }

  // Método para proucurar usuário pelo input
  onCustomerSearch(event: Event) {

    const value = (event.target as HTMLInputElement).value;

    this.searchCustomerInput = value;

    if (value.trim().length < 2) {
      this.customerSuggestions.set([]);
      return;
    }

    this.customerState.searchCustomers(value);
  }

  selectCustomer(customer: ResponseAllCustomersDto) {

    this.searchCustomerInput = customer.name;

    this.registerScheduleForm.patchValue({
      customerId: customer.customerId
    });

    this.updateScheduleForm.patchValue({
      customerId: customer.customerId
    });

    this.customerSuggestions.set([]);
  }

  onUpdateCustomerSearch(event: Event) {

    const value = (event.target as HTMLInputElement).value;

    this.updateCustomerSearch = value;

    if (value.trim().length < 2) {
      this.customerState.customerSuggestions.set([]);
      return;
    }

    this.customerState.searchCustomers(value);
  }

  selectUpdateCustomer(customer: ResponseAllCustomersDto) {

    this.updateCustomerSearch = customer.name;

    this.updateScheduleForm.patchValue({
      customerId: customer.customerId
    });

    this.customerState.customerSuggestions.set([]);
  }
}
