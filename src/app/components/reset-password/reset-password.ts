import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl:'./reset-password.html',
  styleUrls: ['./reset-password.css']
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  newPassword = '';
  message = '';
  error = '';
  loading = false;
  success = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'];
    if (!this.token) {
      this.error = 'Invalid link. Token is missing.';
    }
  }

  onSubmit(): void {
    if (!this.token) return;
    this.loading = true;
    
    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: (res) => {
        this.message = 'Password reset successful! Redirecting to login...';
        this.success = true;
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to reset password.';
        this.loading = false;
      }
    });
  }
}