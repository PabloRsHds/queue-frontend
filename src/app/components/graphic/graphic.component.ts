import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStateService } from '../../services/states/user/user-state.service';
import { DepartmentStateService } from '../../services/states/department/department-state.service';
import { ApexAxisChartSeries, ApexChart,ApexXAxis, ApexDataLabels, ApexPlotOptions} from "ng-apexcharts";
import { ChartComponent } from 'ng-apexcharts';


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
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

  // Injections
  public userState = inject(UserStateService);
  public departmentState = inject(DepartmentStateService);

  // States
  public userLogged = this.userState.userLogged;

  // Department statistics
  public totalDepartments = this.departmentState.countTotalDepartment;
  public percentageByDepartment = this.departmentState.getPercentagesByDepartment;
  public countServicesByDepartment = this.departmentState.countServicesByDepartment;
  public departmentsCreatedByMonth = this.departmentState.departmentsCreatedByMonth;

  ngOnInit(): void {
    this.departmentState.loadStatistics();
  }

  constructor() {

    effect(() => {

      const data = this.departmentsCreatedByMonth();

      console.log("Effect:", data);

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

  };

  public navItem:string = 'General';

  public navItemChange(item: string) {
    this.navItem = item;
  }

}
