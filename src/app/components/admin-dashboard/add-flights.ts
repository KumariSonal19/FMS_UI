import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FlightService } from '../../services/flight.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-flights.html',
  styleUrls:['./add-flights.css']
})
export class AdminDashboardComponent {

  flight = this.createEmptyFlight();
  successMessage = '';
  errorMessage = '';

  constructor(
    private flightService: FlightService,
    private authService: AuthService,
    private router: Router
  ) {
    this.redirectIfNotAdmin();
  }

  addFlight(): void {
    if (!this.isTimeValid()) {
      this.showError('Please select both Departure and Arrival times.');
      return;
    }

    const payload = this.buildFlightPayload();

    this.flightService.addFlight(payload).subscribe({
      next: () => this.handleSuccess(),
      error: (err) => this.handleError(err)
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private redirectIfNotAdmin(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/home']);
    }
  }

  private isTimeValid(): boolean {
    return !!this.flight.departureTime && !!this.flight.arrivalTime;
  }

  private buildFlightPayload() {
    return {
      ...this.flight,
      departureTime: this.formatWithOffset(this.flight.departureTime),
      arrivalTime: this.formatWithOffset(this.flight.arrivalTime)
    };
  }

  private formatWithOffset(dateString: string): string {
    const date = new Date(dateString);
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? '+' : '-';
    const pad = (n: number) => n.toString().padStart(2, '0');
    const hours = pad(Math.floor(Math.abs(offset) / 60));
    const minutes = pad(Math.abs(offset) % 60);
    return `${dateString}:00${sign}${hours}:${minutes}`;
  }

  private handleSuccess(): void {
    this.successMessage = 'Flight Added Successfully!';
    this.errorMessage = '';
    this.flight = this.createEmptyFlight();
  }

  private handleError(err: any): void {
    console.error('Add Flight Error:', err);
    this.errorMessage =
      'Failed to add flight inventory: ' +
      (err.error?.message || err.statusText);
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
  }

  private createEmptyFlight() {
    return {
      airlineCode: '',
      airlineName: '',
      source: '',
      destination: '',
      departureTime: '',
      arrivalTime: '',
      price: null,
      totalSeats: 100,
      aircraft: ''
    };
  }
}
