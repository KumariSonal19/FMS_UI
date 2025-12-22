import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isAuthenticated = false;
  username = '';
  isAdmin = false;
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // this.isAdmin = this.authService.isAdmin();
    this.authService.currentUser$.subscribe(() => {
      this.updateAuthStatus();
    });
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateAuthStatus();
    });

    this.updateAuthStatus();
  }

  private updateAuthStatus(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      const user = this.authService.getUser(); 
      this.username = user?.username || 'User';
      this.isAdmin = this.authService.isAdmin();
    }
    else {
      this.username = '';
      this.isAdmin = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}