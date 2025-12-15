import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  constructor() { }

  saveToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  saveUser(user: any): void {
    sessionStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser(): any {
    const user = sessionStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  clearAuth(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.userKey);
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }
}
