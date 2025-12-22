import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-password.html',
  styleUrls: ['./update-password.css']
})
export class UpdatePasswordComponent {
  oldPassword = ''; 
  newPassword = '';
  confirmPassword = '';
  loading = false;
  error = '';
  success = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.error = '';
    this.success = '';

    if (this.newPassword !== this.confirmPassword) {
      this.error = "Passwords do not match!";
      return;
    }

    this.loading = true;
    const user = this.authService.getUser();

    // Call AuthService
    this.authService.changePassword(user.username, this.oldPassword, this.newPassword)
      .subscribe({
        next: (res) => {
          this.success = "Password updated successfully! Redirecting to login...";
          
          // Clear session and force re-login after 2 seconds
          setTimeout(() => {
            this.authService.logout();
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          this.error = err.error?.message || "Failed to update password. Check your current password.";
          this.loading = false;
        }
      });
  }
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}