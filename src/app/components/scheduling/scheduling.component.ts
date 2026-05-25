import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scheduling',
  imports: [CommonModule],
  templateUrl: './scheduling.component.html',
  styleUrl: './scheduling.component.css'
})
export class SchedulingComponent {

  sidebarOpen = false;
  ticketModalOpen = false;

  currentPage: 'dashboard' | 'agendamentos' = 'dashboard';

  breadcrumb = 'Início';

  selectedAppointment: any = null;

  appointments = [
    {
      date: '24/05/2025',
      time: '09:00',
      name: 'João Silva',
      initials: 'JS',
      email: 'joao.silva@email.com',
      phone: '(11) 99999-9999',
      service: 'Atendimento ao Cliente',
      dept: 'Atendimento ao Cliente',
      guiche: 'Guichê 01',
      status: 'Confirmado',
      statusClass: 'badge-green',
      ticket: 'A123',
      ticketBg: '#dcfce7',
      ticketColor: '#16a34a',
      color: '#3b82f6'
    },

    {
      date: '24/05/2025',
      time: '09:30',
      name: 'Maria Oliveira',
      initials: 'MO',
      email: 'maria.oliveira@email.com',
      phone: '(11) 98888-8888',
      service: 'Serviços Financeiros',
      dept: 'Financeiro',
      guiche: 'Guichê 02',
      status: 'Confirmado',
      statusClass: 'badge-green',
      ticket: 'F045',
      ticketBg: '#dcfce7',
      ticketColor: '#16a34a',
      color: '#9333ea'
    },

    {
      date: '24/05/2025',
      time: '10:00',
      name: 'Carlos Santos',
      initials: 'CS',
      email: 'carlos.santos@email.com',
      phone: '(11) 97777-7777',
      service: 'Suporte Técnico',
      dept: 'Suporte',
      guiche: 'Guichê 03',
      status: 'Pendente',
      statusClass: 'badge-orange',
      ticket: '-',
      ticketBg: '#f1f5f9',
      ticketColor: '#94a3b8',
      color: '#16a34a'
    }
  ];

  navigateTo(page: 'dashboard' | 'agendamentos'): void {

    this.currentPage = page;

    if (page === 'dashboard') {
      this.breadcrumb = 'Início';
    }

    if (page === 'agendamentos') {
      this.breadcrumb = 'Agendamentos';
    }

    this.sidebarOpen = false;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  openTicketModal(appt: any): void {
    this.selectedAppointment = appt;
    this.ticketModalOpen = true;
  }

  closeModal(event?: Event): void {

    if (event) {
      event.stopPropagation();
    }

    this.ticketModalOpen = false;
  }

  generateTicket(): void {

    alert('Ticket gerado com sucesso!');

    this.ticketModalOpen = false;
  }
}
