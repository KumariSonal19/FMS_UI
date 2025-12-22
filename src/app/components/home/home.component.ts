import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class HomeComponent implements OnInit {
  isAuthenticated = false;
  username = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();    
    if (this.isAuthenticated) {
      const user = this.authService.getUser();
      this.username = user?.username || 'User';
    }
  }
}