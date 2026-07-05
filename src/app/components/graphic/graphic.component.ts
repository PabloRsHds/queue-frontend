import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStateService } from '../../services/states/user/user-state.service';
import { DepartmentStateService } from '../../services/states/department/department-state.service';

@Component({
  selector: 'app-graphic',
  imports: [CommonModule],
  templateUrl: './graphic.component.html',
  styleUrl: './graphic.component.css'
})
export class GraphicComponent {


  // Injections
  public userState = inject(UserStateService);
  public departmentState = inject(DepartmentStateService);

  // States
  public userLogged = this.userState.userLogged;

  // Department statistics
  public totalDepartments = this.departmentState.countTotalDepartment;
  public percentageByDepartment = this.departmentState.getPercentagesByDepartment;
  public countServicesByDepartment = this.departmentState.countServicesByDepartment

  ngOnInit(): void {

    this.departmentState.loadStatistics();
  }

  public navItem:string = 'General';

  public navItemChange(item: string) {
    this.navItem = item;
  }
}
