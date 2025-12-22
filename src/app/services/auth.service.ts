import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators'; 
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
    const user = this.getUser();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post(this.authUrl + '/signin', {
      username: credentials.username,
      password: credentials.password
    }).pipe(
      tap((data: any) => {
        window.sessionStorage.setItem('auth-token', data.token); 
        window.sessionStorage.setItem('auth-user', JSON.stringify(data));
        this.currentUserSubject.next(data);
      })
    );
  }

  register(signupRequest: any): Observable<any> {
    return this.http.post(this.authUrl + '/signup', signupRequest, { responseType: 'text' });
  }

  logout(): void {
    window.sessionStorage.clear(); 
    this.currentUserSubject.next(null);
    window.location.reload(); 
  }

  isAuthenticated(): boolean {
    return !!window.sessionStorage.getItem('auth-token');
  }

  getUser(): any {
    const userStr = window.sessionStorage.getItem('auth-user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  getUserEmail(): string {
    const user = this.getUser();
    return user ? user.email : '';
  }

  isAdmin(): boolean {
    const user = this.getUser();
    if (user && user.roles) {
      return user.roles.includes('ROLE_ADMIN'); 
    }
    return false;
  }

    
  changePassword(username: string, oldPass: string, newPass: string): Observable<any> {
    return this.http.post(this.authUrl + '/change-password', {
      username: username,
      oldPassword: oldPass,
      newPassword: newPass
    });
  }
}