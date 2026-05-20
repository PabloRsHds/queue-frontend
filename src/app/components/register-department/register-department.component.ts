import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalStatesService } from '../../services/states/global-states.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-department',
  imports: [ CommonModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './register-department.component.html',
  styleUrl: './register-department.component.css'
})
export class RegisterDepartmentComponent {

  // === Injects ====
  private globalState = inject(GlobalStatesService);
  private fb = inject(FormBuilder);
  // ======================

  // === States ====
  public openRegisterDepartment = this.globalState.openRegisterDepartment
  // ======================

  // === Forms ====
  departmentForm!: FormGroup;

  initializeDepartmentForm() {
    this.departmentForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  onSubmitDepartment() {}

}
