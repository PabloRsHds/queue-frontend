import { Component, inject, OnInit } from '@angular/core';
import { AttendentStateService } from '../../services/states/attendent/attendent-state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service-counter',
  imports: [CommonModule],
  templateUrl: './service-counter.component.html',
  styleUrl: './service-counter.component.css'
})
export class ServiceCounterComponent implements OnInit {

  // Injections
  private attendentState = inject(AttendentStateService);

  // State
  public countTotalAttendances = this.attendentState.countTotalAttendances;
  public averageServiceTime = this.attendentState.averageServiceTime;
  public avarageWaitingTime = this.attendentState.averageWaitingTime;
  public tickets = this.attendentState.tickets
  public currentTimer = this.attendentState.currentTimer

  // Variables
  startTime = new Date();
  date: string = '00:00:00';

  ngOnInit(): void {
    this.attendentState.loadStatistics();
    this.attendentState.getTicketsForAttendence();
  }

}
