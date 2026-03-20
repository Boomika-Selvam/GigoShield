/* ============================================================
   GIGOSHIELD — pages/dashboard.js
   Real-time operations dashboard with live weather KPIs,
   trust score simulator, trigger monitor, and charts.
   ============================================================ */

function dashboard() {
  const wd   = State.weather[State.selectedCity];
  const temp = wd?.temp   ?? '—';
  const rain = wd?.rain   ?? '—';
  const wind = wd?.wind   ?? '—';
  const hum  = wd?.humidity ?? '—';

  return `
  <div class="page-enter">

    <!-- Header -->
    <div class="section-actions">
      <div class="section-header" style="margin:0">
        <div class="section-eyebrow">REAL-TIME INTELLIGENCE</div>
        <h1 class="section-title">Operations Dashboard</h1>
        <p class="section-sub">Live data from Open-Meteo API · Auto-refreshes every 5 minutes</p>
      </div>
      <span class="live-dot">LIVE</span>
    </div>

    <!-- Weather Alert Banner (hidden until triggered) -->
    <div id="dashAlert" style="display:none" class="alert-banner">
      <i data-lucide="alert-triangle"></i>
      <div class="alert-banner-text">
        <strong id="dashAlertTitle">⚠️ Parametric Trigger Active</strong>
        <p id="dashAlertBody">Checking...</p>
      </div>
      <button class="btn btn-danger btn-sm" onclick="navigate('claims')">File Claim →</button>
    </div>

    <!-- KPI Row -->
    <div class="grid-4 stagger" id="kpiRow" style="margin-bottom:20px">
      <div class="metric-card">
        <div class="mc-icon amber"><i data-lucide="thermometer"></i></div>
        <div class="mc-label">Temperature</div>
        <div class="mc-value" id="kpiTemp" style="color:var(--amber)">${temp !== '—' ? temp + '°C' : '—'}</div>
        <div class="mc-sub">Threshold: 40°C</div>
      </div>
      <div class="metric-card">
        <div class="mc-icon cyan"><i data-lucide="cloud-rain"></i></div>
        <div class="mc-label">Precipitation</div>
        <div class="mc-value" id="kpiRain" style="color:var(--cyan)">${rain !== '—' ? rain + ' mm' : '—'}</div>
        <div class="mc-sub">mm/hour · threshold 10</div>
      </div>
      <div class="metric-card">
        <div class="mc-icon green"><i data-lucide="wind"></i></div>
        <div class="mc-label">Wind Speed</div>
        <div class="mc-value" id="kpiWind" style="color:var(--green)">${wind !== '—' ? wind + ' km/h' : '—'}</div>
        <div class="mc-sub">threshold 60 km/h</div>
      </div>
      <div class="metric-card">
        <div class="mc-icon violet"><i data-lucide="droplets"></i></div>
        <div class="mc-label">Humidity</div>
        <div class="mc-value" id="kpiHumid" style="color:var(--violet)">${hum !== '—' ? hum + '%' : '—'}</div>
        <div class="mc-sub">Relative humidity</div>
      </div>
    </div>

    <!-- Trust Simulator + Trigger Monitor -->
    <div class="grid-2" style="margin-bottom:20px">

      <!-- Trust Score Simulator -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">🧠 Trust Score Simulator</div>
            <div class="card-sub">Adjust signals — watch AI decide in real-time</div>
          </div>
          <select id="scenarioSelect" class="city-select" style="font-size:0.75rem" onchange="applyScenario(this.value)">
            <option value="">Custom</option>
            <option value="genuine">Genuine Worker</option>
            <option value="network_drop">Network Drop</option>
            <option value="spoofed">GPS Spoofed</option>
          </select>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px">
          ${[
            ['mc', 'Movement Consistency', 75, 'Delivery-pattern velocity check'],
            ['as', 'Activity Score',       80, 'Recent platform order completions'],
            ['pm', 'Peer Match',           90, 'Zone-level peer comparison'],
            ['ch', 'Claim History',        85, '12-week behavioral track record'],
          ].map(([k, label, val, hint]) => `
            <div>
              <div style="display:flex;justify-content:space-between;font-size:0.72rem;color:var(--text-sec);margin-bottom:5px">
                <span>${label}</span>
                <span id="lbl_${k}" class="mono text-cyan">${val}%</span>
              </div>
              <input type="range" min="0" max="100" value="${val}" id="sl_${k}"
                oninput="document.getElementById('lbl_${k}').textContent=this.value+'%';computeTrust()"
                style="width:100%;margin-bottom:4px">
              <div style="font-size:0.62rem;color:var(--text-muted)">${hint}</div>
            </div>
          `).join('')}
        </div>

        <div id="trustResult" style="padding:14px;background:var(--surface2);border-radius:var(--radius-sm);border:1px solid var(--border)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
            <span style="font-size:0.78rem;color:var(--text-sec)">Trust Score</span>
            <span id="trustLabel" class="badge badge-green">Instant Payout</span>
          </div>
          <div style="font-family:var(--font-display);font-weight:800;font-size:2.2rem;color:var(--green)" id="trustScore">0.84</div>
          <div style="font-size:0.7rem;color:var(--text-sec);font-family:var(--font-mono);margin-top:6px" id="trustFormula">
            0.30×0.75 + 0.30×0.80 + 0.20×0.90 + 0.20×0.85
          </div>
          <div class="progress-bar" style="margin-top:10px">
            <div class="progress-fill" id="trustBar" style="background:var(--green);width:84%"></div>
          </div>
        </div>
      </div>

      <!-- Live Trigger Monitor -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">⚡ Live Trigger Monitor</div>
          <div class="card-sub" id="triggerCity">Mumbai</div>
        </div>
        <div id="triggerList">
          <div style="color:var(--text-muted);font-size:0.8rem;text-align:center;padding:24px">Loading weather data...</div>
        </div>
        <div style="margin-top:16px">
          <div style="font-size:0.72rem;color:var(--text-sec);font-family:var(--font-mono);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px">
            3-Day Forecast
          </div>
          <div id="forecastRow" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
            <div style="color:var(--text-muted);font-size:0.75rem;grid-column:span 3">Loading...</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid-2" style="margin-bottom:20px">
      <div class="chart-card">
        <div class="card-header">
          <div class="card-title">📈 Claims This Week</div>
          <span class="badge badge-green">Last 7 Days</span>
        </div>
        <canvas id="weeklyClaimsChart"></canvas>
      </div>
      <div class="chart-card">
        <div class="card-header">
          <div class="card-title">🏙️ City Risk Levels</div>
        </div>
        <canvas id="cityRiskChart"></canvas>
      </div>
    </div>

    <!-- Recent Claims Table -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">📋 Recent Claims</div>
        <button class="btn btn-ghost btn-sm" onclick="navigate('claims')">View All →</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>Claim ID</th><th>Worker</th><th>Trigger</th><th>City</th>
            <th>Loss</th><th>Payout</th><th>Trust</th><th>Status</th>
          </tr></thead>
          <tbody>
            ${claimsDB.slice(0, 5).map(c => {
              const barColor = c.trust >= 0.8 ? 'var(--green)' : c.trust >= 0.5 ? 'var(--amber)' : 'var(--red)';
              return `
                <tr>
                  <td class="mono text-cyan" style="font-size:0.75rem">${c.id}</td>
                  <td style="font-weight:600">${c.worker}</td>
                  <td><span class="badge badge-amber">${c.trigger.replace('_', ' ')}</span></td>
                  <td class="text-sec">${c.city}</td>
                  <td class="text-amber">${c.loss}%</td>
                  <td class="text-green mono">₹${c.payout.toLocaleString()}</td>
                  <td>
                    <div class="progress-bar" style="width:60px">
                      <div class="progress-fill" style="background:${barColor};width:${c.trust * 100}%"></div>
                    </div>
                  </td>
                  <td>${statusBadge(c.status)}</td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

  </div>`;
}

/* ── Dashboard initialisation (called after render) ─────── */

function initDashboard() {
  computeTrust();
  updateDashboardKPIs();
  initDashboardCharts();
}

/* ── Trust Score live compute ───────────────────────────── */

function computeTrust() {
  const mc  = (+document.getElementById('sl_mc').value) / 100;
  const as_ = (+document.getElementById('sl_as').value) / 100;
  const pm  = (+document.getElementById('sl_pm').value) / 100;
  const ch  = (+document.getElementById('sl_ch').value) / 100;

  const { score, label, color, badgeCls } = computeTrustScore(mc, as_, pm, ch);

  const scoreEl = document.getElementById('trustScore');
  if (!scoreEl) return;

  scoreEl.textContent = score.toFixed(2);
  scoreEl.style.color = color;

  document.getElementById('trustLabel').className   = `badge ${badgeCls}`;
  document.getElementById('trustLabel').textContent = label;
  document.getElementById('trustBar').style.width      = (score * 100) + '%';
  document.getElementById('trustBar').style.background = color;
  document.getElementById('trustFormula').textContent  =
    `0.30×${mc.toFixed(2)} + 0.30×${as_.toFixed(2)} + 0.20×${pm.toFixed(2)} + 0.20×${ch.toFixed(2)}`;

  return score;
}

function applyScenario(scenario) {
  const preset = SCENARIO_PRESETS[scenario];
  if (!preset) return;
  const vals = [preset.mc, preset.as_, preset.pm, preset.ch];
  ['mc','as','pm','ch'].forEach((k, i) => {
    const sl  = document.getElementById(`sl_${k}`);
    const lbl = document.getElementById(`lbl_${k}`);
    if (sl) { sl.value = Math.round(vals[i] * 100); lbl.textContent = sl.value + '%'; }
  });
  computeTrust();
}

/* ── KPI updates ────────────────────────────────────────── */

function updateDashboardKPIs() {
  const wd = State.weather[State.selectedCity];
  if (!wd) return;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('kpiTemp',  wd.temp?.toFixed(1) + '°C');
  set('kpiRain',  wd.rain?.toFixed(2) + ' mm');
  set('kpiWind',  wd.wind?.toFixed(1) + ' km/h');
  set('kpiHumid', wd.humidity + '%');
  set('triggerCity', wd.city);

  // Alert banner
  const alertEl = document.getElementById('dashAlert');
  if (alertEl) {
    if (wd.triggers?.active) {
      const f = wd.triggers.fired[0];
      alertEl.style.display = 'flex';
      set('dashAlertTitle', `⚠️ ${f.type.replace(/_/g,' ')} trigger active in ${wd.city}`);
      set('dashAlertBody',  `${f.type.replace(/_/g,' ')} = ${f.val} (threshold: ${f.thresh} ${f.unit}). Workers in this city may be eligible for automatic payout.`);
    } else {
      alertEl.style.display = 'none';
    }
  }

  // Trigger list
  const tl = document.getElementById('triggerList');
  if (tl) {
    const items = [
      { emoji:'☔', name:'Heavy Rain',   val:wd.rain, thresh:State.thresholds.rain, unit:'mm/h', color:'cyan' },
      { emoji:'🌡️', name:'Extreme Heat', val:wd.temp, thresh:State.thresholds.heat, unit:'°C',   color:'amber' },
      { emoji:'💨', name:'High Wind',    val:wd.wind, thresh:State.thresholds.wind, unit:'km/h', color:'violet' },
    ];

    tl.innerHTML = items.map(item => {
      const active = item.val > item.thresh;
      return `
        <div class="trigger-row">
          <div class="trigger-icon" style="background:var(--${item.color}-dim);color:var(--${item.color})">${item.emoji}</div>
          <div class="trigger-info">
            <div class="trigger-name">${item.name}</div>
            <div class="trigger-thresh">Threshold: ${item.thresh} ${item.unit}</div>
          </div>
          <div class="trigger-value" style="color:${active?'var(--red)':'var(--'+item.color+')'}">
            ${item.val?.toFixed(1) || '—'} ${item.unit}
          </div>
          <span class="badge badge-${active?'red':'gray'}">${active?'🔴 ACTIVE':'OK'}</span>
        </div>`;
    }).join('');

    // Forecast row
    const fr = document.getElementById('forecastRow');
    if (fr && wd.forecast?.length) {
      fr.innerHTML = wd.forecast.map(f => `
        <div style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:10px;text-align:center">
          <div style="font-size:0.65rem;color:var(--text-sec);font-family:var(--font-mono);margin-bottom:4px">
            ${new Date(f.date).toLocaleDateString('en-IN', { weekday:'short' })}
          </div>
          <div style="font-weight:700;font-size:0.9rem">${f.max?.toFixed(0) ?? '—'}°C</div>
          <div style="font-size:0.65rem;color:var(--cyan)">💧${f.prob ?? 0}%</div>
        </div>
      `).join('');
    } else if (fr) {
      fr.innerHTML = '<div style="color:var(--text-muted);font-size:0.75rem;grid-column:span 3">Forecast not available</div>';
    }
  }
}

/* ── Dashboard Charts ───────────────────────────────────── */

function initDashboardCharts() {
  const gridOpts = {
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color:'rgba(255,255,255,0.04)' }, ticks: { color:'#8892a4', font:{size:10} } },
      y: { grid: { color:'rgba(255,255,255,0.04)' }, ticks: { color:'#8892a4', font:{size:10} } },
    },
  };

  new Chart(document.getElementById('weeklyClaimsChart'), {
    type: 'bar',
    data: {
      labels: ['W1','W2','W3','W4','W5','W6','W7','W8'],
      datasets: [
        { label:'Paid',     data:[3,5,2,7,4,6,8,5], backgroundColor:'rgba(16,185,129,0.4)', borderColor:'#10b981', borderWidth:1, borderRadius:4 },
        { label:'Rejected', data:[1,0,2,1,0,1,0,2], backgroundColor:'rgba(239,68,68,0.4)',  borderColor:'#ef4444', borderWidth:1, borderRadius:4 },
      ],
    },
    options: { ...gridOpts, plugins: { legend: { display:true, labels:{color:'#8892a4',font:{size:10}} } } },
  });

  new Chart(document.getElementById('cityRiskChart'), {
    type: 'radar',
    data: {
      labels: Object.values(CITIES).map(c => c.name),
      datasets: [{ label:'Risk Score', data:[82,75,68,85,78,80,72], backgroundColor:'rgba(6,182,212,0.1)', borderColor:'#06b6d4', borderWidth:2, pointBackgroundColor:'#06b6d4' }],
    },
    options: {
      plugins: { legend: { display:false } },
      scales: { r: { grid:{color:'rgba(255,255,255,0.06)'}, ticks:{color:'#8892a4',font:{size:9},backdropColor:'transparent'}, pointLabels:{color:'#8892a4',font:{size:10}} } },
    },
  });
}
