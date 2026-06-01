import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStateService } from '../../services/states/user/user-state.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RequestUserDto } from '../../dtos/users/RequestUserDto';
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
    this.initForm();
    this.loadServices();
  }

  departments = [
    { selected: false, name: 'Atendimento' },
    { selected: false, name: 'Suporte' },
    { selected: false, name: 'Financeiro' },
    { selected: false, name: 'Administrativo' }
  ]

  // Injections
  private userState = inject(UserStateService);
  private fb = inject(FormBuilder);

  // States
  public users = this.userState.users;
  public userInfo = this.userState.userInfo;
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
  public selectedRole: string = 'ADMIN';
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
  public services: any[] = [];

  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;
  public showReviewPassword: boolean = false;

  // Variables
  public dropDown: number | null = null;
  public itemsPerPage = 4;

  // Success Modal
  public showSuccessModal: boolean = false;
  public successMessage: string = 'Usuário criado com sucesso!';

  // =========== Form Initialization ===========
  private initForm(): void {
    this.registerForm = this.fb.group({
      // Step 1 - Informações pessoais
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      phone: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      counterNumber: [0, [Validators.required, Validators.min(1)]],
      // Step 2 - Permissões
      role: ['ADMIN'],
      // Step 3 - Serviços
      serviceIds: [[]],
      // Status
      active: [true]
    }, { validators: this.passwordMatchValidator });
  }

  // Carregar serviços do backend
  private loadServices(): void {
    // TODO: Substituir pela chamada real do backend
    // this.userState.loadAllServices().subscribe(services => {
    //   this.services = services.map(s => ({
    //     id: s.serviceManagementId,
    //     name: s.name,
    //     department: s.department?.name || 'Sem departamento',
    //     selected: false
    //   }));
    // });

    // Dados mockados para exemplo
    this.services = [
      { id: '1', name: 'Atendimento ao Cliente', department: 'Atendimento', selected: false },
      { id: '2', name: 'Suporte Técnico N1', department: 'Suporte', selected: false },
      { id: '3', name: 'Suporte Técnico N2', department: 'Suporte', selected: false },
      { id: '4', name: 'Consultoria Financeira', department: 'Financeiro', selected: false },
      { id: '5', name: 'Auditoria', department: 'Financeiro', selected: false },
      { id: '6', name: 'Protocolo Digital', department: 'Administrativo', selected: false },
      { id: '7', name: 'Gestão de Documentos', department: 'Administrativo', selected: false }
    ];
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  private getSelectedServicesIds(): string[] {
    return this.services.filter(s => s.selected).map(s => s.id);
  }

  // =========== Step Navigation ===========
  public nextStep(): void {
    if (this.currentStep === 1) {
      const step1Fields = ['name', 'surname', 'email', 'phone', 'username', 'password', 'confirmPassword'];
      step1Fields.forEach(field => {
        this.registerForm.get(field)?.markAsTouched();
      });
      this.registerForm.updateValueAndValidity();

      if (this.isStep1Valid()) {
        this.currentStep = 2;
      }
      return;
    }

    if (this.currentStep === 2 && this.isStep2Valid()) {
      this.currentStep = 3;
      return;
    }

    if (this.currentStep === 3 && this.isStep3Valid()) {
      this.currentStep = 4;
      return;
    }

    if (this.currentStep === 4) {
      this.submitForm();
    }
  }

  public prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  public goToStep(step: number): void {
    if (step < this.currentStep) {
      this.currentStep = step;
    } else if (step === this.currentStep + 1 && this.isCurrentStepValid()) {
      this.currentStep = step;
    }
  }

  private isCurrentStepValid(): boolean {
    if (this.currentStep === 1) return this.isStep1Valid();
    if (this.currentStep === 2) return this.isStep2Valid();
    if (this.currentStep === 3) return this.isStep3Valid();
    return true;
  }

  private isStep1Valid(): boolean {
    const nameValid = this.registerForm.get('name')?.valid ?? false;
    const surnameValid = this.registerForm.get('surname')?.valid ?? false;
    const phoneValid = this.registerForm.get('phone')?.valid ?? false;
    const emailValid = this.registerForm.get('email')?.valid ?? false;
    const usernameValid = this.registerForm.get('username')?.valid ?? false;
    const passwordValid = this.registerForm.get('password')?.valid ?? false;
    const confirmPasswordValid = this.registerForm.get('confirmPassword')?.valid ?? false;
    const counterNumberValid = this.registerForm.get('counterNumber')?.valid ?? false;
    const noMismatch = !this.registerForm.hasError('passwordMismatch');

    return nameValid && surnameValid && phoneValid && emailValid && usernameValid &&
           passwordValid && confirmPasswordValid && counterNumberValid && noMismatch;
  }



  private isStep2Valid(): boolean {
    return !!this.selectedRole;
  }

  private isStep3Valid(): boolean {
    return this.services.some(s => s.selected);
  }

  // =========== Role Selection ===========
  public selectRole(role: string): void {
    this.selectedRole = role;
    this.registerForm.patchValue({ role });
  }

  public getRoleIcon(role: string): string {
    switch(role) {
      case 'ADMIN': return 'admin-bg';
      case 'MANAGER': return 'supervisor-bg';
      case 'RECEPTION': return 'attendant-bg';
      case 'ATTENDANT': return 'viewer-bg';
      default: return 'admin-bg';
    }
  }

  public getRoleDisplayName(role: string): string {
    switch (role) {
      case 'ADMIN': return 'Administrador';
      case 'MANAGER': return 'Supervisor';
      case 'RECEPTION': return 'Atendente';
      case 'ATTENDANT': return 'Visualizador';
      default: return 'Administrador';
    }
  }

  public getRoleDescription(role: string): string {
    switch (role) {
      case 'ADMIN': return 'Acesso total ao sistema';
      case 'MANAGER': return 'Gerencia atendentes e relatórios';
      case 'RECEPTION': return 'Realiza atendimentos e agendamentos';
      case 'ATTENDANT': return 'Acesso somente leitura';
      default: return 'Acesso total ao sistema';
    }
  }

  // =========== Permission Management ===========
  public togglePermission(permission: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      if (!this.selectedPermissions.includes(permission)) {
        this.selectedPermissions.push(permission);
      }
    } else {
      this.selectedPermissions = this.selectedPermissions.filter(p => p !== permission);
    }
  }

  public selectAllPermissions(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedPermissions = [...this.allPermissions];
    } else {
      this.selectedPermissions = [];
    }
  }

  public isPermissionSelected(permission: string): boolean {
    return this.selectedPermissions.includes(permission);
  }

  public areAllPermissionsSelected(): boolean {
    return this.allPermissions.every(p => this.selectedPermissions.includes(p));
  }

  // =========== Service Management ===========
  public toggleService(service: any): void {
    service.selected = !service.selected;
    this.registerForm.patchValue({
      serviceIds: this.getSelectedServicesIds()
    });
  }

  public getServiceDepartment(service: any): string {
    return service.department;
  }

  public isFirstSelected(service: any): boolean {
    const selectedServices = this.services.filter(s => s.selected);
    return service.selected && selectedServices.length > 0 && selectedServices[0].id === service.id;
  }

  public getUniqueDepartments(): string[] {
    const departments = this.services.map(s => s.department);
    return [...new Set(departments)];
  }

  public getServicesByDepartment(department: string): any[] {
    return this.services.filter(s => s.department === department);
  }

  public selectAllServicesInDepartment(department: string): void {
    const servicesInDept = this.getServicesByDepartment(department);
    const allSelected = servicesInDept.every(s => s.selected);

    servicesInDept.forEach(service => {
      service.selected = !allSelected;
    });

    this.registerForm.patchValue({
      serviceIds: this.getSelectedServicesIds()
    });
  }

  // =========== Review Data ===========
  public getReviewData(): any {
    const form = this.registerForm.value;
    const selectedServices = this.services.filter(s => s.selected);
    const primaryService = selectedServices[0];

    return {
      name: form.name || 'Não informado',
      surname: form.surname || 'Não informado',
      fullName: `${form.name || ''} ${form.surname || ''}`.trim(),
      email: form.email || 'Não informado',
      username: form.username || 'Não informado',
      phone: form.phone || '',
      password: form.password || '',
      role: this.selectedRole,
      roleDisplay: this.getRoleDisplayName(this.selectedRole),
      permissions: this.selectedPermissions,
      services: selectedServices,
      primaryService: primaryService,
      counterNumber: form.counterNumber || 0,
      active: form.active
    };
  }

  public getUserInitials(): string {
    const name = this.registerForm.get('name')?.value || '';
    const surname = this.registerForm.get('surname')?.value || '';
    if (!name && !surname) return 'U';
    if (name && !surname) return name.substring(0, 2).toUpperCase();
    return (name.charAt(0) + surname.charAt(0)).toUpperCase();
  }

  // =========== Form Submission ===========
  public submitForm(): void {
    if (this.registerForm.valid && this.isStep3Valid()) {
      const formValue = this.registerForm.value;

      const createUserDto: RequestUserDto = {
        username: formValue.username,
        name: formValue.name,
        surname: formValue.surname,
        phone: formValue.phone,
        email: formValue.email,
        password: formValue.password,
        role: this.selectedRole,
        counterNumber: formValue.counterNumber || 1,
        serviceIds: this.getSelectedServicesIds()
      };

      console.log('Enviando dados para o backend:', createUserDto);

      // Chamar o serviço de criação
      this.userState.registerUser(createUserDto);

      // Aguardar um pouco para ver o resultado
      setTimeout(() => {
        if (this.userState.registerStatus() === 'success') {
          this.showSuccess('Usuário criado com sucesso!');
        } else if (this.userState.registerStatus() === 'error') {
          this.showSuccess(this.userState.registerMessage() || 'Erro ao criar usuário!', true);
        }
      }, 500);
    } else {
      console.log('Formulário inválido:', this.registerForm.errors);
      this.showSuccess('Preencha todos os campos obrigatórios!', true);
    }
  }

  public showSuccess(message: string = 'Usuário criado com sucesso!', isError: boolean = false): void {
    this.successMessage = message;
    this.showSuccessModal = true;
    this.closeModalRegister();
    document.body.style.overflow = 'hidden';
  }

  public closeSuccess(): void {
    this.showSuccessModal = false;
    document.body.style.overflow = '';
    this.resetForm();
  }

  private resetForm(): void {
    this.currentStep = 1;
    this.registerForm.reset({
      name: '',
      surname: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      role: 'ADMIN',
      counterNumber: 1,
      active: true,
      serviceIds: []
    });
    this.selectedRole = 'ADMIN';
    this.selectedPermissions = [
      'Gerenciar usuários',
      'Gerenciar departamentos',
      'Gerenciar serviços',
      'Agendamentos',
      'Atendimentos',
      'Relatórios',
      'Configurações'
    ];
    this.services.forEach(s => s.selected = false);
    this.showPassword = false;
    this.showConfirmPassword = false;
    this.showReviewPassword = false;

    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsPristine();
      this.registerForm.get(key)?.markAsUntouched();
    });
  }

  // =========== Modals ===========
  public openModalRegister(): void {
    this.modalRegister = true;
    this.currentStep = 1;
    document.body.style.overflow = 'hidden';
    this.resetForm();
  }

  public closeModalRegister(): void {
    this.modalRegister = false;
    document.body.style.overflow = '';
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
    if (this.showSuccessModal) this.closeSuccess();
  }
}
