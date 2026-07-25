import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { HttpService } from '../services/backend/http.service';

// Interceptor HTTP que adiciona o token de acesso automaticamente
// Também renova tokens expirados e faz logout se necessário
export const AuthInterceptorService: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);
  const api = inject(HttpService);

  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  // Não intercepta login nem refresh
  const isLogin = req.url.endsWith('/login');
  const isRefresh = req.url.endsWith('/refresh-tokens');

  if (isLogin || isRefresh) {
    return next(req);
  }

  let authReq = req;

  // Só envia o access token se ele ainda for válido
  if (accessToken && !isTokenExpired(accessToken)) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  return next(authReq).pipe(

    catchError((error: HttpErrorResponse) => {

      // Não é erro de autenticação
      if (error.status !== 401) {
        return throwError(() => error);
      }

      // Não existe refresh token
      if (!refreshToken) {
        logout(router);
        return throwError(() => error);
      }

      // Refresh expirado
      if (isTokenExpired(refreshToken)) {
        logout(router);
        return throwError(() => error);
      }

      // Solicita novos tokens
      return api.refreshTokens({
        refreshToken
      }).pipe(
        switchMap(tokens => {
          localStorage.setItem('accessToken', tokens.accessToken);
          localStorage.setItem('refreshToken', tokens.refreshToken);
          const newRequest = req.clone({
            setHeaders: {
              Authorization: `Bearer ${tokens.accessToken}`
            }
          });
          return next(newRequest);
        }),
        catchError(refreshError => {
          logout(router);
          return throwError(() => refreshError);
        })
      );
    })
  );
};

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 <= Date.now();

  } catch {
    return true;
  }

}

function logout(router: Router): void {

  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');

  router.navigate(['/login']);

}
