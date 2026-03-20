/* ============================================================
   GIGOSHIELD — pages/analytics.js
   Platform analytics: charts, risk model, financial model.
   Three tabs: Overview | Risk Model | Financial
   ============================================================ */

function analytics() {
  return `
  <div class="page-enter">
    <div class="section-actions">
      <div class="section-header" style="margin:0">
        <div class="section-eyebrow">ANALYTICS & INSIGHTS</div>
        <h1 class="section-title">Platform Analytics</h1>
        <p class="section-sub">Real-time metrics, risk model, and financial intelligence</p>
      </div>
      <div style="display:flex;gap:8px">
        <button class="tab-btn active" onclick="switchAnalyticsTab('overview',this)">Overview</button>
        <button class="tab-btn" onclick="switchAnalyticsTab('risk',this)">Risk Model</button>
        <button class="tab-btn" onclick="switchAnalyticsTab('financial',this)">Financial</button>
      </div>
    </div>

    <!-- KPI Row -->
    <div class="grid-4 stagger" style="margin-bottom:24px">
      ${[
        ['₹18.4L','Premiums Collected', '+12%','up',  'amber', 'trending-up'],
        ['₹11.2L','Total Payouts',      '-3%', 'down','green', 'arrow-down-circle'],
        ['60.8%', 'Loss Ratio',         '+2.1%','up', 'cyan',  'percent'],
        ['₹3.8L', 'Fraud Prevented',    '+28%','up',  'red',   'shield'],
      ].map(([v,l,trend,dir,c,icon]) => `
        <div class="metric-card">
          <div class="mc-icon ${c}"><i data-lucide="${icon}"></i></div>
          <div class="mc-label">${l}</div>
          <div class="mc-value" style="color:var(--${c})">${v}</div>
          <div class="mc-sub">
            <span class="${dir==='up'?'trend-up':'trend-down'}">${dir==='up'?'↑':'↓'} ${trend}</span> vs last month
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Tab: Overview -->
    <div id="tab_overview">
      <div class="grid-2" style="margin-bottom:20px">
        <div class="chart-card">
          <div class="card-header">
            <div class="card-title">📈 Weekly Premium vs Payout</div>
            <span class="badge badge-green">Last 8 Weeks</span>
          </div>
          <canvas id="premPayChart"></canvas>
        </div>
        <div class="chart-card">
          <div class="card-header">
            <div class="card-title">🏙️ City-wise Claims Distribution</div>
          </div>
          <canvas id="cityClaimsChart"></canvas>
        </div>
      </div>
      <div class="grid-2">
        <div class="chart-card">
          <div class="card-header">
            <div class="card-title">📊 Trust Score Distribution</div>
          </div>
          <canvas id="trustDistChart"></canvas>
        </div>
        <div class="chart-card">
          <div class="card-header">
            <div class="card-title">🚦 Claim Status Breakdown</div>
          </div>
          <canvas id="claimStatusChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Tab: Risk Model (hidden by default) -->
    <div id="tab_risk" style="display:none">
      <div class="grid-2">
        <div class="card">
          <div class="card-title" style="margin-bottom:16px">🧮 Risk Score Formula</div>
          <div style="font-family:var(--font-mono);font-size:0.75rem;line-height:2;color:var(--text-sec)">
            <div style="color:var(--text);font-size:0.9rem;margin-bottom:12px">
              Risk = Zone Base + Platform Mod + Experience Mod
            </div>
            ${[
              ['Zone (Mumbai / High)',   '82 pts'],
              ['Zone (Mumbai / Medium)', '55 pts'],
              ['Zone (Bangalore / Low)', '15 pts'],
              ['Platform: Zomato / Swiggy', '+5 pts'],
              ['Platform: Zepto / Blinkit', '+3 pts'],
              ['Experience < 3 months',  '+10 pts'],
              ['Experience > 10 months', '+0 pts'],
            ].map(([l,v]) => `
              <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--border)">
                <span>${l}</span>
                <span style="color:var(--cyan)">${v}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="chart-card">
          <div class="card-header">
            <div class="card-title">📊 City Risk Heatmap</div>
          </div>
          <canvas id="cityRiskAnalyticsChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Tab: Financial (hidden by default) -->
    <div id="tab_financial" style="display:none">
      <div class="grid-2">
        <div class="card">
          <div class="card-title" style="margin-bottom:16px">💰 Financial Model</div>
          ${[
            ['Active Workers',            '1,247'],
            ['Avg Weekly Premium',        '₹87.50'],
            ['Total Weekly Premium Pool', '₹1,09,132'],
            ['Monthly Premium Revenue',   '₹4,72,571'],
            ['Monthly Payouts',           '₹2,87,346'],
            ['Monthly Loss Ratio',        '60.8%'],
            ['Liquidity Pool',            '₹24,80,000'],
            ['Fraud Claims Prevented',    '₹38,000/mo'],
            ['Break-even Loss Ratio',     '75%'],
          ].map(([l,v]) => `
            <div class="fin-row">
              <span class="fin-label">${l}</span>
              <span class="fin-val">${v}</span>
            </div>
          `).join('')}
        </div>
        <div class="chart-card">
          <div class="card-header">
            <div class="card-title">📈 Platform Revenue Projection</div>
          </div>
          <canvas id="revenueChart"></canvas>
        </div>
      </div>
    </div>

  </div>`;
}

/* ── Init & tab switching ───────────────────────────────── */

function initAnalytics() {
  drawAnalyticsCharts();
}

function switchAnalyticsTab(tab, btn) {
  ['overview', 'risk', 'financial'].forEach(t => {
    const el = document.getElementById(`tab_${t}`);
    if (el) el.style.display = (t === tab) ? '' : 'none';
  });
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  // Redraw charts when switching into a tab that has canvases
  if (tab === 'risk' || tab === 'financial') {
    setTimeout(drawAnalyticsCharts, 100);
  }
}

/* ── Chart drawing ──────────────────────────────────────── */

function drawAnalyticsCharts() {
  const weeks    = ['W1','W2','W3','W4','W5','W6','W7','W8'];
  const cityNames = Object.values(CITIES).map(c => c.name);

  // Shared axis defaults
  const axisOpts = {
    plugins: { legend: { labels: { color: '#8892a4', font: { size: 10 } } } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8892a4', font: { size: 10 } } },
      y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8892a4', font: { size: 10 } } },
    },
  };

  const mk = (id, cfg) => {
    const el = document.getElementById(id);
    if (!el) return;
    // Destroy previous instance if any
    const prev = Chart.getChart(el);
    if (prev) prev.destroy();
    return new Chart(el, cfg);
  };

  // ── Overview Tab Charts ──────────────────────────────────
  mk('premPayChart', {
    type: 'line',
    data: {
      labels: weeks,
      datasets: [
        { label:'Premium', data:[85000,90000,94000,88000,97000,102000,109000,112000], borderColor:'#f59e0b', backgroundColor:'rgba(245,158,11,0.08)', tension:0.4, fill:true },
        { label:'Payout',  data:[48000,55000,60000,43000,62000,58000,72000,69000],   borderColor:'#10b981', backgroundColor:'rgba(16,185,129,0.08)',  tension:0.4, fill:true },
      ],
    },
    options: axisOpts,
  });

  mk('cityClaimsChart', {
    type: 'doughnut',
    data: {
      labels: cityNames,
      datasets: [{
        data: [28,22,18,15,9,5,3],
        backgroundColor: ['#06b6d4','#f59e0b','#10b981','#ef4444','#8b5cf6','#ec4899','#84cc16'],
        borderWidth: 0,
      }],
    },
    options: { plugins: { legend: { position:'right', labels:{ color:'#8892a4', font:{size:10} } } } },
  });

  mk('trustDistChart', {
    type: 'bar',
    data: {
      labels: ['0–0.3','0.3–0.5','0.5–0.7','0.7–0.8','0.8–0.9','0.9–1.0'],
      datasets: [{
        label: 'Workers',
        data: [42,86,234,318,412,155],
        backgroundColor: ['#ef4444','#ef4444','#f59e0b','#f59e0b','#10b981','#10b981'],
        borderRadius: 4,
      }],
    },
    options: { ...axisOpts, plugins: { legend: { display: false } } },
  });

  mk('claimStatusChart', {
    type: 'pie',
    data: {
      labels: ['Paid','Partial','Processing','Rejected'],
      datasets: [{
        data: [72,15,8,5],
        backgroundColor: ['#10b981','#f59e0b','#06b6d4','#ef4444'],
        borderWidth: 0,
      }],
    },
    options: { plugins: { legend: { position:'right', labels:{ color:'#8892a4', font:{size:10} } } } },
  });

  // ── Risk Tab Charts ──────────────────────────────────────
  mk('cityRiskAnalyticsChart', {
    type: 'bar',
    data: {
      labels: cityNames,
      datasets: [
        { label:'High Zone',   data:[82,75,68,85,78,80,72], backgroundColor:'rgba(239,68,68,0.5)', borderColor:'#ef4444', borderWidth:1, borderRadius:4 },
        { label:'Medium Zone', data:[55,48,42,60,50,58,45], backgroundColor:'rgba(245,158,11,0.4)', borderColor:'#f59e0b', borderWidth:1, borderRadius:4 },
      ],
    },
    options: axisOpts,
  });

  // ── Financial Tab Charts ─────────────────────────────────
  mk('revenueChart', {
    type: 'line',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun'],
      datasets: [{
        label: 'Projected Revenue',
        data: [320000,380000,420000,490000,560000,640000],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139,92,246,0.08)',
        tension: 0.4,
        fill: true,
      }],
    },
    options: axisOpts,
  });
}
