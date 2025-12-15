import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = environment.authUrl;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {
    const user = this.getCurrentUser();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.authUrl}/signup`, { username, email, password },{ responseType: 'text' as 'json' });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.authUrl}/signin`, { username, password });
  }

  saveAuthData(response: any): void {
    if (response.token) {
      this.tokenService.saveToken(response.token);
      const user = this.decodeToken(response.token);
      this.currentUserSubject.next(user);
    }
  }

  logout(): void {
    this.tokenService.clearAuth();
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.tokenService.hasToken();
  }

  getCurrentUser(): any {
    const token = this.tokenService.getToken();
    return token ? this.decodeToken(token) : null;
  }

  private decodeToken(token: string): any {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        username: payload.sub, 
        roles: payload.roles || []
      };
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }
}