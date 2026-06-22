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


  // login
  login(request: LoginDto) {

    this.http.login(request).subscribe({

      next: (response) => {

        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);

        this.loginMessage.set('Login feito com sucesso');
        this.loginStatus.set('success')
      },
      error: (error) => {
        this.loginMessage.set('Erro ao tentar logar');
        this.loginStatus.set('error')
      }
    })
  }

  // Resets
  resetStatus() {
    this.loginStatus.set('default')
  }

}
