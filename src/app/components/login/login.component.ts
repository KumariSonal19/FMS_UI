import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/search';
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    
    const loginData = {
      username: this.f['username'].value,
      password: this.f['password'].value
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        window.sessionStorage.setItem('auth-token', response.token);
        window.sessionStorage.setItem('auth-user', JSON.stringify(response));
        if (response.passwordExpired) {
          this.router.navigate(['/update-password']);
        } 
  
        else if (this.authService.isAdmin()) {
          this.router.navigate(['/admin-dashboard']);
        } 
        
        else {
          this.router.navigateByUrl(this.returnUrl);
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
        if (error.status === 400) {
          this.error = error.error?.message || 'User not registered';
        } else if (error.status === 401) {
          this.error = 'Invalid username or password';
        } else {
          this.error = 'Login failed. Please try again later.';
        }
        this.loading = false;
      }
    });
  }
}