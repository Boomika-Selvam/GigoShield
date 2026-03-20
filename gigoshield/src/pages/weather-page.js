/* ============================================================
   GIGOSHIELD — pages/weather-page.js
   Live weather monitor for all 7 Indian cities.
   ============================================================ */

function weather() {
  return `
  <div class="page-enter">
    <div class="section-actions">
      <div class="section-header" style="margin:0">
        <div class="section-eyebrow">WEATHER INTELLIGENCE</div>
        <h1 class="section-title">Live Weather Monitor</h1>
        <p class="section-sub">Real-time data for 7 major Indian cities · Open-Meteo API</p>
      </div>
      <button class="btn btn-primary" onclick="refreshWeather().then(updateWeatherPage)">
        <i data-lucide="refresh-cw"></i> Refresh All
      </button>
    </div>

    <!-- City Cards -->
    <div class="city-weather-grid stagger" id="cityWeatherGrid">
      ${Object.entries(CITIES).map(([key, city]) => buildCityCard(key, city)).join('')}
    </div>

    <!-- India Risk Map -->
    <div class="card" style="margin-bottom:20px">
      <div class="card-header">
        <div class="card-title">🗺️ India Weather Risk Map</div>
        <span class="live-dot">LIVE</span>
      </div>
      <div id="weather-map-container">
        <div class="india-map-wrap" style="position:relative">
          <svg viewBox="0 0 300 380" style="width:100%;max-height:420px;opacity:0.6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M80,20 L220,20 L240,60 L250,100 L240,140 L260,180 L250,220 L230,260 L200,300 L180,340 L160,360 L140,370 L120,360 L100,340 L80,300 L60,260 L40,220 L30,180 L40,140 L30,100 L40,60 Z"
              fill="rgba(6,182,212,0.05)" stroke="rgba(6,182,212,0.2)" stroke-width="1.5"/>
          </svg>
          ${Object.entries(CITIES).map(([key, city]) => {
            const w     = State.weather[key];
            const color = w?.triggers?.active ? '#ef4444' : w?.temp > 35 ? '#f59e0b' : '#10b981';
            return `<div class="city-dot"
              style="left:${city.x};top:${city.y};background:${color};border-color:${color};box-shadow:0 0 8px ${color}40"
              data-city="${city.name} ${w?.temp?.toFixed(1) ?? ''}°C ${w?.triggers?.active ? '⚡' : ''}"
              onclick="document.getElementById('globalCitySelect').value='${key}';onCityChange('${key}')"></div>`;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- Detail Table -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">📊 City Weather Details & Trigger Status</div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>City</th><th>Temp</th><th>Rain</th><th>Wind</th><th>Humidity</th>
            <th>Condition</th><th>Rain Trigger</th><th>Heat Trigger</th><th>Wind Trigger</th><th>Payout?</th>
          </tr></thead>
          <tbody id="weatherTableBody">
            ${buildWeatherRows()}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
}

/* ── Helper: single city card HTML ─────────────────────── */
function buildCityCard(key, city) {
  const w = State.weather[key];
  return `
    <div class="city-weather-card ${w?.triggers?.active ? 'trigger-active' : ''}"
         onclick="document.getElementById('globalCitySelect').value='${key}';onCityChange('${key}')">
      <div class="cwc-name">${city.name} ${w?.triggers?.active ? '🔴' : ''}</div>
      <div class="cwc-temp" style="color:${w?.temp > 40 ? 'var(--red)' : w?.temp > 35 ? 'var(--amber)' : 'var(--text)'}">
        ${w?.temp?.toFixed(1) ?? '—'}°C
      </div>
      <div class="cwc-details">
        <span>💧 ${w?.rain?.toFixed(1) ?? '—'}mm</span>
        <span>💨 ${w?.wind?.toFixed(0) ?? '—'}km/h</span>
        <span>💦 ${w?.humidity ?? '—'}%</span>
      </div>
      ${w?.triggers?.fired?.length ? `<div style="margin-top:8px"><span class="badge badge-red" style="font-size:0.6rem">⚡ TRIGGER ACTIVE</span></div>` : ''}
    </div>`;
}

/* ── Helper: weather detail table rows ─────────────────── */
function buildWeatherRows() {
  const t = State.thresholds;
  return Object.entries(CITIES).map(([key, city]) => {
    const w       = State.weather[key];
    const rainOk  = w && w.rain > t.rain;
    const heatOk  = w && w.temp > t.heat;
    const windOk  = w && w.wind > t.wind;
    const anyOk   = rainOk || heatOk || windOk;
    const act     = '<span class="badge badge-red">🔴 ACTIVE</span>';
    const ok      = '<span class="badge badge-gray">OK</span>';

    return `
      <tr>
        <td style="font-weight:600">${city.name}</td>
        <td style="color:${w?.temp>40?'var(--red)':w?.temp>35?'var(--amber)':'var(--text)'}">${w?.temp?.toFixed(1) ?? '—'}°C</td>
        <td class="text-cyan">${w?.rain?.toFixed(2) ?? '—'} mm</td>
        <td>${w?.wind?.toFixed(1) ?? '—'} km/h</td>
        <td>${w?.humidity ?? '—'}%</td>
        <td style="font-size:0.75rem">${WMO_CODES[w?.wcode] ?? '—'}</td>
        <td>${rainOk ? act : ok}</td>
        <td>${heatOk ? act : ok}</td>
        <td>${windOk ? act : ok}</td>
        <td>${anyOk ? '<span class="badge badge-green">✅ Eligible</span>' : ok}</td>
      </tr>`;
  }).join('');
}

/* ── Update called after refresh ───────────────────────── */
function initWeather() { updateWeatherPage(); }

function updateWeatherPage() {
  const grid = document.getElementById('cityWeatherGrid');
  if (!grid) return;

  grid.innerHTML = Object.entries(CITIES).map(([key, city]) => buildCityCard(key, city)).join('');

  const tbody = document.getElementById('weatherTableBody');
  if (tbody) tbody.innerHTML = buildWeatherRows();

  lucide.createIcons();
}
