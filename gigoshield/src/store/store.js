/* ============================================================
   GIGOSHIELD — store/store.js
   Central application state object.
   All pages read from / write to this object directly.
   For Phase 2, swap this with a pub/sub reactive store.
   ============================================================ */

const State = {
  currentPage:      'landing',
  selectedCity:     'mumbai',
  weather:          {},           // { cityKey: WeatherData }
  geminiKey:        '',
  registeredWorker: null,         // Set after onboarding completes
  thresholds:       { rain: 10, heat: 40, wind: 60, aqi: 300 },
  fraudNodes:       [],
  simRunning:       false,
};

// ── Constants shared across all pages ───────────────────────

const CITIES = {
  mumbai:    { lat: 19.0760, lon: 72.8777, name: 'Mumbai',    x: '32%', y: '62%' },
  delhi:     { lat: 28.7041, lon: 77.1025, name: 'Delhi NCR', x: '42%', y: '28%' },
  bangalore: { lat: 12.9716, lon: 77.5946, name: 'Bengaluru', x: '40%', y: '78%' },
  chennai:   { lat: 13.0827, lon: 80.2707, name: 'Chennai',   x: '48%', y: '76%' },
  hyderabad: { lat: 17.3850, lon: 78.4867, name: 'Hyderabad', x: '44%', y: '66%' },
  kolkata:   { lat: 22.5726, lon: 88.3639, name: 'Kolkata',   x: '65%', y: '48%' },
  pune:      { lat: 18.5204, lon: 73.8567, name: 'Pune',      x: '33%', y: '66%' },
};

const PLATFORMS = ['Zomato', 'Swiggy', 'Zepto', 'Blinkit', 'Amazon', 'Dunzo'];

const WMO_CODES = {
  0: 'Clear', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Icy Fog',
  51: 'Light Drizzle', 53: 'Moderate Drizzle', 55: 'Dense Drizzle',
  61: 'Slight Rain', 63: 'Moderate Rain', 65: 'Heavy Rain',
  71: 'Slight Snow', 80: 'Rain Showers',
  95: 'Thunderstorm', 96: 'Thunderstorm+Hail', 99: 'Heavy Thunderstorm',
};

// ── Seed claims data ─────────────────────────────────────────
let claimsDB = [
  { id: 'CLM-A1B2C3', worker: 'Ravi Kumar',   platform: 'Zomato',  city: 'Mumbai',    trigger: 'heavy_rain',   value: '12.4 mm/h', expected: 7000, actual: 2450, loss: 65, payout: 3822, trust: 0.89, status: 'paid',     ts: Date.now() - 86400000 * 2 },
  { id: 'CLM-D4E5F6', worker: 'Priya Menon',  platform: 'Swiggy',  city: 'Delhi',     trigger: 'extreme_heat', value: '42.1°C',    expected: 6200, actual: 4030, loss: 35, payout: 2325, trust: 0.72, status: 'partial',  ts: Date.now() - 86400000 * 1 },
  { id: 'CLM-G7H8I9', worker: 'Arjun Singh',  platform: 'Zepto',   city: 'Bengaluru', trigger: 'high_wind',    value: '68 km/h',   expected: 5800, actual: 580,  loss: 90, payout: 0,    trust: 0.18, status: 'rejected', ts: Date.now() - 86400000 },
  { id: 'CLM-J1K2L3', worker: 'Sneha Patil',  platform: 'Blinkit', city: 'Chennai',   trigger: 'heavy_rain',   value: '15.1 mm/h', expected: 8000, actual: 2800, loss: 65, payout: 4320, trust: 0.91, status: 'paid',     ts: Date.now() - 3600000 * 3 },
  { id: 'CLM-M4N5O6', worker: 'Vikram Reddy', platform: 'Amazon',  city: 'Hyderabad', trigger: 'severe_aqi',   value: 'AQI 342',   expected: 9000, actual: 6300, loss: 30, payout: 2025, trust: 0.66, status: 'partial',  ts: Date.now() - 3600000 },
];
