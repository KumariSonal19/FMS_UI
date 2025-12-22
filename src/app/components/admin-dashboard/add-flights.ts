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
  flight = {
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

  successMessage = '';
  errorMessage = '';

  constructor(
    private flightService: FlightService,
    private authService: AuthService,
    private router: Router
  ) {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/home']);
    }
  }

 addFlight() {
    if (!this.flight.departureTime || !this.flight.arrivalTime) {
      this.errorMessage = 'Please select both Departure and Arrival times.';
      return;
    }

    const formatWithOffset = (dateString: string) => {
     
      const date = new Date(dateString);
      const offset = -date.getTimezoneOffset(); 
      const sign = offset >= 0 ? '+' : '-';
      const pad = (n: number) => n.toString().padStart(2, '0');
      
      const hours = pad(Math.floor(Math.abs(offset) / 60));
      const minutes = pad(Math.abs(offset) % 60);
      const offsetString = `${sign}${hours}:${minutes}`;
      return `${dateString}:00${offsetString}`;
    };

    const payload = {
      ...this.flight,
      departureTime: formatWithOffset(this.flight.departureTime),
      arrivalTime: formatWithOffset(this.flight.arrivalTime)
    };
    console.log('Sending Payload:', payload);
    this.flightService.addFlight(payload).subscribe({
      next: (res) => {
        this.successMessage = 'Flight Added Successfully!';
        this.errorMessage = '';
        this.flight = {
          airlineCode: '', airlineName: '', source: '', destination: '',
          departureTime: '', arrivalTime: '', price: null, totalSeats: 100, aircraft: ''
        };
      },
      error: (err) => {
        console.error('Add Flight Error:', err);
        this.errorMessage = 'Failed to add flight inventory: ' + (err.error?.message || err.statusText);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}