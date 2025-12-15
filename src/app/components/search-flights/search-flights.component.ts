import { Component, OnInit } from '@angular/core';
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

  constructor(private fb: FormBuilder, private flightService: FlightService) { }

  ngOnInit() {
    this.searchForm = this.fb.group({
      source: ['', Validators.required],
      destination: ['', Validators.required],
      departureDate: ['', Validators.required],
      journeyType: ['ONEWAY']
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

    this.flightService.searchFlights(this.searchForm.value).subscribe({
      next: (data) => {
        this.flights = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Could not fetch flights. Is the backend running?';
        this.loading = false;
      }
    });
  }

  bookFlight(flight: Flight) {
    alert(`Initiating booking for Flight ${flight.flightId}`);
   
  }
}