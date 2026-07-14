import { inject, Injectable, signal } from '@angular/core';
import { HttpService } from '../../backend/http.service';
import { ResponseAttendanceStatisticsDto } from '../../../dtos/statistics/ResponseAttendanceStatisticsDto';
import { ResponseTicketsForAttendanceDto } from '../../../dtos/attendance/ResponseTicketsForAttendanceDto';
import { ResponseCountTotalAttendancesStatisticsDto } from '../../../dtos/attendance/statistics/ResponseCountTotalAttendancesStatisticsDto';
import { ResponseAverageServiceTimeStatisticsDto } from '../../../dtos/attendance/statistics/ResponseAverageServiceTimeStatisticsDto';
import { ResponseAttendancesByCustomerStatisticsDto } from '../../../dtos/attendance/statistics/ResponseAttendancesByCustomerStatisticsDto';
import { ResponseAttendancesByDepartmentStatisticsDto } from '../../../dtos/attendance/statistics/ResponseAttendancesByDepartmentStatisticsDto';
import { ResponseAttendancesByHourStatisticsDto } from '../../../dtos/attendance/statistics/ResponseAttendancesByHourStatisticsDto';
import { ResponseAttendancesByServiceStatisticsDto } from '../../../dtos/attendance/statistics/ResponseAttendancesByServiceStatisticsDto';
import { ResponseAttendancesByWeekStatisticsDto } from '../../../dtos/attendance/statistics/ResponseAttendancesByWeekStatisticsDto';
import { ResponseAttendancesCreatedByMonthStatisticsDto } from '../../../dtos/attendance/statistics/ResponseAttendancesCreatedByMonthStatisticsDto';
import { ResponseAverageAttendanceByUserStatisticsDto } from '../../../dtos/attendance/statistics/ResponseAverageAttendanceByUserStatisticsDto';
import { ResponseAverageWaitingTimeStatisticsDto } from '../../../dtos/attendance/statistics/ResponseAverageWaitingTimeStatisticsDto';

@Injectable({
  providedIn: 'root'
})
export class AttendentStateService {

  // Injections
  private http = inject(HttpService)

  // Ticket States
  public tickets = signal<ResponseTicketsForAttendanceDto[] | []>([]);

  // Attendance States
  public countTotalAttendances = signal<ResponseCountTotalAttendancesStatisticsDto | null>(null);
  public averageWaitingTime = signal<ResponseAverageWaitingTimeStatisticsDto | null>(null);
  public averageServiceTime = signal<ResponseAverageServiceTimeStatisticsDto | null>(null)
  public averageAttendanceByUser = signal<ResponseAverageAttendanceByUserStatisticsDto[] | null>(null);
  public attendancesCreatedByMonth = signal<ResponseAttendancesCreatedByMonthStatisticsDto[] | null>(null);
  public attendancesByWeek = signal<ResponseAttendancesByWeekStatisticsDto[] | null>(null);
  public attendancesByService = signal<ResponseAttendancesByServiceStatisticsDto[] | null>(null)
  public attendancesByHour = signal<ResponseAttendancesByHourStatisticsDto[] | null>(null);
  public attendancesByDepartment = signal<ResponseAttendancesByDepartmentStatisticsDto[] | null>(null)
  public attendancesByCustomer = signal<ResponseAttendancesByCustomerStatisticsDto[] | null>(null);

  //variables
  public currentTimer = signal<string>('00:00:00');
  private intervalId: any;

  getAttendentsStatistics() {
    return this.http.getAttendanceStatistics().subscribe({
      next: (response) => {
        this.countTotalAttendances.set(response.countTotalAttendances);
        this.averageWaitingTime.set(response.averageWaitingTime);
        this.averageServiceTime.set(response.averageServiceTime);
        this.averageAttendanceByUser.set(response.averageAttendanceByUser);
        this.attendancesCreatedByMonth.set(response.attendancesCreatedByMonth);
        this.attendancesByWeek.set(response.attendancesByWeek);
        this.attendancesByService.set(response.attendancesByService);
        this.attendancesByHour.set(response.attendancesByHour);
        this.attendancesByDepartment.set(response.attendancesByDepartment);
        this.attendancesByCustomer.set(response.attendancesByCustomer);
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
