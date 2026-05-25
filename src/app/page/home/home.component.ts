import { ServiceManagementService } from './../../services/states/serviceManagement/service-management.service';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalStatesService } from '../../services/states/global-states.service';
import { TableServicesComponent } from "../../components/table-services/table-services.component";
import { TableDepartmentsComponent } from "../../components/table-departments/table-departments.component";
import { TableUsersComponent } from "../../components/table-users/table-users.component";
import { PainelAtendimentoComponent } from "../../components/painel-atendimento/painel-atendimento.component";
import { SchedulingComponent } from "../../components/scheduling/scheduling.component";
import { GraphicComponent } from "../../components/graphic/graphic.component";
import { ConfigComponent } from "../../components/config/config.component";
import { DepartmentStateService } from '../../services/states/department/department-state.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, TableServicesComponent, TableDepartmentsComponent, TableUsersComponent, PainelAtendimentoComponent, SchedulingComponent, GraphicComponent, ConfigComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  // Injections
  public globalState = inject(GlobalStatesService);
  public departmentState = inject(DepartmentStateService);
  public ServiceManagementState = inject(ServiceManagementService);

  public openAside = false;

  // States
  public activeSection = this.globalState.activeSection;
  public totalDepartments = this.departmentState.totalElements
  public totalServices = this.ServiceManagementState.totalElements

  ngOnInit(){
    this.departmentState.loadDepartments();
    this.ServiceManagementState.loadServices();
  }

  // Methods
  setActive(section: string) {
    this.activeSection.set(section);

    if (window.innerWidth <= 768) {
      this.openAside = false;
    }
  }
}
