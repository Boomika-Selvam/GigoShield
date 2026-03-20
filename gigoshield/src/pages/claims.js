/* ============================================================
   GIGOSHIELD — pages/claims.js
   Claims management with live end-to-end claim simulator.
   ============================================================ */

function claims() {
  return `
  <div class="page-enter">
    <div class="section-actions">
      <div class="section-header" style="margin:0">
        <div class="section-eyebrow">CLAIMS MANAGEMENT</div>
        <h1 class="section-title">Claims Center</h1>
        <p class="section-sub">Zero-touch parametric claims — auto-triggered by weather events</p>
      </div>
      <button class="btn btn-primary" onclick="startClaimSim()">
        <i data-lucide="zap"></i> Simulate Live Claim
      </button>
    </div>

    <!-- Stats -->
    <div class="grid-4 stagger" style="margin-bottom:24px">
      ${[
        ['Total Claims',    claimsDB.length,                                                            'amber', 'file-text'],
        ['Paid Out',        claimsDB.filter(c=>c.status==='paid').length,                               'green', 'check-circle'],
        ['Under Review',    claimsDB.filter(c=>c.status==='partial'||c.status==='processing').length,   'cyan',  'clock'],
        ['Rejected (Fraud)',claimsDB.filter(c=>c.status==='rejected').length,                           'red',   'x-circle'],
      ].map(([l,v,c,icon]) => `
        <div class="metric-card">
          <div class="mc-icon ${c}"><i data-lucide="${icon}"></i></div>
          <div class="mc-label">${l}</div>
          <div class="mc-value" style="color:var(--${c})">${v}</div>
        </div>
      `).join('')}
    </div>

    <!-- Claim Simulator Card -->
    <div class="card" style="border-color:rgba(245,158,11,0.3);margin-bottom:24px" id="claimSimPanel">
      <div class="card-header">
        <div>
          <div class="card-title">🎯 Live End-to-End Claim Simulator</div>
          <div class="card-sub">Full automated pipeline: trust score → fraud check → UPI payout</div>
        </div>
        <span class="live-dot">REAL-TIME</span>
      </div>

      <div class="grid-2" style="gap:16px;margin-bottom:16px">
        <div>
          <div class="form-group">
            <label class="form-label">Trigger Type</label>
            <select id="simTrigger" style="margin:0">
              <option value="heavy_rain">☔ Heavy Rain</option>
              <option value="extreme_heat">🌡️ Extreme Heat</option>
              <option value="high_wind">💨 High Wind</option>
              <option value="severe_aqi">💨 Severe AQI</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Worker Scenario</label>
            <select id="simScenario" style="margin:0">
              <option value="genuine">✅ Genuine Worker — Active delivery, GPS ok</option>
              <option value="network_drop">⚠️ Network Drop — Signal loss in field</option>
              <option value="spoofed">❌ GPS Spoofing — Fraud syndicate member</option>
            </select>
          </div>
        </div>
        <div>
          <div class="form-group">
            <label class="form-label">Expected Weekly Income (₹)</label>
            <input type="number" id="simIncome" value="7000" min="2000" max="20000">
          </div>
          <div class="form-group">
            <label class="form-label">Actual Income This Week (₹)</label>
            <input type="number" id="simActual" value="2450" min="0">
          </div>
        </div>
      </div>

      <button class="btn btn-primary" id="runSimBtn" onclick="runClaimSim()">
        <i data-lucide="play"></i> Run Claim Simulation
      </button>

      <!-- Results -->
      <div id="simResult" style="display:none;margin-top:20px">
        <hr class="divider">
        <div style="font-size:0.82rem;font-weight:600;margin-bottom:14px;color:var(--cyan)">📋 Claim Processing Audit Trail</div>
        <div class="audit-trail" id="auditTrail"></div>
        <div id="simPayout" style="margin-top:16px;padding:16px;border-radius:var(--radius);text-align:center"></div>
      </div>
    </div>

    <!-- Claims Table -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">📋 All Claims</div>
        <div style="display:flex;gap:8px">
          <button class="tab-btn active" onclick="filterClaims('all',this)">All</button>
          <button class="tab-btn" onclick="filterClaims('paid',this)">Paid</button>
          <button class="tab-btn" onclick="filterClaims('partial',this)">Partial</button>
          <button class="tab-btn" onclick="filterClaims('rejected',this)">Rejected</button>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>ID</th><th>Worker</th><th>Platform</th><th>Trigger</th><th>City</th>
            <th>Expected</th><th>Loss</th><th>Payout</th><th>Trust</th><th>Status</th><th>Time</th>
          </tr></thead>
          <tbody id="claimsTableBody">
            ${renderClaimsRows(claimsDB)}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
}

/* ── Init & filter ──────────────────────────────────────── */

function initClaims() {
  document.getElementById('claimsCount').textContent = claimsDB.length;
}

function startClaimSim() {
  document.getElementById('claimSimPanel')?.scrollIntoView({ behavior: 'smooth' });
}

function filterClaims(status, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const list  = status === 'all' ? claimsDB : claimsDB.filter(c => c.status === status);
  const tbody = document.getElementById('claimsTableBody');
  if (tbody) tbody.innerHTML = renderClaimsRows(list);
}

/* ── Claim Simulation ───────────────────────────────────── */

async function runClaimSim() {
  const trigger  = document.getElementById('simTrigger').value;
  const scenario = document.getElementById('simScenario').value;
  const expected = +document.getElementById('simIncome').value;
  const actual   = +document.getElementById('simActual').value;

  const btn = document.getElementById('runSimBtn');
  btn.disabled  = true;
  btn.innerHTML = '<span class="spinner"></span> Processing...';

  document.getElementById('simResult').style.display = 'block';

  // Compute trust + payout
  const preset   = SCENARIO_PRESETS[scenario] || SCENARIO_PRESETS.genuine;
  const { score: trust, decision, label } = computeTrustScore(preset.mc, preset.as_, preset.pm, preset.ch);
  const payout   = computePayout(expected, actual, trust);
  const isFraud  = scenario === 'spoofed';
  const upiRef   = 'UPI' + Math.random().toString(36).slice(2, 12).toUpperCase();

  // Build audit steps
  const steps = [
    { label: 'Trigger Received',     detail: `${trigger.replace(/_/g,' ')} event detected via Open-Meteo` },
    { label: 'Trust Score Computed', detail: `Score: ${trust.toFixed(4)} (MC:${preset.mc.toFixed(2)} AS:${preset.as_.toFixed(2)} PM:${preset.pm.toFixed(2)} CH:${preset.ch.toFixed(2)})` },
    { label: 'Fraud Analysis',       detail: isFraud ? '🚨 GPS teleportation + IP cluster + zero accelerometer — FRAUD RING' : scenario==='network_drop' ? '⚠️ Network drop pattern — partial verification' : '✅ No fraud signals — genuine worker' },
    { label: 'Payout Calculated',    detail: `Loss: ${payout.lossPercent}% → ${payout.payoutTier} → Trust mod: ${payout.trustMod} → ₹${payout.payoutAmount}` },
    { label: 'Decision',             detail: decision==='instant_payout' ? `✅ INSTANT PAYOUT — ₹${payout.payoutAmount} via UPI (ref: ${upiRef})` : decision==='partial_payout' ? `⏳ PARTIAL PAYOUT — ₹${payout.payoutAmount} now + 24h re-verify` : `❌ FLAGGED — Human review 48h SLA. Specific reasons provided.` },
  ];

  const trail = document.getElementById('auditTrail');
  trail.innerHTML = '';

  for (let i = 0; i < steps.length; i++) {
    await sleep(600);
    const s = steps[i];
    trail.innerHTML += `
      <div class="audit-step">
        <div class="audit-dot done">${i + 1}</div>
        <div class="audit-content">
          <div class="audit-label">${s.label}</div>
          <div class="audit-detail">${s.detail}</div>
        </div>
      </div>`;
    trail.scrollTop = trail.scrollHeight;
  }

  await sleep(400);

  // Payout result banner
  const payEl = document.getElementById('simPayout');
  if (decision === 'instant_payout') {
    payEl.style.cssText = 'background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:var(--radius);padding:16px;text-align:center';
    payEl.innerHTML = `<div style="font-family:var(--font-display);font-weight:800;font-size:2rem;color:var(--green)">₹${payout.payoutAmount.toLocaleString()} PAID ✅</div><div style="color:var(--text-sec);margin-top:4px;font-size:0.8rem">UPI instant transfer complete · Trust: ${trust.toFixed(2)}</div>`;
  } else if (decision === 'partial_payout') {
    payEl.style.cssText = 'background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:var(--radius);padding:16px;text-align:center';
    payEl.innerHTML = `<div style="font-family:var(--font-display);font-weight:800;font-size:2rem;color:var(--amber)">₹${payout.payoutAmount.toLocaleString()} PARTIAL ⏳</div><div style="color:var(--text-sec);margin-top:4px;font-size:0.8rem">60% now + 24h re-verify for remaining · Trust: ${trust.toFixed(2)}</div>`;
  } else {
    payEl.style.cssText = 'background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:var(--radius);padding:16px;text-align:center';
    payEl.innerHTML = `<div style="font-family:var(--font-display);font-weight:800;font-size:2rem;color:var(--red)">FRAUD DETECTED ❌</div><div style="color:var(--text-sec);margin-top:4px;font-size:0.8rem">GPS spoofing confirmed · ₹${Math.round((expected-actual)*0.9).toLocaleString()} in payouts prevented · Human review initiated</div>`;
  }

  // Add new claim to DB
  const statusMap = { instant_payout:'paid', partial_payout:'partial', flagged:'rejected' };
  claimsDB.unshift({
    id:       'CLM-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
    worker:   State.registeredWorker?.name || 'Demo Worker',
    platform: State.registeredWorker?.platform || 'Zomato',
    city:     CITIES[State.selectedCity]?.name || 'Mumbai',
    trigger, value: trigger.replace(/_/g,' '),
    expected, actual,
    loss:     payout.lossPercent,
    payout:   payout.payoutAmount,
    trust,
    status:   statusMap[decision] || 'processing',
    ts:       Date.now(),
  });

  document.getElementById('claimsCount').textContent = claimsDB.length;
  const tbody = document.getElementById('claimsTableBody');
  if (tbody) tbody.innerHTML = renderClaimsRows(claimsDB);

  btn.disabled  = false;
  btn.innerHTML = '<i data-lucide="play"></i> Run Claim Simulation';
  lucide.createIcons();
  toast('Claim simulation complete!', decision === 'instant_payout' ? 'success' : decision === 'flagged' ? 'error' : 'info');
}
