import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { FlightService, Flight } from '../../services/flight.service';

@Component({
  selector: 'app-search-flights',
  templateUrl: './search-flights.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe]
})
export class SearchFlightsComponent implements OnInit {
  searchForm!: FormGroup;
  flights: Flight[] = [];
  loading = false;
  searched = false;
  error = '';
  submitted = false;

  airports = [
    { code: 'DEL', name: 'Delhi (DEL)' },
    { code: 'BOM', name: 'Mumbai (BOM)' },
    { code: 'BLR', name: 'Bangalore (BLR)' },
    { code: 'HYD', name: 'Hyderabad (HYD)' },
    { code: 'CCU', name: 'Kolkata (CCU)' },
    { code: 'PNQ', name: 'Pune (PNQ)' }
  ];

  constructor(
    private fb: FormBuilder,
    private flightService: FlightService,
    private cd: ChangeDetectorRef 
  ) { }

  ngOnInit() {
    this.searchForm = this.fb.group({
      source: ['', Validators.required],
      destination: ['', Validators.required],
      departureDate: ['', Validators.required],
      journeyType: ['ONE_WAY']
    });
  }

  get f() { return this.searchForm.controls; }

  onSearch() {
    this.submitted = true;
    this.error = '';

    if (this.searchForm.invalid) return;

    if (this.f['source'].value === this.f['destination'].value) {
      this.error = 'Source and Destination cannot be the same.';
      return;
    }

    this.loading = true;
    this.searched = true;
    this.flights = []; 

    const searchRequest = {
      source: this.f['source'].value,
      destination: this.f['destination'].value,
      departureDate: this.f['departureDate'].value,
      journeyType: 'ONE_WAY'
    };

    console.log('[Search] Sending request:', searchRequest);

    this.flightService.searchFlights(searchRequest).subscribe({
      next: (data) => {
        console.log('[Search] Response received:', data);
        this.flights = data || [];
        this.loading = false;

        this.cd.detectChanges(); 
      },
      error: (err) => {
        console.error('[Search] Error:', err);
        this.error = 'Search failed. Check console for details.';
        this.loading = false;
      
        this.cd.detectChanges();
      }
    });
  }

  bookFlight(flight: Flight) {
    alert(`Initiating booking for Flight ${flight.flightId}`);
  }
}