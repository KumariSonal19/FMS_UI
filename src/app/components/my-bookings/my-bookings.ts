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

  showMessageModal = false;
  messageModalTitle = '';
  messageModalBody = '';
  isError = false;

  constructor(
    private flightService: FlightService,
    private authService: AuthService,
    private cd: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user && user.email) {
      this.currentUserEmail = user.email;
      this.loadBookings();
    } else {
      this.error = 'Please log in to view your bookings.';
      this.loading = false;
    }
  }

  loadBookings() {
    this.loading = true;
    this.flightService.getBookingHistory(this.currentUserEmail).subscribe({
      next: (data) => {
        this.bookings = data || [];
        this.loading = false;
        this.cd.detectChanges(); 
      },
      error: (err) => {
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

  closeMessageModal(){
    this.showMessageModal = false;
    this.cd.detectChanges();
  }

  confirmCancel() {
    if (!this.pnrToCancel) return;
    this.error = ''; 

    this.flightService.cancelBooking(this.pnrToCancel).subscribe({
      next: (updatedBooking) => {
        const index = this.bookings.findIndex(b => b.pnr === this.pnrToCancel);
        if (index !== -1) {
          if (updatedBooking) {
             this.bookings[index] = updatedBooking;
          } else {
             this.bookings[index].bookingStatus = 'CANCELLED'; 
          }
        }
        
        this.closeModal();
        this.showPopup('Success', 'Ticket Cancelled Successfully', false);
      },
      error: (err) => {
        console.error("Cancellation Error:", err);
        const backendMessage = err.error?.message || "Cancellation not allowed less than 24hours before journey.";
        this.closeModal();
        this.showPopup('Cancellation Failed', backendMessage, true);
      }
    });
  }

  showPopup(title: string, message: string, isError: boolean) {
    this.messageModalTitle = title;
    this.messageModalBody = message;
    this.isError = isError;
    this.showMessageModal = true;
    this.cd.detectChanges();
  }
}