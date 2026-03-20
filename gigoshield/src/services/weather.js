/* ============================================================
   GIGOSHIELD — services/weather.js
   Open-Meteo API integration.
   Fetches live weather data for 7 Indian cities.
   Auto-refreshes every 5 minutes.
   ============================================================ */

/**
 * Fetch current weather + 3-day forecast for a single city.
 * Falls back to realistic mock data if the API call fails.
 *
 * @param {string} cityKey  e.g. 'mumbai'
 * @returns {Promise<WeatherData>}
 */
async function fetchWeather(cityKey) {
  const city = CITIES[cityKey];

  const url = [
    `https://api.open-meteo.com/v1/forecast`,
    `?latitude=${city.lat}&longitude=${city.lon}`,
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,`,
    `precipitation,wind_speed_10m,wind_gusts_10m,weather_code,cloud_cover`,
    `&daily=precipitation_sum,temperature_2m_max,temperature_2m_min,precipitation_probability_max`,
    `&timezone=Asia/Kolkata&forecast_days=3`,
  ].join('');

  try {
    const r    = await fetch(url);
    const data = await r.json();
    const cur  = data.current;
    const day  = data.daily;

    const result = {
      city:     city.name,
      cityKey,
      temp:     cur.temperature_2m,
      rain:     cur.precipitation,
      wind:     cur.wind_speed_10m,
      humidity: cur.relative_humidity_2m,
      apparent: cur.apparent_temperature,
      gusts:    cur.wind_gusts_10m,
      cloud:    cur.cloud_cover,
      wcode:    cur.weather_code,
      forecast: (day.time || []).slice(0, 3).map((d, i) => ({
        date: d,
        max:  day.temperature_2m_max?.[i],
        min:  day.temperature_2m_min?.[i],
        rain: day.precipitation_sum?.[i] || 0,
        prob: day.precipitation_probability_max?.[i] || 0,
      })),
      live: true,
      ts:   Date.now(),
    };

    result.triggers = checkTriggers(result);
    return result;

  } catch (_) {
    return buildFallbackWeather(cityKey, city);
  }
}

/**
 * Realistic fallback when Open-Meteo is unreachable.
 */
function buildFallbackWeather(cityKey, city) {
  const bases = { mumbai:32, delhi:27, bangalore:28, chennai:33, hyderabad:31, kolkata:30, pune:29 };
  const temp  = bases[cityKey] || 30;
  const rain  = +(Math.random() * 1.5).toFixed(2);
  const wind  = +(8 + Math.random() * 12).toFixed(1);

  const result = {
    city:     city.name,
    cityKey,
    temp,
    rain,
    wind,
    humidity: (60 + Math.random() * 20) | 0,
    apparent: temp - 2,
    gusts:    +(wind * 1.3).toFixed(1),
    cloud:    (30 + Math.random() * 40) | 0,
    wcode:    2,
    forecast: [],
    live:     false,
    ts:       Date.now(),
  };

  result.triggers = checkTriggers(result);
  return result;
}

/**
 * Check whether current weather values breach any parametric
 * trigger threshold defined in State.thresholds.
 *
 * @param {WeatherData} w
 * @returns {{ fired: TriggerFired[], active: boolean }}
 */
function checkTriggers(w) {
  const t     = State.thresholds;
  const fired = [];

  if (w.rain > t.rain) fired.push({ type: 'heavy_rain',   val: w.rain, thresh: t.rain, unit: 'mm/h', color: 'cyan'   });
  if (w.temp > t.heat) fired.push({ type: 'extreme_heat', val: w.temp, thresh: t.heat, unit: '°C',   color: 'amber'  });
  if (w.wind > t.wind) fired.push({ type: 'high_wind',    val: w.wind, thresh: t.wind, unit: 'km/h', color: 'violet' });

  return { fired, active: fired.length > 0 };
}

/**
 * Refresh weather data for all cities simultaneously.
 * Updates State.weather and refreshes any visible UI.
 */
async function refreshWeather() {
  const statusEl = document.getElementById('liveStatus');
  if (statusEl) statusEl.textContent = 'Fetching...';

  const keys    = Object.keys(CITIES);
  const results = await Promise.all(keys.map(k => fetchWeather(k)));
  keys.forEach((k, i) => { State.weather[k] = results[i]; });

  const now = new Date();
  const ts  = `Updated ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

  const refreshEl = document.getElementById('lastRefresh');
  if (refreshEl) refreshEl.textContent = ts;
  if (statusEl)  statusEl.textContent  = 'Open-Meteo · Live';

  // Refresh whichever page is currently visible
  if (State.currentPage === 'dashboard') updateDashboardKPIs();
  if (State.currentPage === 'weather')   updateWeatherPage();
}

/** Called when the global city selector changes. */
function onCityChange(city) {
  State.selectedCity = city;
  if (State.currentPage === 'dashboard') updateDashboardKPIs();
}
