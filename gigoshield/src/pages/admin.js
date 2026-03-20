/* ============================================================
   GIGOSHIELD — pages/admin.js
   Admin panel: thresholds, liquidity pool, worker management,
   system health, and API configuration.
   ============================================================ */

function admin() {
  return `
  <div class="page-enter">
    <div class="section-header">
      <div class="section-eyebrow">ADMINISTRATION</div>
      <h1 class="section-title">Admin Panel</h1>
      <p class="section-sub">Platform configuration, worker management, and liquidity monitoring</p>
    </div>

    <!-- Thresholds + Liquidity -->
    <div class="admin-grid" style="margin-bottom:20px">

      <!-- Parametric Trigger Thresholds -->
      <div class="card">
        <div class="card-title" style="margin-bottom:16px">⚙️ Parametric Trigger Thresholds</div>
        ${[
          ['Rain Threshold', 'rain', 'mm/h', State.thresholds.rain],
          ['Heat Threshold', 'heat', '°C',   State.thresholds.heat],
          ['Wind Threshold', 'wind', 'km/h', State.thresholds.wind],
          ['AQI Threshold',  'aqi',  'AQI',  State.thresholds.aqi],
        ].map(([name, key, unit, val]) => `
          <div class="threshold-item">
            <div>
              <div class="threshold-name">${name}</div>
              <div class="threshold-unit">Unit: ${unit}</div>
            </div>
            <div style="display:flex;align-items:center;gap:8px">
              <input class="threshold-input" type="number" value="${val}" id="thresh_${key}"
                onchange="State.thresholds.${key}=+this.value;toast('${name} updated','success')">
              <span class="threshold-unit">${unit}</span>
            </div>
          </div>
        `).join('')}
        <button class="btn btn-primary btn-sm" style="margin-top:12px" onclick="saveThresholds()">
          <i data-lucide="save"></i> Save All Thresholds
        </button>
      </div>

      <!-- Liquidity Pool Monitor -->
      <div class="card">
        <div class="card-title" style="margin-bottom:16px">💧 Liquidity Pool Monitor</div>
        <div style="text-align:center;margin-bottom:16px">
          <div style="font-size:0.72rem;color:var(--text-sec);font-family:var(--font-mono);margin-bottom:4px">AVAILABLE POOL</div>
          <div style="font-family:var(--font-display);font-weight:800;font-size:2.4rem;color:var(--cyan)">₹24.8L</div>
          <div style="font-size:0.75rem;color:var(--text-sec)">of ₹50L total reserve</div>
        </div>
        <div class="progress-bar" style="height:12px;margin-bottom:16px">
          <div class="progress-fill" style="background:linear-gradient(90deg,var(--cyan),var(--green));width:49.6%"></div>
        </div>
        ${[
          ['Total Reserve',       '₹50,00,000', 'cyan'],
          ['Available',           '₹24,80,000', 'green'],
          ['Committed (pending)', '₹8,40,000',  'amber'],
          ['Disbursed this month','₹16,80,000', 'text-sec'],
        ].map(([l,v,c]) => `
          <div class="fin-row">
            <span class="fin-label">${l}</span>
            <span class="fin-val" style="color:var(--${c})">${v}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Worker Management Table -->
    <div class="card" style="margin-bottom:20px">
      <div class="card-header">
        <div class="card-title">👷 Worker Management</div>
        <span class="badge badge-cyan">1,247 Workers</span>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>Name</th><th>Platform</th><th>City</th><th>Trust</th>
            <th>Risk</th><th>Income</th><th>Claims</th><th>Status</th>
          </tr></thead>
          <tbody>
            ${[
              ['Ravi Kumar',   'Zomato',  'Mumbai',    0.89, 42, '₹7,200', 2, 'active'],
              ['Priya Menon',  'Swiggy',  'Delhi',     0.72, 58, '₹6,800', 1, 'active'],
              ['Arjun Singh',  'Zepto',   'Bengaluru', 0.18, 65, '₹5,800', 3, 'flagged'],
              ['Sneha Patil',  'Blinkit', 'Chennai',   0.91, 38, '₹8,400', 1, 'active'],
              ['Vikram Reddy', 'Amazon',  'Hyderabad', 0.66, 50, '₹9,000', 2, 'active'],
              ['Meera Iyer',   'Dunzo',   'Kolkata',   0.83, 44, '₹7,600', 0, 'active'],
              ['Suresh Gupta', 'Zomato',  'Pune',      0.77, 52, '₹6,200', 1, 'active'],
            ].map(([name, plat, city, trust, risk, income, numClaims, status]) => {
              const barColor = trust >= 0.8 ? 'var(--green)' : trust >= 0.5 ? 'var(--amber)' : 'var(--red)';
              return `
                <tr>
                  <td style="font-weight:600">${name}</td>
                  <td><span class="badge badge-gray">${plat}</span></td>
                  <td>${city}</td>
                  <td>
                    <div style="display:flex;align-items:center;gap:6px">
                      <div class="progress-bar" style="width:50px">
                        <div class="progress-fill" style="background:${barColor};width:${trust*100}%"></div>
                      </div>
                      <span class="mono" style="font-size:0.72rem">${trust.toFixed(2)}</span>
                    </div>
                  </td>
                  <td><span style="color:${risk>=65?'var(--red)':risk>=35?'var(--amber)':'var(--green)'}">${risk}/100</span></td>
                  <td class="mono">${income}</td>
                  <td>${numClaims}</td>
                  <td>${status === 'active'
                    ? '<span class="badge badge-green">Active</span>'
                    : '<span class="badge badge-red">Flagged</span>'}</td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- System Health + Stats + API Config -->
    <div class="grid-3">

      <!-- System Health -->
      <div class="card">
        <div class="card-title" style="margin-bottom:12px">❤️ System Health</div>
        ${[
          ['Open-Meteo API',  'var(--green)', '✅ 99.9% uptime'],
          ['Claim Engine',    'var(--green)', '✅ Processing < 3.5s avg'],
          ['Fraud Detector',  'var(--green)', '✅ 96.4% accuracy'],
          ['UPI Gateway',     'var(--amber)', '⏳ Phase 2'],
          ['WAQI AQI API',    'var(--amber)', '⏳ Phase 2'],
        ].map(([name, color, status]) => `
          <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:0.8rem">
            <span>${name}</span>
            <span style="color:${color};font-size:0.72rem">${status}</span>
          </div>
        `).join('')}
      </div>

      <!-- Platform Stats -->
      <div class="card">
        <div class="card-title" style="margin-bottom:12px">📊 Platform Stats</div>
        ${[
          ['Avg Claim Processing', '3.2s'],
          ['Avg Trust Score',      '0.74'],
          ['Fraud Detection Rate', '96.4%'],
          ['Claims Paid Today',    '8'],
          ['Claims Rejected Today','2'],
        ].map(([l,v]) => `
          <div class="fin-row">
            <span class="fin-label">${l}</span>
            <span class="fin-val text-cyan">${v}</span>
          </div>
        `).join('')}
      </div>

      <!-- API Configuration -->
      <div class="card">
        <div class="card-title" style="margin-bottom:12px">🔑 API Configuration</div>
        <div class="form-group">
          <label class="form-label">Gemini API Key</label>
          <input type="password" id="adminGeminiKey"
            placeholder="AIza..."
            value="${State.geminiKey ? '••••••••••' : ''}"
            onchange="State.geminiKey = this.value">
        </div>
        <button class="btn btn-primary btn-sm"
          onclick="State.geminiKey=document.getElementById('adminGeminiKey').value;toast('API key saved','success')">
          <i data-lucide="save"></i> Save
        </button>
        <div style="margin-top:12px;font-size:0.72rem;color:var(--text-sec)">
          Gemini Flash 2.5 · Used for AI assistant and claim NLP analysis
        </div>
      </div>

    </div>
  </div>`;
}

/* ── Admin helpers ──────────────────────────────────────── */

function initAdmin() {
  // Sync threshold inputs with current State values on render
  ['rain','heat','wind','aqi'].forEach(k => {
    const el = document.getElementById(`thresh_${k}`);
    if (el) el.value = State.thresholds[k];
  });
}

function saveThresholds() {
  ['rain','heat','wind','aqi'].forEach(k => {
    const el = document.getElementById(`thresh_${k}`);
    if (el) State.thresholds[k] = +el.value;
  });
  toast('All thresholds saved successfully', 'success');
}
