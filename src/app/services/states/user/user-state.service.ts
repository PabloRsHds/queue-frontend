import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpService } from '../../backend/http.service';
import { ResponseUserDto } from '../../../dtos/users/ResponseUserDto';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {

  // Injections
  private http = inject(HttpService);

  // Signals
  public users = signal<ResponseUserDto[]>([]);
  public userInfo = signal<ResponseUserDto | null>(null);

  // ===================== PAGINATION =====================

  public page = signal<number>(0);

  public readonly size = 4;

  public totalElements = signal(0);

  public totalPages = computed(() =>
    Math.ceil(this.totalElements() / this.size)
  );

  // ===================== SEARCH =====================

  public search = signal('');

  // All users
  loadingAllUsers() {
    this.http.getAllUsers(this.page(), this.size, this.search()).subscribe({
      next: (response) => {
        this.users.set(response.content);
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

  }
}
