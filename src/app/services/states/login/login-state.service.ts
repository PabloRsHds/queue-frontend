import { inject, Injectable, signal } from '@angular/core';
import { HttpService } from '../../backend/http.service';
import { LoginDto } from '../../../dtos/login/LoginDto';

@Injectable({
  providedIn: 'root'
})
export class LoginStateService {

  // Injections
  private http = inject(HttpService);

  // ===================== RESPONSE STATUS =====================
  public loginMessage = signal('');
  public loginStatus = signal<'success' | 'error' | 'default'>('default');

  public logoutMessage = signal('');
  public logoutStatus = signal<'success' | 'error' | 'default'>('default');


  // login
  login(request: LoginDto) {

    this.http.login(request).subscribe({
      next: (response) => {

        // Agora salva somente o accessToken
        localStorage.setItem('accessToken', response.accessToken);

        this.loginMessage.set('Login feito com sucesso');
        this.loginStatus.set('success');
      },

      error: (error) => {
        this.loginMessage.set('Erro ao tentar logar');
        this.loginStatus.set('error');
      }
    });
  }

  logout() {
    this.http.logout().subscribe({
      next: () => {
        this.logoutMessage.set('Logout realizado com sucesso');
        this.logoutStatus.set('success');
      }
    });
  }

  // Resets
  resetStatus() {
    this.loginStatus.set('default');
    this.logoutStatus.set('default');
  }

}
