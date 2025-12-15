const BASE_URL = 'http://localhost:8081/api';

export const environment = {
  production: true,
  apiUrl: BASE_URL,
  authUrl: `${BASE_URL}/auth`,
  flightUrl: `${BASE_URL}/flight`,
  bookingUrl: `${BASE_URL}/booking`
};
