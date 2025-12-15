import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FlightSearchRequest {
  source: string;
  destination: string;
  departureDate: string;
}

export interface Flight {
  flightId: string;
  airlineCode: string;
  airlineName: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  aircraft: string;
}

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private flightUrl = environment.flightUrl;
  private bookingUrl = environment.bookingUrl;

  constructor(private http: HttpClient) { }

  
  searchFlights(searchRequest: FlightSearchRequest): Observable<Flight[]> {
    return this.http.post<Flight[]>(
      `${this.flightUrl}/search`,
      searchRequest
    );
  }

  getFlightById(flightId: string): Observable<Flight> {
    return this.http.get<Flight>(
      `${this.flightUrl}/${flightId}`
    );
  }

 
  getAllFlights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(
      `${this.flightUrl}/all`
    );
  }

 
  bookFlight(flightId: string, bookingDetails: any): Observable<any> {
    return this.http.post(
      `${this.bookingUrl}/flight/${flightId}`,
      bookingDetails
    );
  }

 
  getBookingByPnr(pnr: string): Observable<any> {
    return this.http.get(
      `${this.bookingUrl}/ticket/${pnr}`
    );
  }

  
  getBookingHistory(email: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.bookingUrl}/history/${email}`
    );
  }

 
  cancelBooking(pnr: string): Observable<any> {
    return this.http.delete(
      `${this.bookingUrl}/cancel/${pnr}`
    );
  }
}
