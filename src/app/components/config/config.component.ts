import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import { UserStateService } from '../../services/states/user/user-state.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { UpdateUserDto } from '../../dtos/users/UpdateUserDto';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-config',
  imports: [ CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css'
})
export class ConfigComponent implements OnInit {

  // Injections
  public fb = inject(FormBuilder);
  public userState = inject(UserStateService);
  public snackBar = inject(MatSnackBar);

  public userLogged = this.userState.userLogged;
  public navItem:string = 'profile';
  public showPassword: boolean = false;

  // Form
  public profileForm!: FormGroup;

  ngOnInit(): void {
    this.userState.getUserByToken();

    this.profileForm = this.fb.group({
      name: '',
      email: '',
      phone: '',
      role: '',
      counterNumber: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  }

  constructor() {

    effect(() => {

      if (this.userLogged() != null) {

        const user = this.userLogged();

        this.profileForm.patchValue({
          name: user?.name,
          email: user?.email,
          phone: user?.phone,
          role: this.getRoleDisplayName(user?.role ?? ''),
          counterNumber: user?.counterNumber
        });

      }
    })

    effect(() => {

      if (this.userState.updateStatus() == 'success') {

        this.snackBar.open(this.userState.updateMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });

        this.profileForm.patchValue({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        this.userState.resetStatus();
      }

      if (this.userState.updateStatus() == 'error') {

        this.snackBar.open(this.userState.updateMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });

        this.profileForm.patchValue({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        this.userState.resetStatus();
      }
    })
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

  updateUser() {

    if (this.userLogged() == null) return;

    if (this.profileForm.value.newPassword !== this.profileForm.value.confirmPassword) {
      this.snackBar.open('Senhas não conferem', 'Fechar', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      return;
    };

    this.userState.updateUser({phone: this.profileForm.value.phone, password: this.profileForm.value.newPassword, userId: this.userLogged()!.userId});
  }

}
