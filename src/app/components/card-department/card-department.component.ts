import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalStatesService } from '../../services/states/global-states.service';
import { DepartmentStateService } from '../../services/states/department/department-state.service';
import { RegisterDepartmentComponent } from "../register-department/register-department.component";
import { TableDepartmentsComponent } from "../table-departments/table-departments.component";
import { RegisterServiceComponent } from "../register-service/register-service.component";
import { TableServicesComponent } from "../table-services/table-services.component";

@Component({
  selector: 'app-card-department',
  imports: [CommonModule, RegisterDepartmentComponent, TableDepartmentsComponent, RegisterServiceComponent, TableServicesComponent],
  templateUrl: './card-department.component.html',
  styleUrl: './card-department.component.css'
})
export class CardDepartmentComponent {

  // ==== Injection ====
  private globalState = inject(GlobalStatesService);
  private departmentState = inject(DepartmentStateService);
  // ======================

  // ==== States ====
  public currentSection = this.globalState.currentSection;
  public openCardDepartment = this.globalState.openCardDepartment;
  public totalElements = this.departmentState.totalElements;

  public openRegisterDepartment = this.globalState.openRegisterDepartment;
  public openTableDeparments = this.globalState.openTableDeparments;

  public openRegisterService = this.globalState.openRegisterService;
  public openTableServices = this.globalState.openTableServices;
  // ======================


  // ==== UI ====
  get modalTitle(): string {
    if (this.currentSection() === 'departamento') return 'ICN Registro de Departamentos';
    if (this.currentSection() === 'servico') return 'ICN Cadastro de Serviços';
    if (this.currentSection() === 'config') return 'ICN Configurações de Departamentos';
    return 'ICN Lista de Departamentos';
  }

  switchSection(section: 'departamento' | 'servico' | 'config') {
    this.currentSection.set(section);
  }
  // =================

  closeCardDepartment() {
    this.openCardDepartment.set(false);
  }

  showButtonsSectionDepartment() {
    if (this.currentSection() === 'departamento'
        && !this.openRegisterDepartment()
        && !this.openTableDeparments()) return true;
    return false;
  }

  showButtonsSectionService() {
    if (this.currentSection() === 'servico'
        && !this.openRegisterService()
        && !this.openTableServices()) return true;
    return false;
  }

}
