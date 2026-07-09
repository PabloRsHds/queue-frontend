import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpService } from '../../backend/http.service';
import { ResponseAllUsersDto } from '../../../dtos/users/ResponseAllUsersDto';
import { RequestUserDto } from '../../../dtos/users/RequestUserDto';
import { ResponseUserInfoDto } from '../../../dtos/users/ResponseUserInfoDto';
import { UpdateUserDto } from '../../../dtos/users/UpdateUserDto';
import { ResponseCountTotalUsersStatisticsDto } from '../../../dtos/users/statistics/ResponseCountTotalUsersStatisticsDto';
import { ResponseUserPercentagesStatisticsDto } from '../../../dtos/users/statistics/ResponseUserPercentagesStatisticsDto';
import { ResponseUsersCreatedByMonthStatisticsDto } from '../../../dtos/users/statistics/ResponseUsersCreatedByMonthStatisticsDto';
import { ResponseServicesByUserStatisticsDto } from '../../../dtos/users/statistics/ResponseServicesByUserStatisticsDto';
import { ResponseUsersByRoleStatisticsDto } from '../../../dtos/users/statistics/ResponseUsersByRoleStatisticsDto';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {

  // Injections
  private http = inject(HttpService);

  // Signals
  public users = signal<ResponseAllUsersDto[]>([]);
  public userLogged = signal<ResponseUserInfoDto | null>(null);
  public userInfo = signal<ResponseUserInfoDto | null>(null);

  // Messages
  public registerMessage = signal('');
  public registerStatus = signal<'success' | 'error' | 'default'>('default');
  public updateMessage = signal('');
  public updateStatus = signal<'success' | 'error' | 'default'>('default');
  public deleteMessage = signal('');
  public deleteStatus = signal<'success' | 'error' | 'default'>('default');

  // Metricas
  public countTotalUsersStatistics = signal<ResponseCountTotalUsersStatisticsDto | null>(null);
  public userPercentagesStatistics = signal<ResponseUserPercentagesStatisticsDto | null>(null);
  public usersCreatedByMonthStatistics = signal<ResponseUsersCreatedByMonthStatisticsDto[] | null>([]);
  public countServicesByUsers = signal<ResponseServicesByUserStatisticsDto[] | null>([]);
  public countRoleByUsers = signal<ResponseUsersByRoleStatisticsDto[] | null>([]);

  // ===================== PAGINATION =====================

  public page = signal<number>(0);
  public readonly size = 4;
  public totalElements = signal(0);
  public totalPages = computed(() =>
    Math.ceil(this.totalElements() / this.size)
  );

  // ===================== SEARCH =====================

  public search = signal('');

  // =========== MODAL =============
  public modalRegister = signal<Boolean>(false);

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

  updateUser(request: UpdateUserDto) {

    this.http.updateUser(request).subscribe({
      next: () => {
        this.updateMessage.set('User updated successfully');
        this.updateStatus.set('success');
        this.loadingAllUsers();
      },
      error: () => {
        this.updateMessage.set('Error updating user');
        this.updateStatus.set('error');
      }
    })
  }

  deleteUser() {

    const userId = this.userInfo()?.userId;
    if (!userId) return;

    this.http.deleteUser(userId).subscribe({
      next: () => {
        this.deleteMessage.set('User deleted successfully');
        this.deleteStatus.set('success');
        this.loadingAllUsers();
      },
      error: () => {
        this.deleteMessage.set('Error deleting user');
        this.deleteStatus.set('error');
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
        this.countTotalUsersStatistics.set(response.countTotalUsersStatistics);
        this.userPercentagesStatistics.set(response.userPercentagesStatistics);
        this.usersCreatedByMonthStatistics.set(response.usersCreatedByMonthStatistics);
        this.countServicesByUsers.set(response.countServicesByUsers);
        this.countRoleByUsers.set(response.countRoleByUsers);
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

  // Get user by token
  getUserByToken() {
    this.http.getUserByToken().subscribe({
      next: (response) => {
        this.userLogged.set(response);
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

  resetInfoUser() {
    this.userInfo.set(null);
  }
}
