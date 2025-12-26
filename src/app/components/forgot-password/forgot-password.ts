import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPasswordComponent {
  email = '';
  loading = false;
  message = '';
  error = '';

  constructor(
    private authService: AuthService,
    private cd: ChangeDetectorRef 
  ) {}

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.message = '';

    this.authService.forgotPassword(this.email)
      .pipe(
        finalize(() => {
          this.loading = false; 
          this.cd.detectChanges(); 
        })
      )
      .subscribe({
        next: (res) => {
          this.message = res.message || "Reset link sent to your email!";
          this.cd.detectChanges(); 
        },
        error: (err) => {
          console.error("Forgot Password Error:", err);
          this.error = err.error?.message || 'Failed to send link. Please check the email.';
          this.cd.detectChanges(); 
        }
      });
  }
}