import { Component, inject } from '@angular/core';
import { GlobalStatesService } from '../../services/states/global-states.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  private globalState = inject(GlobalStatesService);
  public openModalDepartment = this.globalState.modalDepartment;

  sidebarOpen: boolean = false;

  toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
  }

  handleOpenModalDepartment(): void {
    this.openModalDepartment.set(true);
  }
}
