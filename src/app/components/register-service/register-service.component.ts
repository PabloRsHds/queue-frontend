import { GlobalStatesService } from './../../services/states/global-states.service';
import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DepartmentStateService } from '../../services/states/department/department-state.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiceManagementService } from '../../services/states/serviceManagement/service-management.service';

@Component({
  selector: 'app-register-service',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register-service.component.html',
  styleUrl: './register-service.component.css'
})
export class RegisterServiceComponent {

  // ====== Injection ======
  private fb = inject(FormBuilder);
  private departmentState = inject(DepartmentStateService);
  private serviceState = inject(ServiceManagementService);
  private globalState = inject(GlobalStatesService);
  private snackBar = inject(MatSnackBar);

  // ===== States ==========
  public departments = this.departmentState.departments;
  public serviceRegisterStatus = this.serviceState.serviceRegisterStatus;
  public serviceRegisterMessage = this.serviceState.serviceRegisterMessage;

  // ===== FORM ==========
  public serviceForm!: FormGroup;

  // ==== Initializations ====
  ngOnInit(){
    this.initializeServiceForm();
  }

  constructor() {

    effect(() => {

      if (this.serviceRegisterStatus() === 'success') {

        this.serviceForm.reset();
        this.serviceForm.get('departmentName')?.setValue('');
        this.serviceState.resetStatus();
        this.snackBar.open(this.serviceRegisterMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      }

      if (this.serviceRegisterStatus() === 'error') {

        this.serviceState.resetStatus();
        this.snackBar.open(this.serviceRegisterMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-danger']
        });
      }

    })
  }

  // === FORM ====
  initializeServiceForm() {

    this.departmentState.loadDepartments();

    this.serviceForm = this.fb.group({
      departmentName: ['', Validators.required],
      name: ['', Validators.required],
      code: [''],
      description: [''],
    });
  }

  // ONSUBMIT
  onSubmitService(){
    if (this.serviceForm.invalid) return;
    this.serviceState.registerServiceManagenent(this.serviceForm.value);
  }

  // MODAL
  closeRegisterServiceModal() {
    this.globalState.closeModalRegisterService();
  }

}
