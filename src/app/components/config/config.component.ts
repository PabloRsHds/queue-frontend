import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UserStateService } from '../../services/states/user/user-state.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-config',
  imports: [ CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css'
})
export class ConfigComponent {

  // Injections
  public fb = inject(FormBuilder);
  public userState = inject(UserStateService);

  // Variables
  public userLogged = this.userState.userLogged;
  public navItem:string = 'profile';
  public showPassword: boolean = false;

  // Form
  public profileForm!: FormGroup;

  constructor() {

    const user = this.userLogged();

    this.profileForm = this.fb.group({
      name: [user?.name],
      email: [user?.email],
      phone: [user?.phone],
      role: [this.getRoleDisplayName(user?.role ?? '')],
    });
  }


  public getRoleDisplayName(role: string): string {
    switch (role) {
      case 'MANAGER': return 'Gerente';
      case 'ATTENDANT': return 'Atendente';
      case 'RECEPTION': return 'Recepcionista';
      default: return 'Administrador';
    }
  }

  public navItemChange(item: string) {
    this.navItem = item;
  }

}
