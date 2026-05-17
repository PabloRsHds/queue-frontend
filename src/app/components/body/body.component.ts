import { Component, inject } from '@angular/core';
import { DepartmentComponent } from "../department/department.component";
import { GlobalStatesService } from '../../services/states/global-states.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-body',
  imports: [DepartmentComponent, CommonModule],
  templateUrl: './body.component.html',
  styleUrl: './body.component.css'
})
export class BodyComponent {

  private globalState = inject(GlobalStatesService);

  public openModalDepartment = this.globalState.modalDepartment;

  handleOpenModalDepartment(): void {
    this.openModalDepartment.set(true);
  }

}
