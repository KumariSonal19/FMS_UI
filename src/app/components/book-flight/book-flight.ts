import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlightService } from '../../services/flight.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-book-flight',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-flight.html',
  styleUrls: ['./book-flight.css']
})
export class BookFlightComponent implements OnInit {
  success = false;
  error = '';
  loading = false;
  successMessage = '';
  generatedPnr = ''; 
  booking = {
    flightId: '',
    userName: '',
    userEmail: '',
    journeyDate: '',
    numberOfSeats: 1,
    passengers: [
      { name: '', age: 1, gender: 'MALE', seatNumber: '', mealType: 'VEG' }
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private flightService: FlightService,
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.booking.flightId = this.route.snapshot.paramMap.get('flightId') || '';
    this.route.queryParams.subscribe(params => {
      this.booking.journeyDate = params['date'] || new Date().toISOString().split('T')[0];
    });
    const user = this.authService.getUser();

    if (user) {
      this.booking.userName = user.username || '';
      this.booking.userEmail = user.email || '';
    }
  }

  updatePassengerCount() {
    const current = this.booking.passengers.length;
    const target = this.booking.numberOfSeats;
    if (target > current) {
      for (let i = current; i < target; i++) {
        this.booking.passengers.push({ name: '', age: 1, gender: 'MALE', seatNumber: '', mealType: 'VEG' });
      }
    } else if (target < current) {
      this.booking.passengers = this.booking.passengers.slice(0, target);
    }
  }

  confirmBooking() {
    this.loading = true;
    this.error = '';
    const backendPayload = {
      flightId: this.booking.flightId,
      userName: this.booking.userName,
      userEmail: this.booking.userEmail,
      numberOfSeats: this.booking.numberOfSeats,
      passengers: this.booking.passengers,
      journeyDate: this.booking.journeyDate,
      selectedSeats: this.booking.passengers.map(p => p.seatNumber),
      mealPreference: this.booking.passengers[0].mealType
    };

    console.log('Sending Booking Payload:', backendPayload);

    this.flightService.bookFlight(this.booking.flightId, backendPayload).subscribe({
      next: (res: any) => {
        console.log('Booking Success:', res);
        this.loading = false;
        this.success = true;
        this.generatedPnr = '';
        
        if (typeof res === 'object' && res.pnr) {
          this.generatedPnr = res.pnr;
        } else if (typeof res === 'string') {
          const match = res.match(/(PNR[a-zA-Z0-9]+)/);
          if (match) {
            this.generatedPnr = match[0];
          }
        }

        this.successMessage = 'Your flight has been successfully booked.';
        this.cd.detectChanges();
        const btn = document.getElementById('openSuccessModalBtn');
        if (btn) {
          btn.click();
        }
      },
      error: (err) => {
        console.error('Booking Error:', err);
        this.loading = false;
        const msg = err.error && err.error.message ? err.error.message :
                    (typeof err.error === 'string' ? err.error : 'Server Error');
        this.error = 'Booking Failed: ' + msg;
      }
    });
  }

  navigateToHome() {
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 300);
  }
}