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
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ChartComponent } from "ng-apexcharts";
import { CustomerStateService } from '../../services/states/customer/customer-state.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
};

export type DonutChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  responsive: ApexResponsive[];
};

@Component({
  selector: 'app-home',
  imports: [CommonModule, ChartComponent, TableServicesComponent, TableDepartmentsComponent, TableUsersComponent, SchedulingComponent, GraphicComponent, ConfigComponent, ServiceCounterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  // Gráficos usados no HTML
  public chartOptions!: ChartOptions;
  public chartAttendanceWeekOptions!: ChartOptions;
  public chartSchedulingPriorityOptions!: DonutChartOptions;

  // Injections
  public globalState = inject(GlobalStatesService);
  public departmentState = inject(DepartmentStateService);
  public userState = inject(UserStateService);
  public scheduleState = inject(ScheduleStateService);
  public attendentState = inject(AttendentStateService);
  public serviceState = inject(ServiceManagementService);
  public customerState = inject(CustomerStateService);
  public schedulingState = inject(ScheduleStateService);
  public router = inject(Router);
  public snackBar = inject(MatSnackBar);

  // Estatísticas usadas no HTML
  public avarageWaitingTime = this.attendentState.averageWaitingTime;
  public averageServiceTime = this.attendentState.averageServiceTime;
  public averageAttendanceByUsers = this.attendentState.averageAttendanceByUser;
  public attendancesCreatedByMonth = this.attendentState.attendancesCreatedByMonth;
  public attendancesByWeek = this.attendentState.attendancesByWeek;
  public attendancesByService = this.attendentState.attendancesByService;
  public attendancesByHour = this.attendentState.attendancesByHour;
  public attendancesByDepartment = this.attendentState.attendancesByDepartment;
  public attendancesByCustomer = this.attendentState.attendancesByCustomer;

  // Estatísticas de departamento usadas no HTML
  public departmentsCreatedByMonth = this.departmentState.departmentsCreatedByMonth;

  // Estatísticas de serviço usadas no HTML
  public servicesCreatedByMonth = this.serviceState.servicesCreatedByMonth;
  public usersByService = this.serviceState.usersByService;
  public schedulesByService = this.serviceState.schedulesByService;

  // Estatísticas de usuário usadas no HTML
  public usersCreatedByMonth = this.userState.usersCreatedByMonthStatistics;

  // Estatísticas de agendamento usadas no HTML
  public totalScheduling = this.schedulingState.countTotalScheduleStatistics;
  public totalSchedulingByMonth = this.schedulingState.schedulesCreatedByMonth;
  public totalSchedulingByWeek = this.schedulingState.schedulesCreatedByWeek;
  public scheduleCreatedByDay = this.schedulingState.scheduleCreatedByDay;
  public schedulesByHour = this.schedulingState.schedulesByHour;
  public schedulesByPriority = this.schedulingState.schedulesByPriority;

  // Estatísticas de cliente usadas no HTML
  public totalCustomersByMonth = this.customerState.totalCustomersByMonth;

  // Estados usados no HTML
  public userLogged = this.userState.userLogged;
  public activeSection = this.globalState.activeSection;
  public totalDepartments = this.departmentState.countTotalDepartment;
  public totalServices = this.serviceState.countTotalServicesStatistics;
  public totalUsers = this.userState.countTotalUsersStatistics;
  public scheduleStatistics = this.scheduleState.scheduleCreatedByDay;
  public countTotalAttendances = this.attendentState.countTotalAttendances;

  // Variáveis usadas no HTML
  public openAside = false;
  public dialog: boolean = false;

  ngOnInit() {
    this.userState.getUserByToken();
    this.departmentState.loadStatistics();
    this.serviceState.loadStatistics();
    this.userState.loadStatistics();
  }

  constructor() {

    effect(() => {
      const data = this.attendancesByWeek();
      if (!data || data.length === 0) return;
      this.chartAttendanceWeekOptions = {
        series: [{
          name: 'Atendimentos',
          data: data.map(x => x.totalAttendances)
        }],
        chart: {
          type: 'bar',
          height: 350,
          toolbar: { show: false }
        },
        xaxis: {
          categories: data.map(x => x.dayName)
        },
        dataLabels: {
          enabled: true
        }
      };
    });

    effect(() => {
      const data = this.departmentsCreatedByMonth();
      if (!data || data.length === 0) return;
      this.chartOptions = {
        series: [{
          name: 'Departamentos',
          data: data.map(x => x.totalDepartments)
        }],
        chart: {
          type: 'bar',
          height: 350,
          toolbar: { show: false }
        },
        xaxis: {
          categories: data.map(x => x.monthName)
        },
        dataLabels: {
          enabled: true
        }
      };
    });

    effect(() => {
      const data = this.schedulesByPriority();
      if (!data || data.length === 0) return;
      this.chartSchedulingPriorityOptions = {
        series: data.map(x => x.totalSchedules),
        chart: {
          type: 'donut',
          height: 300
        },
        labels: data.map(x => x.priority),
        colors: ['#3b82f6', 'tomato', '#ef4444', '#f59e0b'],
        legend: {
          position: 'bottom'
        },
        dataLabels: {
          enabled: true
        },
        responsive: [{
          breakpoint: 768,
          options: {
            chart: { width: 300 },
            legend: { position: 'bottom' }
          }
        }]
      };
    });
  }

  // Métodos usados no HTML
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
        this.serviceState.modalRegister.set(true);
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
        this.schedulingState.table.set('Scheduling');
      });
    }

    if (section === 'scheduling-customer') {
      this.activeSection.set('scheduling');
      timer(500).subscribe(() => {
        this.scheduleState.modalCustomerRegister.set(true);
        this.schedulingState.table.set('Customers');
      });
    }

    if (section === 'attendant') {
      timer(200).subscribe(() => {
        this.activeSection.set('attendance');
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

  redirectToQueueDisplay() {
    window.open('/queue-display', '_blank');
  }
}
