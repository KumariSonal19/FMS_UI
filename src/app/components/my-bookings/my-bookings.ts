import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FlightService } from '../../services/flight.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink], 
  templateUrl: './my-bookings.html',
  styleUrls: ['./my-bookings.css']
})
export class MyBookingsComponent implements OnInit {
  
  bookings: any[] = [];
  loading = true;
  error = '';
  currentUserEmail = ''; 
  showCancelModal = false;
  pnrToCancel: string | null = null;

  constructor(
    private flightService: FlightService,
    private authService: AuthService,
    private cd: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user && user.email) {
      console.log('Fetching bookings for:', user.email);
      this.currentUserEmail = user.email;
      this.loadBookings();
    } else {
      console.error('User email not found.');
      this.error = 'Please log in to view your bookings.';
      this.loading = false;
    }
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

  initiateCancel(pnr: string) {
    this.pnrToCancel = pnr;
    this.showCancelModal = true;
    this.cd.detectChanges(); 
  }

  closeModal() {
    this.showCancelModal = false;
    this.pnrToCancel = null;
    this.cd.detectChanges();
  }

  confirmCancel() {
    if (!this.pnrToCancel) return;
    this.flightService.cancelBooking(this.pnrToCancel).subscribe({
      next: (response) => {
        this.closeModal();
        this.loadBookings(); 
      },
      error: (err) => {
        console.error("Cancellation Failed", err);
        this.closeModal();
      }
    });
  }
}