import { Component, effect, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginStateService } from '../../services/states/login/login-state.service';
import { S } from '@angular/cdk/keycodes';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  // Injections
  public loginState = inject(LoginStateService);
  public fb = inject(FormBuilder);
  public snackBar = inject(MatSnackBar);
  public router = inject(Router);

  // States
  isMobile = signal(window.innerWidth < 768);

  // Variables
  viewPassword = false;

  // Form
  loginForm!: FormGroup;

  // Constructor
  constructor() {

    this.loginForm = this.fb.group({
      emailOrUsername: [''],
      password: ['']
    });

    effect(() => {

      if (this.loginState.loginStatus() === 'success') {

        this.snackBar.open(this.loginState.loginMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });

        this.router.navigate(['/login/home']);

        this.loginState.resetStatus();
      }

      if (this.loginState.loginStatus() === 'error') {
        this.snackBar.open(this.loginState.loginMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });

        this.loginState.resetStatus();
      }
    })
  }

  // Login
  login() {
    this.loginState.login(this.loginForm.value);
  }

  // Add event listenr
  @HostListener('window:resize')
  onResize() {
    this.isMobile.set(window.innerWidth < 768);
  }

}
