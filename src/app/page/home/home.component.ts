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
import { ApexAxisChartSeries, ApexChart,ApexXAxis, ApexDataLabels, ApexPlotOptions, ChartComponent} from "ng-apexcharts";
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

  public chartOptions!: ChartOptions;
  public chartServiceOptions!: ChartOptions;
  public chartUserOptions!: ChartOptions;
  public chartCustomerOptions!: ChartOptions;
  public chartSchedulingMonthOptions!: ChartOptions;
  public chartSchedulingWeekOptions!: ChartOptions;
  public chartSchedulingHourOptions!: ChartOptions;
  public chartSchedulingPriorityOptions!: DonutChartOptions;
  public chartAttendanceMonthOptions!: ChartOptions;
  public chartAttendanceWeekOptions!: ChartOptions;
  public chartAttendanceHourOptions!: ChartOptions;

  // Injections
  public globalState = inject(GlobalStatesService);
  public departmentState = inject(DepartmentStateService);
  public ServiceManagementState = inject(ServiceManagementService);
  public userState = inject(UserStateService);
  public scheduleState = inject(ScheduleStateService);
  public attendentState = inject(AttendentStateService);
  public router = inject(Router);
  public snackBar = inject(MatSnackBar);

  // Statistics injections
  public serviceState = inject(ServiceManagementService);
  public customerState = inject(CustomerStateService);
  public schedulingState = inject(ScheduleStateService);

  // Attendent statistics
  public avarageWaitingTime = this.attendentState.averageWaitingTime;
  public averageServiceTime = this.attendentState.averageServiceTime;
  public averageAttendanceByUsers = this.attendentState.averageAttendanceByUser;
  public attendancesCreatedByMonth = this.attendentState.attendancesCreatedByMonth;
  public attendancesByWeek = this.attendentState.attendancesByWeek;
  public attendancesByService = this.attendentState.attendancesByService;
  public attendancesByHour = this.attendentState.attendancesByHour;
  public attendancesByDepartment = this.attendentState.attendancesByDepartment;
  public attendancesByCustomer = this.attendentState.attendancesByCustomer;

  // Department statistics
  public percentageByDepartment = this.departmentState.getPercentagesByDepartment;
  public countServicesByDepartment = this.departmentState.countServicesByDepartment;
  public departmentsCreatedByMonth = this.departmentState.departmentsCreatedByMonth;

  // Service statistics
  public percentageServices = this.serviceState.servicePercentagesStatistics;
  public servicesCreatedByMonth = this.serviceState.servicesCreatedByMonth;
  public servicesByDepartment = this.serviceState.servicesByDepartment;
  public usersByService = this.serviceState.usersByService;
  public schedulesByService = this.serviceState.schedulesByService;
  public ticketsByService = this.serviceState.ticketsByService;

  // User statistics
  public percentageUsers = this.userState.userPercentagesStatistics;
  public countServicesByUsers = this.userState.countServicesByUsers;
  public countRoleByUsers = this.userState.countRoleByUsers;
  public usersCreatedByMonth = this.userState.usersCreatedByMonthStatistics;

  // Scheduling statistics
  public totalScheduling = this.schedulingState.countTotalScheduleStatistics;
  public percentageScheduling = this.schedulingState.schedulePercentagesStatistics;
  public totalSchedulingByMonth = this.schedulingState.schedulesCreatedByMonth;
  public totalSchedulingByWeek = this.schedulingState.schedulesCreatedByWeek;
  public scheduleCreatedByDay = this.schedulingState.scheduleCreatedByDay;
  public schedulesByHour = this.schedulingState.schedulesByHour;
  public schedulesByDepartment = this.schedulingState.schedulesByDepartment;
  public schedulesByServices = this.schedulingState.schedulesByService;
  public schedulesByPriority = this.schedulingState.schedulesByPriority;

  // Customer statistics
  public totalCustomers = this.customerState.totalCustomers;
  public totalCustomersByMonth = this.customerState.totalCustomersByMonth;

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

  constructor() {

    effect(() => {

      const data = this.attendancesCreatedByMonth();

      if (!data || data.length === 0) return;

      this.chartAttendanceMonthOptions = {
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
          categories: data.map(x => x.monthName)
        },
        dataLabels: {
          enabled: true
        }
      };

    });

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

      const data = this.attendancesByHour();

      if (!data || data.length === 0) return;

      this.chartAttendanceHourOptions = {
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
          categories: data.map(x => `${x.hour.toString().padStart(2, '0')}h`)
        },
        dataLabels: {
          enabled: true
        }
      };

    });

    effect(() => {

      const data = this.departmentsCreatedByMonth();

      if (!data || data.length === 0) {
        return;
      }

      this.chartOptions = {
        series: [{
          name: 'Departamentos',
          data: data.map(x => x.totalDepartments)
        }],
        chart: {
          type: 'bar',
          height: 350,
          toolbar: {
            show: false
          }
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

      const data = this.servicesCreatedByMonth();

      if (!data || data.length === 0) {
        return;
      }

      this.chartServiceOptions = {
        series: [{
          name: 'Serviços',
          data: data.map(x => x.totalServices)
        }],
        chart: {
          type: 'bar',
          height: 350,
          toolbar: {
            show: false
          }
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

      const data = this.usersCreatedByMonth();

      if (!data || data.length === 0) {
        return;
      }

      this.chartUserOptions = {
        series: [{
          name: 'Usuarios',
          data: data.map(x => x.totalUsers)
        }],
        chart: {
          type: 'bar',
          height: 350,
          toolbar: {
            show: false
          }
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

      const data = this.totalSchedulingByMonth();

      if (!data || data.length === 0) {
        return;
      }

      this.chartSchedulingMonthOptions = {
        series: [{
          name: 'Agendamentos',
          data: data.map(x => x.totalSchedules)
        }],
        chart: {
          type: 'bar',
          height: 350,
          toolbar: {
            show: false
          }
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

      const data = this.totalSchedulingByWeek();

      if (!data || data.length === 0) {
        return;
      }

      this.chartSchedulingWeekOptions = {
        series: [{
          name: 'Agendamentos',
          data: data.map(x => x.totalSchedules)
        }],
        chart: {
          type: 'bar',
          height: 350,
          toolbar: {
            show: false
          }
        },
        xaxis: {
          categories: data.map(x => x.weekDay)
        },
        dataLabels: {
          enabled: true
        }
      };
    });

    effect(() => {

      const data = this.schedulesByHour();

      if (!data || data.length === 0) {
        return;
      }

      this.chartSchedulingHourOptions = {
        series: [{
          name: 'Agendamentos',
          data: data.map(x => x.totalSchedules)
        }],
        chart: {
          type: 'bar',
          height: 350,
          toolbar: {
            show: false
          }
        },
        xaxis: {
          categories: data.map(x => `${x.hour.toString().padStart(2, '0')}h`)
        },
        dataLabels: {
          enabled: true
        }
      };
    });

    effect(() => {

      const data = this.schedulesByPriority();

      if (!data || data.length === 0) {
        return;
      }

      this.chartSchedulingPriorityOptions = {
        series: data.map(x => x.totalSchedules),

        chart: {
          type: 'donut',
          height: 300
        },

        labels: data.map(x => x.priority),

        colors: [
          '#3b82f6', // Azul
          'tomato', // Verde
          '#ef4444', // Vermelho
          '#f59e0b'  // Amarelo (caso tenha uma 4ª prioridade)
        ],

        legend: {
          position: 'bottom'
        },

        dataLabels: {
          enabled: true
        },

        responsive: [{
          breakpoint: 768,
          options: {
            chart: {
              width: 300
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      };
    })

    effect(() => {

      const data = this.totalCustomersByMonth();

      if (!data || data.length === 0) {
        return;
      }

      this.chartCustomerOptions = {
        series: [{
          name: 'Clientes',
          data: data.map(x => x.totalCustomers)
        }],
        chart: {
          type: 'bar',
          height: 350,
          toolbar: {
            show: false
          }
        },
        xaxis: {
          categories: data.map(x => x.monthName)
        },
        dataLabels: {
          enabled: true
        }
      };
    });
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
}
