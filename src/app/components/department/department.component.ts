import { AppComponent } from './../../app.component';
import { CreateServiceManagementDto } from '../../dtos/services/CreateServiceManagementDto';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GlobalStatesService } from '../../services/states/global-states.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DepartmentStateService } from '../../services/states/department/department-state.service';
import { HttpService } from '../../services/backend/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResponseGetDepartmentDto } from '../../dtos/department/ResponseGetDepartment';

@Component({
  selector: 'app-department',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './department.component.html',
  styleUrl: './department.component.css'
})
export class DepartmentComponent {

  // ===================== STATE =====================
  private state = inject(DepartmentStateService);

  department = signal<ResponseGetDepartmentDto | null>(null);
  departments = this.state.filteredDepartments;
  page = this.state.page;
  totalPages = this.state.totalPages;
  totalElements = this.state.totalElements;

  // ===================== INJECTS =====================
  public globalState = inject(GlobalStatesService);
  public http = inject(HttpService);
  public snackBar = inject(MatSnackBar);
  public closeModalDepartment = this.globalState.openCardDepartment;
  public search = this.state.search;

  fb = inject(FormBuilder);

  // ===================== MODAL =====================
  isModalOpen = this.closeModalDepartment();
  openModalDepartmentDetail = false;
  openModalDeleteDepartment = false;
  openModalUpdateDepartment = false;

  openRegisterDepartment = false;
  openTableDeparments = false;

  currentSection: 'departamento' | 'servico' | 'config' = 'departamento';
  showingDepartmentDetail = false;
  selectedDepartment = this.state.selectedDepartment;

  // ===================== DATA EXTRA =====================
  services: any[] = [];

  departmentForm!: FormGroup;
  serviceForm!: FormGroup;
  updateDepartmentForm!: FormGroup;

  searchQuery = '';
  toastMessage = '';

  itemsPerPage = 4;

  // =====

  showButtonsForSectionDepartments() {

    if (this.currentSection === 'departamento'
          && this.openRegisterDepartment == false
          && this.openTableDeparments == false) return true;

    return false;
  }

  // ===================== INIT =====================
  ngOnInit() {
    this.initializeDepartmentForm();
    this.initializeServiceForm();
    this.state.loadDepartments();
  }

  // ===================== SEARCH =====================
  onSearch(event: any) {
    this.state.setSearch(event.target.value);
  }

  // ===================== PAGINATION =====================
  nextPage() {
    this.state.nextPage();
  }

  previousPage() {
    this.state.previousPage();
  }

  goToPage(page: number) {
    this.state.goToPage(page);
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

  // ===================== FORMS =====================
  initializeDepartmentForm() {
    this.departmentForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  initializeServiceForm() {
    this.serviceForm = this.fb.group({
      departmentName: ['', Validators.required],
      name: ['', Validators.required],
      code: [''],
      description: [''],
    });
  }

  iinitializeUpdateDepartmentForm(department: ResponseGetDepartmentDto) {
    this.updateDepartmentForm = this.fb.group({
      departmentId: [department.departmentId],
      name: [department.name],
      description: [department.description]
    });
  }

  // ===================== MODAL =====================
  openModal(): void {
    this.isModalOpen = true;
    this.switchSection('departamento');
  }

  closeModal() {
    this.closeModalDepartment.set(false);
    this.openModalDepartmentDetail = false;
    this.search.set('');
  }

  switchSection(section: 'departamento' | 'servico' | 'config') {
    this.search.set('')

    this.currentSection = section;
    this.showingDepartmentDetail = false;
  }

  // ===================== UI =====================
  get modalTitle(): string {
    if (this.currentSection === 'departamento') return 'ICN Registro de Departamentos';
    if (this.currentSection === 'servico') return 'ICN Cadastro de Serviços';
    if (this.currentSection === 'config') return 'ICN Configurações de Departamentos';
    if (this.showingDepartmentDetail) return 'ICN Detalhes do Departamento';
    return 'ICN Lista de Departamentos';
  }

  // ===================== SUBMIT =====================
  onSubmitDepartment(): void {
    if (this.departmentForm.invalid) return;

    this.http.createDepartment(this.departmentForm.value).subscribe({
      next: () => {

        this.state.page.set(0);
        this.state.refresh();

        this.departmentForm.reset();

        this.snackBar.open('Departamento cadastrado com sucesso!', 'Fechar', {
          duration: 3000
        });
      },
      error: () => {
        this.snackBar.open('Erro ao cadastrar departamento.', 'Fechar', {
          duration: 3000,
        });
      }
    });
  }

  onSubmitService(): void {
    if (this.serviceForm.invalid) return;

    this.http.createServiceManagement(this.serviceForm.value).subscribe({
      next: () => {

        // opcional: recarregar departamentos (se serviços aparecem lá)
        this.state.loadDepartments();

        this.serviceForm.reset();

        this.snackBar.open('Serviço cadastrado com sucesso!', 'Fechar', {
          duration: 3000
        });
      },
      error: () => {
        this.snackBar.open('Erro ao cadastrar serviço.', 'Fechar', {
          duration: 3000,
        });
      }
    });
  }

  onSubmitUpdateDepartment(): void {
    if (this.updateDepartmentForm.invalid) return;

    this.http.updateDepartment(this.updateDepartmentForm.value).subscribe({
      next: (response) => {

        console.log(response);

        this.state.page.set(0);
        this.state.refresh();

        this.updateDepartmentForm.reset();

        this.snackBar.open('Departamento atualizado com sucesso!', 'Fechar', {
          duration: 3000
        });
      },
      error: () => {
        this.snackBar.open('Erro ao atualizar departamento.', 'Fechar', {
          duration: 3000,
        });
      }
    });
  }

  // ===================== DETAILS =====================
  viewDepartment(id: string): void {
    this.showingDepartmentDetail = true;
  }

  backToTable(): void {
    this.openModalDepartmentDetail = !this.openModalDepartmentDetail;
  }

  getDepartmentServices(deptId: number): any[] {
    return this.services.filter(s => s.departmentId === deptId);
  }

  showDepartmentDetail(departmentId: string) {
    this.openModalDepartmentDetail = !this.openModalDepartmentDetail;

    this.http.getDepartmentById(departmentId).subscribe({
      next: (response) => {
        this.selectedDepartment.set(response);
      }
    });
  }

  showModalDeleteDepartment(departmentId: string) {

    if (this.selectedDepartment() == null) {
      this.http.getDepartmentById(departmentId).subscribe({
        next: (response) => {
          this.selectedDepartment.set(response);
          this.department.set(response);
        }
      });
    }

    this.openModalDeleteDepartment = !this.openModalDeleteDepartment;
  }

  showModalUpdateDepartment(departmentId: string) {
    this.http.getDepartmentById(departmentId).subscribe({
      next: (response) => {

        this.selectedDepartment.set(response);

        console.log(response);

        this.updateDepartmentForm = this.fb.group({
          departmentId: [response.departmentId],
          name: [response.name],
          description: [response.description]
        });

        this.openModalUpdateDepartment = true;
      }
    });
  }

  closeModalDeleteDepartment() {
    this.openModalDeleteDepartment = !this.openModalDeleteDepartment;
  }

  closeModalUpdateDepartment() {
    this.openModalUpdateDepartment = !this.openModalUpdateDepartment;
  }

  deleteDepartment() {
    const departmentId = this.department()?.departmentId;
    if (!departmentId) return;

    this.http.deleteDepartment(departmentId).subscribe({
      next: () => {
        this.state.loadDepartments();
        this.closeModalDeleteDepartment();

        this.selectedDepartment.set(null);
        this.department.set(null);

        this.snackBar.open('Departamento excluido com sucesso!', 'Fechar', {
          duration: 3000
        });
      },
      error: () => {
        this.snackBar.open('Erro ao excluir departamento.', 'Fechar', {
          duration: 3000,
        });
      }
    });
  }
}
