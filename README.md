# Flight Booking UI
This is a modern and responsive Flight Booking Frontend Application built using Angular with Standalone Components.  
This application serves as the UI layer for a Microservices-based Flight Booking System, enabling secure authentication, flight search, and user profile management.

---

## Features

### Authentication
- User registration and login
- JWT-based authentication

### Flight Search
- Search flights by source, destination, and date
- Prevents duplicate source and destination selection
- Real-time form validation

### User Experience
- Fully responsive UI 
- Glassmorphism-based design
- Loading indicators 

### Security
- Route protection using AuthGuard
- HTTP Interceptors for automatic JWT token attachment


## Screenshots
![Homepage](./Screenshots/Homepage-top.png)  

![Homepage](./Screenshots/Homepage-bottom.png) 

![Rgister](./Screenshots/Register-Page.png)
![Register](./Screenshots/Register-User.png) 
![Signin](./Screenshots/SignIn-After-Register.png) 
![FlightSearch](./Screenshots/Before-FlightSearch.png) 
![FlightSearch](./Screenshots/After-FlightSearch.png) 
![MyBookings](./Screenshots/MyBookingsPath.png)
![CancelTicket](./Screenshots/CancelTicketPop-up.png)\
![ProfileChangePassword](./Screenshots/ProfileChangePasswordOption.png)
---

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
