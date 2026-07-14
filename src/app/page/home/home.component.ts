import { ServiceManagementService } from './../../services/states/serviceManagement/service-management.service';
import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalStatesService } from '../../services/states/global-states.service';
import { TableServicesComponent } from "../../components/table-services/table-services.component";
import { TableDepartmentsComponent } from "../../components/table-departments/table-departments.component";
import { TableUsersComponent } from "../../components/table-users/table-users.component";
import { SchedulingComponent } from "../../components/scheduling/scheduling.component";
import { GraphicComponent } from "../../components/graphic/graphic.component";
import { ConfigComponent } from "../../components/config/config.component";
import { DepartmentStateService } from '../../services/states/department/department-state.service';
import { UserStateService } from '../../services/states/user/user-state.service';
import { ServiceCounterComponent } from "../../components/service-counter/service-counter.component";
import { ScheduleStateService } from '../../services/states/scheduling/scheduling-state.service';
import { AttendentStateService } from '../../services/states/attendent/attendent-state.service';
import { timer } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  imports: [CommonModule, TableServicesComponent, TableDepartmentsComponent, TableUsersComponent, SchedulingComponent, GraphicComponent, ConfigComponent, ServiceCounterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  // Injections
  public globalState = inject(GlobalStatesService);
  public departmentState = inject(DepartmentStateService);
  public ServiceManagementState = inject(ServiceManagementService);
  public userState = inject(UserStateService);
  public scheduleState = inject(ScheduleStateService);
  public attendentState = inject(AttendentStateService);
  public router = inject(Router);
  public snackBar = inject(MatSnackBar);

  // States
  public userLogged = this.userState.userLogged;
  public activeSection = this.globalState.activeSection;
  public activeFunction = this.globalState.activeFunction;
  public totalDepartments = this.departmentState.countTotalDepartment;
  public totalServices = this.ServiceManagementState.countTotalServicesStatistics;
  public totalUsers = this.userState.countTotalUsersStatistics;
  public scheduleStatistics = this.scheduleState.scheduleCreatedByDay;
  public countTotalAttendances = this.attendentState.countTotalAttendances;

  // Variables
  public openAside = false;
  public userId = localStorage.getItem('accessToken');
  public dialog: boolean = false;

  ngOnInit(){
    this.userState.getUserByToken();
    this.departmentState.loadStatistics();
    this.ServiceManagementState.loadStatistics();
    this.userState.loadStatistics();
  }

  // Methods
  setActive(section: string) {
    localStorage.setItem('activeSection', section);
    this.activeSection.set(section);

    if (window.innerWidth <= 768) {
      this.openAside = false;
    }
  }

  functionActive(section: string) {
    this.activeSection.set(section);

    if (section === 'department') {

      timer(500).subscribe(() => {
        this.departmentState.modalRegister.set(true);
      });
    }

    if (section === 'service') {

      timer(500).subscribe(() => {
        this.ServiceManagementState.modalRegister.set(true);
      });
    }

    if (section === 'user') {

      timer(500).subscribe(() => {
        this.userState.modalRegister.set(true);
      });
    }

    if (section === 'scheduling') {
      timer(500).subscribe(() => {
        this.scheduleState.modalSchedulingRegister.set(true);
      });
    }
  }

  public getRoleDisplayName(role: string): string {
    switch (role) {
      case 'MANAGER': return 'Gerente';
      case 'ATTENDANT': return 'Atendente';
      case 'RECEPTION': return 'Recepcionista';
      default: return 'Administrador';
    }
  }

  openOrCloseDialog() {
    this.dialog = !this.dialog;
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.snackBar.open('Logout realizado com sucesso', 'Fechar',
      { duration: 3000, panelClass: ['snackbar-success'] },
    );
    this.router.navigate(['/login']);
    this.activeSection.set('inicio');
    localStorage.setItem('activeSection', 'inicio');
  }
}
