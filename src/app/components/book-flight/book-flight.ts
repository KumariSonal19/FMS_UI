import { Component, OnInit } from '@angular/core';
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
})
export class BookFlightComponent implements OnInit {

  booking = {
    flightId: '',
    userName: '',
    userEmail: '',
    numberOfSeats: 1,
    selectedSeats: [] as string[],
    mealPreference: '',
    journeyDate: '',

    passengers: [
      {
        name: '',
        age: null,
        gender: '',
        seatNumber: '',
        mealType: ''
      }
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private flightService: FlightService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
  this.booking.flightId=this.route.snapshot.paramMap.get('flightId') || '';

  this.booking.journeyDate=this.route.snapshot.queryParamMap.get('journeyDate') || '';

  const user = this.authService.getCurrentUser();
  if (user) {
    this.booking.userName = user.username; 
  }
}


  updatePassengerCount(): void {
    const diff = this.booking.numberOfSeats - this.booking.passengers.length;

    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        this.booking.passengers.push({
          name: '',
          age: null,
          gender: '',
          seatNumber: '',
          mealType: ''
        });
      }
    } else if (diff < 0) {
      this.booking.passengers.splice(diff);
    }
  }

  bookFlight(): void {
  this.booking.selectedSeats=this.booking.passengers.map(p => p.seatNumber);

  this.booking.mealPreference=this.booking.passengers[0]?.mealType || '';

  console.log('PAYLOAD:', this.booking);

  this.flightService.bookFlight(
  this.booking.flightId,
  this.booking
).subscribe({
  next: (response: string) => {
    console.log('Server response:', response);
    alert(response); 
    this.router.navigate(['/home']);
  },
  error: err => {
    console.error(err);
    alert('Booking Failed');
  }
});

}
}
