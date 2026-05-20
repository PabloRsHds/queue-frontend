import { Component, inject } from '@angular/core';
import { GlobalStatesService } from '../../services/states/global-states.service';
import { CommonModule } from '@angular/common';
import { CardDepartmentComponent } from "../card-department/card-department.component";

@Component({
  selector: 'app-body',
  imports: [CommonModule, CardDepartmentComponent],
  templateUrl: './body.component.html',
  styleUrl: './body.component.css'
})
export class BodyComponent {

  // ==== Injects ====
  private globalState = inject(GlobalStatesService);
  // =================

  // ==== States ====
  public openCardDepartment = this.globalState.openCardDepartment;
  // ================

  handleOpenCardDepartment(): void {
    this.openCardDepartment.set(true);
  }

}
