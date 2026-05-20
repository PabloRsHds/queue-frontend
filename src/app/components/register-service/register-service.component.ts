import { GlobalStatesService } from './../../services/states/global-states.service';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpService } from '../../services/backend/http.service';
import { DepartmentStateService } from '../../services/states/department/department-state.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register-service',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register-service.component.html',
  styleUrl: './register-service.component.css'
})
export class RegisterServiceComponent {

  ngOnInit(){
    this.initializeServiceForm();
  }

  // ====== Injection ======
  private fb = inject(FormBuilder)
  private http = inject(HttpService)
  private departmentState = inject(DepartmentStateService)
  private globalState = inject(GlobalStatesService)
  private snackBar = inject(MatSnackBar)

  // ===== States ==========
  public departments = this.departmentState.departments;
  public openRegisterService = this.globalState.openRegisterService;

  // ===== FORM ==========
  public serviceForm!: FormGroup;

  initializeServiceForm() {
    this.serviceForm = this.fb.group({
      departmentName: ['', Validators.required],
      name: ['', Validators.required],
      code: [''],
      description: [''],
    });
  }

  // ONSUBMIT
  onSubmitService(): void {
    if (this.serviceForm.invalid) return;

    this.http.createServiceManagement(this.serviceForm.value).subscribe({
      next: () => {

        // opcional: recarregar departamentos (se serviços aparecem lá)
        this.departmentState.loadDepartments();

        this.serviceForm.reset();

        this.snackBar.open('Serviço cadastrado com sucesso!', 'Fechar', {
          duration: 3000
        });
      },
      error: () => {
        this.snackBar.open('Erro ao cadastrar serviço.', 'Fechar', {
          duration: 3000,
        });
      }
    });
  }

}
