import { Component, effect, HostListener, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStateService } from '../../services/states/user/user-state.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceManagementService } from '../../services/states/serviceManagement/service-management.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-table-users',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './table-users.component.html',
  styleUrl: './table-users.component.css'
})
export class TableUsersComponent implements OnInit {

  ngOnInit(){
    this.userState.loadingAllUsers();
    this.userState.loadStatistics();
    this.initRegisterForm();
  }

  constructor() {

    effect(() => {

      if (this.userState.registerStatus() === 'success') {
        this.snackBar.open(this.userState.registerMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.registerForm.reset();
        this.modalRegister = false;
      }

      if (this.userState.registerStatus() === 'error') {
        this.snackBar.open(this.userState.registerMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    })

    effect(() => {

      if (this.selectedRole() === 'RECEPTION') {
        this.registerForm.patchValue({
          serviceIds: []
        });

        this.selectedServices = [];
        this.selectedServiceNames = [];
      }
    })
  }

  // Injections
  private userState = inject(UserStateService);
  private serviceState = inject(ServiceManagementService)
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  // States
  public users = this.userState.users;
  public services = this.serviceState.servicesForCreatedUser;
  public statistics = this.userState.statistics;

  public page = this.userState.page;
  public totalPages = this.userState.totalPages;
  public totalElements = this.userState.totalElements;

  // Modals
  public modalRegister: boolean = false;
  public modalUpdate: boolean = false;
  public modalDelete: boolean = false;
  public modalView: boolean = false;
  public currentStep: number = 1;

  // Form
  public registerForm!: FormGroup;
  public selectedRole = signal<string>('MANAGER');

  public selectedPermissions: string[] = [
    'Gerenciar usuários',
    'Gerenciar departamentos',
    'Gerenciar serviços',
    'Agendamentos',
    'Atendimentos',
    'Relatórios',
    'Configurações'
  ];
  public allPermissions: string[] = [
    'Gerenciar usuários',
    'Gerenciar departamentos',
    'Gerenciar serviços',
    'Agendamentos',
    'Atendimentos',
    'Relatórios',
    'Configurações',
    'Chamadas'
  ];

  // Serviços (substituiu departments)
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;
  public showReviewPassword: boolean = false;

  // Variables
  public dropDown: number | null = null;
  public itemsPerPage = 4;

  // Success Modal
  public showSuccessModal: boolean = false;
  public successMessage: string = 'Usuário criado com sucesso!';

  // ========= Selectd services ==========
  selectedServices: string[] = [];
  selectedServiceNames: string[] = [];

  public toggleService(serviceId: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      if (!this.selectedServices.includes(serviceId)) {
        this.selectedServices.push(serviceId);
      }
    } else {
      this.selectedServices = this.selectedServices.filter(
        id => id !== serviceId
      );
    }
  }

  public toggleServiceName(serviceName: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      if (!this.selectedServiceNames.includes(serviceName)) {
        this.selectedServiceNames.push(serviceName);
      }
    } else {
      this.selectedServiceNames = this.selectedServiceNames.filter(
        name => name !== serviceName
      );
    }
  }

  // =========== Form Initialization ===========
  private initRegisterForm() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', Validators.required],
      username: ['', Validators.required],
      phone: [null],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      counterNumber: [null],
      role: ['', Validators.required],
      serviceIds: [[]],
      active: [true]}
    );
  }

  // ========== Form Getters ===========
  get fullName(): string {
    const name = this.registerForm?.get('name')?.value ?? '';
    const surname = this.registerForm?.get('surname')?.value ?? '';

    return `${name} ${surname}`.trim();
  }

  get name(): string {
    return this.registerForm?.get('name')?.value ?? '-';
  }

  get surname(): string {
    return this.registerForm?.get('surname')?.value ?? '-';
  }

  get siglas(): string {
    const name = this.registerForm?.get('name')?.value ?? '';
    const surname = this.registerForm?.get('surname')?.value ?? '';

    return `${name[0]}${surname[0]}`;
  }

  get username(): string {
    return this.registerForm?.get('username')?.value ?? '-';
  }

  get email(): string {
    return this.registerForm?.get('email')?.value ?? '-';
  }

  get phone(): string {
    return this.registerForm?.get('phone')?.value ?? '-';
  }

  // =========== Step Navigation ===========

  nextStep() {
    const step1Fields = ['name', 'surname', 'email', 'username', 'password', 'confirmPassword'];
    const step2Fields = ['role'];
    const step3Fields = ['serviceIds'];
    const step3FieldsIfRoleIsAttendant = ['counterNumber', 'serviceIds'];

    const isStepValid1 = step1Fields.every(field =>
      this.registerForm.get(field)?.valid
    );

    const isStepValid2 = step2Fields.every(field =>
      this.registerForm.get(field)?.valid
    );

    if (this.registerForm.get('password')?.value === this.registerForm.get('confirmPassword')?.value
      && isStepValid1) {
      this.currentStep = 2;
    if (isStepValid2) {
      this.currentStep = 3;
    }
    } else {
      step1Fields.forEach(field => {
        this.registerForm.get(field)?.markAsTouched();
      });
    }
  }

  previousStep() {
    this.currentStep--;
  }

  // =========== Role Selection ===========
  public selectRole(role: string): void {
    this.selectedRole.set(role);

    this.registerForm.patchValue({
      role: role
    });

    this.selectedPermissions = [...this.permissionsByRole[role]];
  }

  public getRoleIcon(role: string): string {
    switch(role) {
      case 'MANAGER': return 'supervisor-bg';
      case 'RECEPTION': return 'attendant-bg';
      case 'ATTENDANT': return 'viewer-bg';
      default: return 'supervisor-bg';
    }
  }

  public getRoleDisplayName(role: string): string {
    switch (role) {
      case 'MANAGER': return 'Gerente';
      case 'ATTENDANT': return 'Atendente';
      case 'RECEPTION': return 'Recepcionista';
      default: return 'Gerente';
    }
  }

  public getRoleDescription(role: string): string {
    switch (role) {
      case 'MANAGER': return 'Gerencia atendentes, recepcionistas e relatórios';
      case 'ATTENDANT': return 'Realiza atendimentos';
      case 'RECEPTION': return 'Realiza agendamentos';
      default: return 'Gerencia atendentes, recepcionistas e relatórios';
    }
  }

  // =========== Permission Management ===========

  public permissionsByRole: Record<string, string[]> = {
    MANAGER: [
      'Painel de Atendimento',
      'Gerenciar departamentos',
      'Gerenciar serviços',
      'Gerenciar usuários',
      'Gerenciar agendamentos',
      'Visualizar relatórios',
      'Configurações'
    ],

    ATTENDANT: [
      'Painel de Atendimento',
      'Gerenciar agendamentos',
      'Visualizar relatórios',
      'Configurações'
    ],

    RECEPTION: [
      'Gerenciar agendamentos',
      'Configurações'
    ]
  };

  // =========== Modals ===========
  public openModalRegister(): void {
    this.modalRegister = true;
    this.serviceState.loadServicesForCreateUser();
  }

  public closeModalRegister(): void {
    this.modalRegister = false;
    this.registerForm.reset();
    this.currentStep = 1;
  }

  handleCurrentStep() {
  }

  public openModalUpdate(serviceManagementId: string): void {
    this.modalUpdate = true;
    document.body.style.overflow = 'hidden';
  }

  public closeModalUpdate(): void {
    this.modalUpdate = false;
    document.body.style.overflow = '';
  }

  public openModalDelete(serviceManagementId: string): void {
    this.modalDelete = true;
    document.body.style.overflow = 'hidden';
  }

  public closeModalDelete(): void {
    this.modalDelete = false;
    document.body.style.overflow = '';
  }

  public openModalView(serviceManagementId: string): void {
    this.modalView = true;
    document.body.style.overflow = 'hidden';
  }

  public closeModalView(): void {
    this.modalView = false;
    document.body.style.overflow = '';
  }

  // =========== DropDown ===========
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInsideDropdown = target.closest('.button-menu-table') || target.closest('.drop-down-delete');
    if (!clickedInsideDropdown) {
      this.closeDropDown();
    }
  }

  openDropDown(index: number): void {
    this.dropDown = this.dropDown === index ? null : index;
  }

  closeDropDown(): void {
    this.dropDown = null;
  }

  // =========== Helper Methods ===========
  getRole(role: string): string {
    switch (role) {
      case 'ADMIN': return 'Administrador';
      case 'MANAGER': return 'Gerente';
      case 'RECEPTION': return 'Recepcionista';
      case 'ATTENDANT': return 'Atendente';
      default: return 'Desconhecido';
    }
  }

  onSearch(event: any): void {
    this.userState.setSearch(event.target.value);
  }

  nextPage(): void {
    this.userState.nextPage();
  }

  previousPage(): void {
    this.userState.previousPage();
  }

  goToPage(page: number): void {
    this.userState.goToPage(page);
  }

  getStartIndex(): number {
    return this.page() * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    return Math.min((this.page() + 1) * this.itemsPerPage, this.totalElements());
  }

  getPagesArray(): number[] {
    const total = this.totalPages();
    const current = this.page();
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

    return Array.from({ length: end - start }, (_, i) => start + i);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  toggleReviewPassword(): void {
    this.showReviewPassword = !this.showReviewPassword;
  }

  // =========== Lifecycle ===========
  @HostListener('window:keydown.escape', ['$event'])
  onEscapePressed(event: Event): void {
    if (this.modalRegister) this.closeModalRegister();
    if (this.modalUpdate) this.closeModalUpdate();
    if (this.modalDelete) this.closeModalDelete();
    if (this.modalView) this.closeModalView();
  }

  // Register User
  registerUser() {
    console.log(this.registerForm.value);
    this.userState.registerUser(this.registerForm.value);
  }
}
