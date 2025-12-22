import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    console.log('Attempting registration for:', this.f['username'].value);

    const signupRequest = {
      username: this.f['username'].value,
      email: this.f['email'].value,
      password: this.f['password'].value
    };

    this.authService.register(signupRequest).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.success = true;
        this.loading = false;

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        // this.error = error.error?.message || error.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}