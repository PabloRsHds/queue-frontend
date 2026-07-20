import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { AttendentStateService } from '../../services/states/attendent/attendent-state.service';
import { CommonModule } from '@angular/common';
import { TicketStateService } from '../../services/states/ticket/ticket-state.service';
import { UserStateService } from '../../services/states/user/user-state.service';
import { ResponseTicketsForAttendanceDto } from '../../dtos/ticket/ResponseTicketsForAttendanceDto';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-service-counter',
  imports: [CommonModule],
  templateUrl: './service-counter.component.html',
  styleUrl: './service-counter.component.css'
})
export class ServiceCounterComponent implements OnInit {

  // Injections
  private attendentState = inject(AttendentStateService);
  private ticketState = inject(TicketStateService);
  private userState = inject(UserStateService);

  // State Attendent
  public countTotalAttendances = this.attendentState.countTotalAttendances;
  public averageServiceTime = this.attendentState.averageServiceTime;
  public avarageWaitingTime = this.attendentState.averageWaitingTime;

  // State Ticket
  public ticketsForAttendance = this.ticketState.ticketsForAttendance;
  public historyTickets = this.ticketState.historyTickets;
  public totalTickets = this.ticketState.totalTickets;

  // State attendent
  public currentTimer = this.attendentState.currentTimer;

  // Next ticket
  public cont = signal(-1);

  // State User
  public userLogged = this.userState.userLogged;

  // Variables
  startTime = new Date();
  date: string = '00:00:00';

  private pollingSubscription?: Subscription;

  public ticketSelectedId = signal<string | null>(null);

  public ticketSelected = computed(() => {
    const id = this.ticketSelectedId();

    if (!id) {
      return null;
    }

    return (
      this.ticketsForAttendance().find(
        ticket => ticket.ticketId === id
      ) ?? null
    );
  });

  constructor() {

    effect(() => {

      if (this.ticketSelected() !== null) {
        this.ticketSelected();
      }
    })

    effect(() => {
      console.log('Tickets atualizados:', this.ticketsForAttendance());
    });
  }

  ngOnInit(): void {
    this.attendentState.loadStatistics();
    this.ticketState.getHistoryTicketsByAttendant();
    this.userState.getUserByToken();

    this.pollingSubscription = interval(5000).subscribe(() => {
      this.ticketState.getTicketsForAttendence();
    });
  }

  ngOnDestroy(): void {
    this.pollingSubscription?.unsubscribe();
  }

  getNamePriority(priority: string):string {
    if (priority === 'NORMAL') return 'Normal';
    else if (priority === 'PRIORITY') return 'Prioridade';
    return '';
  }

  getNameStatus(status: string):string {
    if(status === 'FINISHED') return 'Finalizado';
    else if (status === 'CANCELED') return 'Cancelado';
    return ''
  }

  // Start attendance
  startAttendance(ticketId: string) {
    this.attendentState.startAttendance(ticketId);
  }

  finishAttendance(ticketId: string) {

    const observation = '';
    const resolution = '';
    if (ticketId === '') return;
    this.attendentState.finishAttendance(ticketId, observation, resolution);
    this.ticketSelectedId.set(null);
  }

  cancelTicket(ticketId: string) {

    if (ticketId === '') return;
    this.ticketState.cancelTicket(ticketId);
    this.ticketSelectedId.set(null);
  }

  callNextTicket(tickets: ResponseTicketsForAttendanceDto[]) {

    if (tickets.length === 0) {
      return;
    }

    const nextIndex = this.cont() + 1;

    if (nextIndex >= tickets.length) {
      return;
    }

    this.cont.set(nextIndex);
    this.ticketSelectedId.set(tickets[nextIndex].ticketId);
  }

  callBeforeTicket(tickets: ResponseTicketsForAttendanceDto[]) {

    if (tickets.length === 0) {
      return;
    }

    const previousIndex = this.cont() - 1;

    if (previousIndex < 0) {
      return;
    }

    this.cont.set(previousIndex);
    this.ticketSelectedId.set(tickets[previousIndex].ticketId);
  }

}
