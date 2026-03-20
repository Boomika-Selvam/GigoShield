/* ============================================================
   GIGOSHIELD — pages/landing.js
   Overview / hero page.
   ============================================================ */

function landing() {
  return `
  <div class="page-enter">

    <!-- Hero -->
    <div class="hero-section">
      <div class="hero-badge">⬡ INSURANCE </div>
      <h1 class="hero-title">Protecting India's<br>Gig Economy Backbone</h1>
      <p class="hero-sub">AI-powered parametric insurance for delivery partners. Zero paperwork. Instant payouts. Real-time fraud detection. Live weather data from Open-Meteo.</p>
      <div class="hero-cta">
        <button class="btn btn-primary" onclick="navigate('onboarding')" style="padding:12px 28px;font-size:0.9rem">
          <i data-lucide="user-plus"></i> Get Insured in 60s
        </button>
        <button class="btn btn-ghost" onclick="navigate('dashboard')" style="padding:12px 28px;font-size:0.9rem">
          <i data-lucide="layout-dashboard"></i> View Dashboard
        </button>
        <button class="btn btn-ghost" onclick="openGeminiModal()" style="padding:12px 28px;font-size:0.9rem">
          <i data-lucide="sparkles"></i> Enable Gemini AI
        </button>
      </div>
    </div>

    <!-- Live Stats -->
    <div class="grid-4 stagger" style="margin-bottom:36px">
      ${[
        ['1,247', 'Active Workers',      'green',  'users'],
        ['₹18.4L','Premiums Collected',  'amber',  'trending-up'],
        ['₹11.2L','Payouts Processed',   'cyan',   'zap'],
        ['₹3.8L', 'Fraud Prevented',     'red',    'shield'],
      ].map(([v, l, c, icon]) => `
        <div class="metric-card">
          <div class="mc-icon ${c}"><i data-lucide="${icon}"></i></div>
          <div class="mc-label">${l}</div>
          <div class="mc-value" style="color:var(--${c})">${v}</div>
        </div>
      `).join('')}
    </div>

    <!-- Triggers + Anti-Fraud -->
    <div class="grid-2" style="margin-bottom:28px">

      <!-- Parametric Triggers -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">⚡ Parametric Triggers</div>
            <div class="card-sub">Auto-claim when thresholds are breached — no human approval needed</div>
          </div>
          <span class="live-dot">REAL-TIME</span>
        </div>
        <div class="trigger-table">
          ${[
            ['☔', 'Rain',         '> 10 mm/h',       'cyan',   'auto'],
            ['🌡️', 'Extreme Heat', '> 40°C',           'amber',  'auto'],
            ['💨', 'High Wind',    '> 60 km/h',        'violet', 'auto'],
            ['💨', 'Severe AQI',   '> 300 AQI',        'red',    'phase2'],
            ['📵', 'Gov. Curfew',  'Official notice',  'green',  'phase2'],
            ['📱', 'App Outage',   '> 1hr downtime',   'cyan',   'phase2'],
          ].map(([emoji, name, thresh, color, phase]) => `
            <div class="trigger-row">
              <div class="trigger-icon" style="background:var(--${color}-dim);color:var(--${color})">${emoji}</div>
              <div class="trigger-info">
                <div class="trigger-name">${name}</div>
                <div class="trigger-thresh">${thresh} ·
                  <span style="color:var(--${color})">${phase === 'auto' ? 'Auto-claim enabled' : 'Phase 2'}</span>
                </div>
              </div>
              <span class="badge badge-${phase === 'auto' ? 'green' : 'gray'}">
                ${phase === 'auto' ? '✅ Live' : 'Phase 2'}
              </span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Anti-Fraud signals -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">🛡️ Anti-Fraud Defense</div>
          <div class="card-sub">Multi-signal behavioral validation — not just GPS</div>
        </div>
        <div class="signal-grid">
          ${[
            ['📡', 'GPS Road Snap',  'OSM road validation'],
            ['📳', 'Accelerometer', 'Physical vibration pattern'],
            ['🌐', 'IP Clustering', 'Subnet fraud ring detection'],
            ['⏱️', 'Claim Timing',  'Synchronized mass-claim detect'],
            ['📦', 'Order Activity','Platform API last N orders'],
            ['📱', 'Device FP',     'Hardware + SIM hash'],
            ['📶', 'Cell Tower',    'Network vs GPS match'],
            ['🏃', 'Speed Entropy', 'Velocity variation analysis'],
          ].map(([icon, name, desc]) => `
            <div class="signal-row">
              <span class="signal-icon">${icon}</span>
              <div>
                <div class="signal-name">${name}</div>
                <div style="font-size:0.65rem;color:var(--text-sec)">${desc}</div>
              </div>
              <span class="signal-pass">✓ Active</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Feature Cards -->
    <div class="section-header">
      <div class="section-eyebrow">COVERAGE FEATURES</div>
      <h2 class="section-title" style="font-size:1.4rem">Everything a Gig Worker Needs</h2>
    </div>
    <div class="feature-grid stagger">
      ${[
        ['🌧️', 'Live Weather Triggers',  'Open-Meteo API powers real-time parametric triggers across 7 cities. No manual claim filing ever.'],
        ['🧠', 'AI Trust Scoring',        'Behavioral signals: movement, activity, peer match, history. Spoofed GPS fails instantly.'],
        ['⚡', 'Instant UPI Payouts',     'High-trust claims resolved in under 5 seconds. Partial payouts for borderline cases.'],
        ['📱', 'Zero Paperwork',           '3-step onboarding, policy in 60 seconds, automated claims, no agent required.'],
        ['🔍', 'Fraud Ring Detection',     'IP subnet clustering, device fingerprinting, timing analysis catches 97% of syndicate attacks.'],
        ['📊', 'Insurer Dashboard',        'Real-time loss ratio, liquidity pool, risk forecast. Complete transparency for underwriters.'],
      ].map(([icon, title, desc]) => `
        <div class="feature-card">
          <div class="feature-icon">${icon}</div>
          <div class="feature-title">${title}</div>
          <div class="feature-desc">${desc}</div>
        </div>
      `).join('')}
    </div>

    <!-- Phase Roadmap -->
    <div class="card" style="margin-top:28px">
      <div class="card-title" style="margin-bottom:16px">🗓️ DEVTrails Phase Roadmap</div>
      <div class="grid-3">
        ${[
          ['Phase 1', '✅ Complete',    'Live weather integration, trust engine, fraud simulation, full SPA UI, AI assistant', 'green'],
          ['Phase 2', '🔄 Mar 21–Apr 4','FastAPI + PostgreSQL, real KYC, Razorpay UPI, Celery triggers, WAQI AQI', 'amber'],
          ['Phase 3', '🎯 Apr 5–17',   'XGBoost income predictor, Isolation Forest fraud ML, HuggingFace anomaly detection', 'violet'],
        ].map(([phase, status, desc, color]) => `
          <div style="padding:16px;background:var(--surface2);border-radius:var(--radius);border:1px solid var(--border)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
              <div style="font-family:var(--font-display);font-weight:700">${phase}</div>
              <span class="badge badge-${color}">${status}</span>
            </div>
            <div style="font-size:0.75rem;color:var(--text-sec);line-height:1.6">${desc}</div>
          </div>
        `).join('')}
      </div>
    </div>

  </div>`;
}
