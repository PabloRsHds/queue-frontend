import { inject, Injectable, signal } from '@angular/core';
import { HttpService } from '../../backend/http.service';
import { ResponseAttendanceStatisticsDto } from '../../../dtos/statistics/ResponseAttendanceStatisticsDto';
import { ResponseTicketsForAttendanceDto } from '../../../dtos/attendance/ResponseTicketsForAttendanceDto';

@Injectable({
  providedIn: 'root'
})
export class AttendentStateService {

  // Injections
  private http = inject(HttpService)

  // States
  public statistics = signal<ResponseAttendanceStatisticsDto | null>(null);
  public tickets = signal<ResponseTicketsForAttendanceDto[] | []>([])

  //variables
  public currentTimer = signal<string>('00:00:00');
  private intervalId: any;

  getAttendentsStatistics() {
    return this.http.getAttendanceStatistics().subscribe({
      next: (response) => {
        this.statistics.set(response);
      }
    });
  }

  getTicketsForAttendence() {
    return this.http.getTicketsForAttendance().subscribe({
      next: (response) => {
        console.log(response);
        this.tickets.set(response);
        this.startTimer(response[0]);
      }
    });
  }

  // Timer
  startTimer(ticket: ResponseTicketsForAttendanceDto): void {

    if (!ticket.startAttendance) {
      return;
    }

    const startDate = new Date(ticket.startAttendance);

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(() => {

      const diff = Math.floor(
        (Date.now() - startDate.getTime()) / 1000
      );

      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      this.currentTimer.set(
        `${hours.toString().padStart(2, '0')}:` +
        `${minutes.toString().padStart(2, '0')}:` +
        `${seconds.toString().padStart(2, '0')}`);

    }, 1000);
  }
}
