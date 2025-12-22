import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SearchFlightsComponent } from './components/search-flights/search-flights.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BookFlightComponent } from './components/book-flight/book-flight'; 
import { MyBookingsComponent } from './components/my-bookings/my-bookings';
import { AdminDashboardComponent } from './components/admin-dashboard/add-flights';
import { UpdatePasswordComponent } from './components/update-password/update-password';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'search',
    component: SearchFlightsComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'book/:flightId', 
    component: BookFlightComponent
  },
  {
    path: 'my-bookings', 
    component: MyBookingsComponent
  },
  { path: 'admin-dashboard', 
    component: AdminDashboardComponent
  },
  { path: 'update-password', 
    component: UpdatePasswordComponent, 
    canActivate: [AuthGuard] },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];