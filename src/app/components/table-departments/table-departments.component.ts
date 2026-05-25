import { Component, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalStatesService } from '../../services/states/global-states.service';
import { DepartmentStateService } from '../../services/states/department/department-state.service';
import { HttpService } from '../../services/backend/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-departments',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './table-departments.component.html',
  styleUrl: './table-departments.component.css'
})
export class TableDepartmentsComponent {

  services = [
    { name: 'Atendimento ao Cliente', desc: 'Atendimento geral ao cliente', code: 'ATC', dept: 'Departamento ao Cliente', time: '00:15:30', status: 'Ativo' },
    { name: 'Financeiro', desc: 'Serviços financeiros e cobranças', code: 'FIN', dept: 'Financeiro', time: '00:20:10', status: 'Ativo' },
    { name: 'Suporte Técnico', desc: 'Suporte e assistência técnica', code: 'SUP', dept: 'Suporte', time: '00:25:45', status: 'Ativo' },
    { name: 'Protocolo', desc: 'Protocolos e documentos', code: 'PRO', dept: 'Administrativo', time: '00:10:05', status: 'Inativo' },
    { name: 'Emissão de Documentos', desc: 'Emissão de certidões e documentos', code: 'DOC', dept: 'Documentação', time: '00:15:20', status: 'Ativo' }
  ];

  goToPage() {}

  nextPage() {}
}
