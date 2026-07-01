import { Component, inject } from '@angular/core';
import { UserStateService } from '../../services/states/user/user-state.service';

@Component({
  selector: 'app-config',
  imports: [],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css'
})
export class ConfigComponent {

  // Injections
  public userState = inject(UserStateService);

  // Variables
  public userLogged = this.userState.userLogged;


  public getRoleDisplayName(role: string): string {
    switch (role) {
      case 'MANAGER': return 'Gerente';
      case 'ATTENDANT': return 'Atendente';
      case 'RECEPTION': return 'Recepcionista';
      default: return 'Administrador';
    }
  }

}
