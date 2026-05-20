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
  public openCardDepartment = this.globalState.openCardDepartment;

  sidebarOpen: boolean = false;

  toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
  }

  handleOpenCardDepartment(): void {
    this.openCardDepartment.set(true);
  }
}
