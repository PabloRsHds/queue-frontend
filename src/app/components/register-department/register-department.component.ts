import { Component, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalStatesService } from '../../services/states/global-states.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DepartmentStateService } from '../../services/states/department/department-state.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register-department',
  imports: [ CommonModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './register-department.component.html',
  styleUrl: './register-department.component.css'
})
export class RegisterDepartmentComponent implements OnInit{

  // === Injects ====
  private globalState = inject(GlobalStatesService);
  private departmentState = inject(DepartmentStateService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  // ======================

  // === States ====
  public openRegisterDepartment = this.globalState.openRegisterDepartment
  public registerStatus = this.departmentState.registerStatus;
  public registerMessage = this.departmentState.registerMessage;
  // ======================

  // Initialize
  ngOnInit(): void {
    this.initializeDepartmentForm();
  }

  constructor() {

    effect(() => {

      if (this.registerStatus() === 'success') {

        this.departmentForm.reset();
        this.departmentState.resetStatus();
        this.snackBar.open(this.registerMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });
      }

      if (this.registerStatus() === 'error') {

        this.departmentState.resetStatus();
        this.snackBar.open(this.registerMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-danger'],
        });
      }
    })
  }

  // === Forms ====
  departmentForm!: FormGroup;

  initializeDepartmentForm() {
    this.departmentForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  onSubmitDepartment() {
    this.departmentState.createDepartment(this.departmentForm.value);
  }

  // === MODAL ===
  closeModalRegisterDepartment() {
    this.globalState.closeModalRegisterDepartment();
  }

}
