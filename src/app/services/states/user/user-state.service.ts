import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpService } from '../../backend/http.service';
import { ResponseUserDto } from '../../../dtos/users/ResponseUserDto';
import { ResponseAllUsersDto } from '../../../dtos/users/ResponseAllUsersDto';
import { ResponseUserStatisticsDto } from '../../../dtos/statistics/ResponseUserStatisticsDto';
import { RequestUserDto } from '../../../dtos/users/RequestUserDto';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {

  // Injections
  private http = inject(HttpService);

  // Signals
  public users = signal<ResponseAllUsersDto[]>([]);
  public userInfo = signal<ResponseUserDto | null>(null);

  public statistics = signal<ResponseUserStatisticsDto | null>(null);

  // Messages
  public registerMessage = signal('');
  public registerStatus = signal<'success' | 'error' | 'default'>('default');
  public updateMessage = signal('');
  public updateStatus = signal<'success' | 'error' | 'default'>('default');
  public deleteMessage = signal('');
  public deleteStatus = signal<'success' | 'error' | 'default'>('default');

  // ===================== PAGINATION =====================

  public page = signal<number>(0);
  public readonly size = 4;
  public totalElements = signal(0);
  public totalPages = computed(() =>
    Math.ceil(this.totalElements() / this.size)
  );

  // ===================== SEARCH =====================

  public search = signal('');

  // Create user
  registerUser(request: RequestUserDto) {
    this.http.createUser(request).subscribe({
      next: (response) => {

        this.registerMessage.set('User created successfully');
        this.registerStatus.set('success');
        this.loadingAllUsers();
      },
      error: () => {
        this.registerMessage.set('Error creating user');
        this.registerStatus.set('error');
      }
    })
  }

  // All users
  loadingAllUsers() {
    this.http.getAllUsers(this.page(), this.size, this.search()).subscribe({
      next: (response) => {

        this.users.set(response.content);
        this.loadStatistics();
        this.totalElements.set(response.totalElements);
      }
    })
  }

  // ===== LOAD STATISTICS =====
  loadStatistics() {
    this.http.getUserStatistics().subscribe({
      next: (response) => {
        this.statistics.set(response);
      }
    })
  }

  // Get user by id
  getUserById(userId: string) {
    this.http.getUserById(userId).subscribe({
      next: (response) => {
        this.userInfo.set(response);
      }
    })
  }

  // ===================== PAGINATION =====================

  nextPage() {

    if (this.page() + 1 >= this.totalPages()) return;

    this.page.update(p => p + 1);

    this.loadingAllUsers();
  }

  previousPage() {

    if (this.page() === 0) return;
    this.page.update(p => p - 1);

    this.loadingAllUsers();
  }

  goToPage(page: number) {

    if (page < 0 || page >= this.totalPages()) return;
    this.page.set(page);

    this.loadingAllUsers();
  }

  // ===================== SEARCH =====================

  setSearch(value: string) {

    this.search.set(value);
    // volta pra primeira página
    this.page.set(0);

    this.loadingAllUsers();
  }

  // ===================== RESET =====================

  resetLoadDepartments() {
    this.loadingAllUsers();
  }

  resetStatus() {
    this.registerStatus.set('default');
    this.updateStatus.set('default');
    this.deleteStatus.set('default');
  }
}
