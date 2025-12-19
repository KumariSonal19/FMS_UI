import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule, DatePipe } from '@angular/common';
import { FlightService } from '../../services/flight.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink], 
  templateUrl: './my-bookings.html',
  styleUrl:'./my-bookings.css'
})
export class MyBookingsComponent implements OnInit {
  
  bookings: any[] = [];
  loading = true;
  error = '';
  
  currentUserEmail = 'sonal@example.com'; 

  constructor(
    private flightService: FlightService,
    private cd: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    
    this.flightService.getBookingHistory(this.currentUserEmail).subscribe({
      next: (data) => {
        console.log('Bookings loaded:', data);
        this.bookings = data || [];
        this.loading = false;
    
        this.cd.detectChanges(); 
      },
      error: (err) => {
        console.error('Fetch error:', err);
        this.error = 'Could not load bookings.';
        this.loading = false;
      
        this.cd.detectChanges();
      }
    });
  }

  cancelTicket(pnr: string) {
    if (!confirm('Are you sure you want to cancel this ticket?')) return;

    this.flightService.cancelBooking(pnr).subscribe({
      next: (res) => {
        alert('Ticket Cancelled Successfully');
        this.loadBookings(); 
      },
      error: (err) => {
        alert('Cancellation Failed');
      }
    });
  }
}