import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStateService } from '../../services/states/user/user-state.service';
import { DepartmentStateService } from '../../services/states/department/department-state.service';
import { ApexAxisChartSeries, ApexChart,ApexXAxis, ApexDataLabels, ApexPlotOptions} from "ng-apexcharts";
import { ServiceManagementService } from '../../services/states/serviceManagement/service-management.service';

import { ChartComponent } from 'ng-apexcharts';
import { CustomerStateService } from '../../services/states/customer/customer-state.service';
import { ScheduleStateService } from '../../services/states/scheduling/scheduling-state.service';
import { AttendentStateService } from '../../services/states/attendent/attendent-state.service';


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
  selector: 'app-graphic',
  imports: [CommonModule, ChartComponent],
  templateUrl: './graphic.component.html',
  styleUrl: './graphic.component.css'
})
export class GraphicComponent {

  // Gráficos
  public chartOptions!: ChartOptions;
  public chartServiceOptions!: ChartOptions;
  public chartUserOptions!: ChartOptions;
  public chartCustomerOptions!: ChartOptions;
  public chartSchedulingMonthOptions!: ChartOptions;
  public chartSchedulingWeekOptions!: ChartOptions;
  public chartSchedulingHourOptions!: ChartOptions;
  public chartSchedulingPriorityOptions!: DonutChartOptions;

  // Injections
  public userState = inject(UserStateService);
  public attendentState = inject(AttendentStateService);
  public departmentState = inject(DepartmentStateService);
  public serviceState = inject(ServiceManagementService);
  public customerState = inject(CustomerStateService);
  public schedulingState = inject(ScheduleStateService);

  // States
  public userLogged = this.userState.userLogged;
  public selectValue = signal<string>('day');

  // Attendent statistics
  public attendentStatistics = this.attendentState.statistics;

  // Department statistics
  public totalDepartments = this.departmentState.countTotalDepartment;
  public percentageByDepartment = this.departmentState.getPercentagesByDepartment;
  public countServicesByDepartment = this.departmentState.countServicesByDepartment;
  public departmentsCreatedByMonth = this.departmentState.departmentsCreatedByMonth;

  // Service statistics
  public totalServices = this.serviceState.countTotalServicesStatistics;
  public percentageServices = this.serviceState.servicePercentagesStatistics;
  public servicesCreatedByMonth = this.serviceState.servicesCreatedByMonth;
  public servicesByDepartment = this.serviceState.servicesByDepartment;
  public usersByService = this.serviceState.usersByService;
  public schedulesByService = this.serviceState.schedulesByService;
  public ticketsByService = this.serviceState.ticketsByService;

  // User statistics
  public totalUsers = this.userState.countTotalUsersStatistics;
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

  ngOnInit(): void {
    this.departmentState.loadStatistics();
    this.serviceState.loadStatistics();
    this.userState.loadStatistics();
    this.schedulingState.loadStatistics();
    this.customerState.loadStatistics();
  }

  constructor() {

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

  };

  public navItem:string = 'General';

  public navItemChange(item: string) {
    this.navItem = item;
  }

  public getRoleDisplayName(role: string): string {
    switch (role) {
      case 'MANAGER': return 'Gerente';
      case 'ATTENDANT': return 'Atendente';
      case 'RECEPTION': return 'Recepcionista';
      default: return 'Administrador';
    }
  }

  public getSelectValue(value: string) {
    this.selectValue.set(value);
  }

}
