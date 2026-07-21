import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { AttendentStateService } from '../../services/states/attendent/attendent-state.service';
import { CommonModule } from '@angular/common';
import { TicketStateService } from '../../services/states/ticket/ticket-state.service';
import { UserStateService } from '../../services/states/user/user-state.service';
import { ResponseTicketsForAttendanceDto } from '../../dtos/ticket/ResponseTicketsForAttendanceDto';
import { interval, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-service-counter',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './service-counter.component.html',
  styleUrl: './service-counter.component.css'
})
export class ServiceCounterComponent implements OnInit {

  // Injections
  private attendentState = inject(AttendentStateService);
  private ticketState = inject(TicketStateService);
  private userState = inject(UserStateService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

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

  // Form
  public finishForm!: FormGroup;

  // Variables
  startTime = new Date();
  date: string = '00:00:00';

  // Modal
  public modalCancelAttendance = false;
  public modalFinishAttendance = false;

  // Pagination tickets
  public pageTickets = this.ticketState.pageTickets;
  public totalPagesTickets = this.ticketState.totalPagesTickets;
  public totalElementsTickets = this.ticketState.totalElementsTickets;

  // Pagination history
  public pageHistory = this.ticketState.pageHistory;
  public totalPagesHistory = this.ticketState.totalPagesHistory;
  public totalElementsHistory = this.ticketState.totalElementsHistory;

  public itemsPerPage = 6;

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

    // Inicializando o formulário para finalizar atendimento
    this.finishForm = this.fb.group({
      resolution: ['']
    });

    effect(() => {

      if (this.ticketSelected() !== null) {
        this.ticketSelected();
      }
    });

    effect(() => {

      if (this.attendentState.startAttendanceStatus() === 'success') {

        this.snackBar.open(this.attendentState.startAttendanceMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });

        this.attendentState.resetStatus();

      }


      if (this.attendentState.startAttendanceStatus() === 'error') {

        this.snackBar.open(this.attendentState.startAttendanceMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });

        this.attendentState.resetStatus();
      }
    });

    effect(() => {

      if (this.attendentState.finishAttendanceStatus() === 'success') {

        this.snackBar.open(this.attendentState.finishAttendanceMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });

        this.ticketSelectedId.set(null);
        this.modalFinishAttendance = false;
        this.attendentState.resetStatus();

      }

      if (this.attendentState.finishAttendanceStatus() === 'error') {

        this.snackBar.open(this.attendentState.finishAttendanceMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });

        this.attendentState.resetStatus();
      }
    });

    effect(() => {

      if (this.attendentState.cancelAttendanceStatus() === 'success') {

        this.snackBar.open(this.attendentState.cancelAttendanceMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });

        this.ticketSelectedId.set(null);
        this.modalCancelAttendance = false;
        this.attendentState.resetStatus();

      }

      if (this.attendentState.cancelAttendanceStatus() === 'error') {

        this.snackBar.open(this.attendentState.cancelAttendanceMessage(), 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });

        this.attendentState.resetStatus();
      }
    });

  }

  ngOnInit(): void {
    this.attendentState.loadStatistics();
    this.userState.getUserByToken();

    this.pollingSubscription = interval(10000).subscribe(() => {
      this.ticketState.getTicketsForAttendence();
      this.ticketState.getHistoryTicketsByAttendant();
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

  // Pagination tickets
  nextPageTickets(): void {
    this.ticketState.nextPageTickets();
  }

  previousPageTickets(): void {
    this.ticketState.previousPageTickets();
  }

  goToPageTickets(page: number): void {
    this.ticketState.goToPageTickets(page);
  }

  getStartIndexTickets(): number {
    return this.pageTickets() * this.itemsPerPage + 1;
  }

  getEndIndexTickets(): number {
    return Math.min((this.pageTickets() + 1) * this.itemsPerPage, this.totalElementsTickets());
  }

  getPagesArrayTickets(): number[] {
    const total = this.totalPagesTickets();
    const current = this.pageTickets();
    const maxVisible = 4;

    let start = current - Math.floor(maxVisible / 2);
    let end = current + Math.floor(maxVisible / 2) + 1;

    if (start < 0) {
      start = 0;
      end = Math.min(maxVisible, total);
    }

    if (end > total) {
      end = total;
      start = Math.max(0, total - maxVisible);
    }

    return Array.from({ length: end - start }, (_, i) => start + i);
  }

  // Pagination history
  nextPageHistory(): void {
    this.ticketState.nextPageHistory();
  }

  previousPageHistory(): void {
    this.ticketState.previousPageHistory();
  }

  goToPageHistory(page: number): void {
    this.ticketState.goToPageHistory(page);
  }

  getStartIndexHistory(): number {
    return this.pageHistory() * this.itemsPerPage + 1;
  }

  getEndIndexHistory(): number {
    return Math.min((this.pageHistory() + 1) * this.itemsPerPage, this.totalElementsHistory());
  }

  getPagesArrayHistory(): number[] {
    const total = this.totalPagesHistory();
    const current = this.pageHistory();
    const maxVisible = 4;

    let start = current - Math.floor(maxVisible / 2);
    let end = current + Math.floor(maxVisible / 2) + 1;

    if (start < 0) {
      start = 0;
      end = Math.min(maxVisible, total);
    }

    if (end > total) {
      end = total;
      start = Math.max(0, total - maxVisible);
    }

    return Array.from({ length: end - start }, (_, i) => start + i);
  }

  // Modal canceled
  openModalCanceled(ticketId: string) {
    this.ticketSelectedId.set(ticketId);
    this.modalCancelAttendance = true;
  }

  closeModalCanceled() {
    this.modalCancelAttendance = false;
  }

  cancelAttendance(ticketId: string) {

    if (ticketId === '') return;
    this.attendentState.cancelAttendance(ticketId);
  }

  // Modal finish
  openModalFinish(ticketId: string) {
    this.ticketSelectedId.set(ticketId);
    this.modalFinishAttendance = true;
  }

  closeModalFinish() {
    this.modalFinishAttendance = false;
  }

  finishAttendance(ticketId: string) {

    if (ticketId === '') return;
    this.attendentState.finishAttendance(ticketId, this.finishForm.value.resolution);
  }

}
