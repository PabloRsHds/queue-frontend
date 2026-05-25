import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalStatesService } from '../../services/states/global-states.service';
import { ServiceManagementService } from '../../services/states/serviceManagement/service-management.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-table-services',
  imports: [ CommonModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './table-services.component.html',
  styleUrl: './table-services.component.css'
})
export class TableServicesComponent {

  // Injections
  private serviceState = inject(ServiceManagementService);

  // Methods
  public openDropdownDelete: string = '';
  public openModalRegister: boolean = false;
  public openModalUpdate: boolean = false;
  public openModalDelete: boolean = false;
  // =========

  services = [
    {
      name: 'Financeiro',
      description: 'Serviços financeiros e cobranças',
      code: 'FIN',
      department: 'Financeiro',
      time: '00:20:10',
      status: 'Ativo'
    },
    {
      name: 'Coquinho',
      description: 'Atendimento geral ao cliente',
      code: 'ATC',
      department: 'Atendimento ao Cliente',
      time: '00:15:30',
      status: 'Ativo'
    },
    {
      name: 'Suporte Técnico',
      description: 'Suporte e assistência técnica',
      code: 'SUP',
      department: 'Suporte',
      time: '00:25:45',
      status: 'Ativo'
    },
    {
      name: 'Protocolo',
      description: 'Protocolos e documentos',
      code: 'PRO',
      department: 'Administrativo',
      time: '00:10:05',
      status: 'Inativo'
    }
  ];

  toggleDeleteModal(serviceId: string) {

    if (this.openDropdownDelete === serviceId) {
      this.openDropdownDelete = '';
      return;
    }

    this.openDropdownDelete = serviceId;
  }

  handleCloseModalDelete() {
    this.openDropdownDelete = '';
    this.openModalDelete = true;
  }
}
