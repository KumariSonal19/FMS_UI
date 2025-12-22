import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProfileComponent implements OnInit {
  user: any = null;
  
  showPasswordForm = false;
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  
  message = '';      
  errorMessage = ''; 

  constructor(
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef 
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
  }

  togglePasswordForm() {
    this.showPasswordForm = !this.showPasswordForm;
    this.message = '';
    this.errorMessage = '';
    this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
  }

  onChangePassword() {
    this.message = '';
    this.errorMessage = '';
 
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.errorMessage = 'New password and Confirm password do not match!';
      return;
    }

    if (this.passwordData.newPassword.length < 6) {
      this.errorMessage = 'New password must be at least 6 characters long.';
      return;
    }

    this.authService.changePassword(
      this.user.username,
      this.passwordData.currentPassword,
      this.passwordData.newPassword
    ).subscribe({
      next: (res) => {
        this.message = 'Password updated successfully!';
        this.errorMessage = '';
        
        this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
      
        this.cd.detectChanges(); 
   
        setTimeout(() => {
          this.showPasswordForm = false;
          this.message = ''; 
          this.cd.detectChanges();
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to update password.';
        this.message = '';
        this.cd.detectChanges(); 
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}