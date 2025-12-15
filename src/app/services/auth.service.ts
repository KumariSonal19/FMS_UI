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
    // Load user from session on service init
    const user = this.tokenService.getUser();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  /**
   * Register new user
   * @param username Username (3-20 chars)
   * @param email Valid email address
   * @param password Password (min 6 chars)
   */
  register(username: string, email: string, password: string): Observable<any> {
    const body = { username, email, password };
    return this.http.post(`${this.authUrl}/signup`, body);
  }

  /**
   * Login user
   * @param username Username
   * @param password Password
   */
  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post(`${this.authUrl}/signin`, body);
  }

  /**
   * Logout user
   */
  logout(): Observable<any> {
    return this.http.post(`${this.authUrl}/signout`, {});
  }

  /**
   * Save user info after successful login
   */
  saveAuthData(response: any): void {
    // Save user data
    this.tokenService.saveUser(response);
    
    // Update current user subject
    this.currentUserSubject.next(response);
    
    // Save token if it exists in response
    if (response.token) {
      this.tokenService.saveToken(response.token);
    }
  }

  /**
   * Clear auth data on logout
   */
  clearAuthData(): void {
    this.tokenService.clearAuth();
    this.currentUserSubject.next(null);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.tokenService.isAuthenticated();
  }

  /**
   * Get current user
   */
  getCurrentUser(): any {
    return this.tokenService.getUser();
  }
}
