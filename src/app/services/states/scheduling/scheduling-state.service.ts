import { CreateScheduleDto } from './../../../dtos/schedule/CreateScheduleDto';
import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpService } from '../../backend/http.service';
import { ResponseAllSchedulesDto } from '../../../dtos/schedule/ResponseAllSchedulesDto';

@Injectable({
  providedIn: 'root'
})
export class ScheduleStateService {

  private http = inject(HttpService);

  // ===== STATES =====

  public schedules = signal<ResponseAllSchedulesDto[]>([]);

  // ===== PAGINATION =====
  public schedulePage = signal(0);
  public scheduleSize = 4;
  public scheduleTotalElements = signal(0);

  public scheduleSearch = signal('');
  public scheduleSearchDate = signal<string | null>(null);

  // ===== MESSAGES =====
  public registerMessage = signal('');
  public registerStatus = signal<'success' | 'error' | 'default'>('default');

  public deleteMessage = signal('');
  public deleteStatus = signal<'success' | 'error' | 'default'>('default');

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
      },
      error: () => {
        this.registerMessage.set('Erro ao realizar agendamento');
        this.registerStatus.set('error');
      }
    });
  }

  // Delete Schedule
  deleteSchedule(scheduleId: string) {
    this.http.deleteSchedule(scheduleId).subscribe({

      next: (response) => {
        this.deleteMessage.set('Agendamento deletado com sucesso!');
        this.registerStatus.set('success');
        this.loadSchedules();
      },

      error: (error) => {
        this.registerMessage.set('Erro ao deletar agendamento');
        this.registerStatus.set('error');
      }
    })
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
  }
}
