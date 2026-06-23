import { CreateScheduleDto } from './../../../dtos/schedule/CreateScheduleDto';
import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpService } from '../../backend/http.service';
import { ResponseAllSchedulesDto } from '../../../dtos/schedule/ResponseAllSchedulesDto';
import { ResponseScheduleDto } from '../../../dtos/schedule/ResponseScheduleDto';
import { UpdateScheduleDto } from '../../../dtos/schedule/UpdateScheduleDto';
import { ResponseScheduleStatisticsDto } from '../../../dtos/schedule/ResponseScheduleStatisticsDto';

@Injectable({
  providedIn: 'root'
})
export class ScheduleStateService {

  private http = inject(HttpService);

  // ===== STATES =====

  public schedules = signal<ResponseAllSchedulesDto[]>([]);
  public scheduleInfo = signal<ResponseScheduleDto | null>(null);

  // ===== PAGINATION =====
  public schedulePage = signal(0);
  public scheduleSize = 4;
  public scheduleTotalElements = signal(0);

  public scheduleSearch = signal('');
  public scheduleSearchDate = signal<string | null>(null);

  // ===== MESSAGES =====
  public registerMessage = signal('');
  public registerStatus = signal<'success' | 'error' | 'default'>('default');

  public updateMessage = signal('');
  public updateStatus = signal<'success' | 'error' | 'default'>('default');

  public deleteMessage = signal('');
  public deleteStatus = signal<'success' | 'error' | 'default'>('default');

  // ===== STATISTCS =======
  public scheduleStatistics = signal<ResponseScheduleStatisticsDto | null>(null);

  // ======== MODAL ========
  public modalSchedulingRegister = signal<Boolean>(false);

  public scheduleTotalPages = computed(() =>
    Math.ceil(this.scheduleTotalElements() / this.scheduleSize)
  );

  // ===== METHODS =====

  // Register Schedule
  registerSchedule(request: CreateScheduleDto) {
    this.http.registerSchedule(request).subscribe({
      next: () => {
        this.registerMessage.set('Agendamento realizado com sucesso!');
        this.registerStatus.set('success');
        this.loadSchedules();
        this.loadScheduleStatistics();
      },
      error: () => {
        this.registerMessage.set('Erro ao realizar agendamento');
        this.registerStatus.set('error');
      }
    });
  }

  // Update Schedule
  updateSchedule(request: UpdateScheduleDto) {
    this.http.updateSchedule(request).subscribe({
      next: () => {
        this.updateMessage.set('Agendamento atualizado com sucesso!');
        this.updateStatus.set('success');
        this.loadSchedules();
        this.loadScheduleStatistics();
      },
      error: () => {
        this.updateMessage.set('Erro ao atualizar agendamento');
        this.updateStatus.set('error');
      }
    });
  }

  // Delete Schedule
  deleteSchedule(scheduleId: string) {
    this.http.deleteSchedule(scheduleId).subscribe({

      next: (response) => {
        this.deleteMessage.set('Agendamento deletado com sucesso!');
        this.deleteStatus.set('success');
        this.loadSchedules();
        this.loadScheduleStatistics();
      },

      error: (error) => {
        this.deleteMessage.set('Erro ao deletar agendamento');
        this.deleteStatus.set('error');
      }
    })
  }

  // Statistics
  loadScheduleStatistics() {
    this.http.getScheduleStatistics().subscribe({
      next: response => {
        console.log(response);
        this.scheduleStatistics.set(response);
      }
    });
  }

  // Load all schedules
  loadSchedules() {
    this.http.getAllScheduling(
      this.schedulePage(),
      this.scheduleSize,
      this.scheduleSearch(),
      this.scheduleSearchDate()
    ).subscribe({
      next: response => {
        this.schedules.set(response.content);
        this.scheduleTotalElements.set(response.totalElements);
      }
    });
  }

  getScheduleById(scheduleId: string) {
    this.http.getScheduleById(scheduleId).subscribe({
      next: response => {
        this.scheduleInfo.set(response);
        console.log(response);
      }
    });
  }

  nextPage() {
    if (this.schedulePage() + 1 >= this.scheduleTotalPages()) return;

    this.schedulePage.update(p => p + 1);
    this.loadSchedules();
  }

  previousPage() {
    if (this.schedulePage() === 0) return;

    this.schedulePage.update(p => p - 1);
    this.loadSchedules();
  }

  goToPage(page: number) {
    this.schedulePage.set(page);
    this.loadSchedules();
  }

  setSearch(value: string) {
    this.scheduleSearch.set(value);
    this.schedulePage.set(0);
    this.loadSchedules();
  }

  setSearchDate(value: string | null) {
    this.scheduleSearchDate.set(value);
    this.schedulePage.set(0);
    this.loadSchedules();
  }


  // RESETS
  resetStatus() {
    this.registerStatus.set('default');
    this.updateStatus.set('default')
    this.deleteStatus.set('default');
  }

  resetScheduleInfo() {
    this.scheduleInfo.set(null);
  }
}
