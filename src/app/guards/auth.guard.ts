import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    
    if (!this.authService.isAuthenticated()) {
      return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }

    const user = this.authService.getUser();
    const isExpired = user?.passwordExpired === true;
    const updateUrl = '/update-password';

    if (isExpired) {
      if (state.url === updateUrl) {
        return true; 
      }
      return this.router.createUrlTree([updateUrl]);
    }

    if (!isExpired) {
     
      if (state.url === updateUrl) {
        return this.router.createUrlTree(['/home']);
      }
    
      return true; 
    }

    return true;
  }
}