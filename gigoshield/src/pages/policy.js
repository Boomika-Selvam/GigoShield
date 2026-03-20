/* ============================================================
   GIGOSHIELD — pages/policy.js
   Active policy view for a registered worker.
   ============================================================ */

function policy() {
  const w = State.registeredWorker;

  if (!w) {
    return `
      <div class="page-enter" style="text-align:center;padding:60px 0">
        <div style="font-size:4rem;margin-bottom:16px">🛡️</div>
        <div style="font-family:var(--font-display);font-weight:800;font-size:1.4rem;margin-bottom:8px">No Active Policy</div>
        <p style="color:var(--text-sec);margin-bottom:24px">Register as a delivery partner to view your policy here.</p>
        <button class="btn btn-primary" onclick="navigate('onboarding')">
          <i data-lucide="user-plus"></i> Register Now
        </button>
      </div>`;
  }

  const trust      = w.trust || 0.72;
  const trustColor = trust >= 0.8 ? 'var(--green)' : trust >= 0.5 ? 'var(--amber)' : 'var(--red)';
  const trustLabel = trust >= 0.8 ? 'Instant Full Payout' : trust >= 0.5 ? 'Partial Payout + Review' : 'Flagged — Under Review';

  return `
  <div class="page-enter">
    <div class="section-header">
      <div class="section-eyebrow">MY INSURANCE</div>
      <h1 class="section-title">My Policy</h1>
      <p class="section-sub">Your active GigoShield parametric insurance policy</p>
    </div>

    <!-- Policy Hero -->
    <div class="policy-hero">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px">
        <div>
          <div style="font-size:0.65rem;color:var(--text-sec);font-family:var(--font-mono);margin-bottom:4px">POLICY NUMBER</div>
          <div style="font-family:var(--font-display);font-weight:800;font-size:1.6rem;color:var(--cyan)">${w.policyId}</div>
        </div>
        <span class="badge badge-green" style="font-size:0.8rem;padding:6px 14px">✅ ACTIVE</span>
      </div>
      <div class="grid-4" style="gap:16px">
        <div><div class="mc-label">Worker</div><div style="font-weight:700">${w.name}</div></div>
        <div><div class="mc-label">Platform</div><div style="font-weight:700">${w.platform}</div></div>
        <div><div class="mc-label">City</div><div style="font-weight:700">${CITIES[w.city]?.name || w.city}</div></div>
        <div><div class="mc-label">Plan</div><div style="font-weight:700;color:var(--cyan)">${w.plan?.toUpperCase()} ${w.plan==='pro'?'⭐':''}</div></div>
      </div>
    </div>

    <div class="grid-2" style="margin-bottom:20px">
      <!-- Trust Score -->
      <div class="card">
        <div class="card-title" style="margin-bottom:16px">🧠 Your Trust Score</div>
        <div style="text-align:center;margin-bottom:16px">
          <div style="font-family:var(--font-display);font-weight:800;font-size:3.5rem;color:${trustColor}">${trust.toFixed(2)}</div>
          <div style="font-size:0.82rem;color:${trustColor};margin-top:4px">${trustLabel}</div>
        </div>
        <div class="progress-bar" style="height:10px;margin-bottom:16px">
          <div class="progress-fill" style="background:${trustColor};width:${trust*100}%"></div>
        </div>
        <div style="font-size:0.75rem;color:var(--text-sec);font-family:var(--font-mono);line-height:1.8">
          Score = 0.30×Movement + 0.30×Activity + 0.20×Peer + 0.20×History
        </div>
      </div>

      <!-- Payout Tiers -->
      <div class="card">
        <div class="card-title" style="margin-bottom:16px">💰 Payout Tiers</div>
        ${[
          ['Trust ≥ 0.80', '✅ Instant Full Payout',   'UPI in < 5 seconds',              'green'],
          ['Trust 0.50–0.79','⏳ 60% Now + 24h Review', 'Partial instant + re-verify',      'amber'],
          ['Trust < 0.50',  '🔍 Human Review 48h SLA', 'With specific reason + appeal', 'red'],
        ].map(([cond, label, detail, color]) => `
          <div style="display:flex;gap:12px;align-items:flex-start;padding:12px 0;border-bottom:1px solid var(--border)">
            <div style="width:8px;height:8px;border-radius:50%;background:var(--${color});margin-top:5px;flex-shrink:0"></div>
            <div>
              <div style="font-size:0.72rem;color:var(--text-sec);font-family:var(--font-mono)">${cond}</div>
              <div style="font-weight:600;font-size:0.85rem">${label}</div>
              <div style="font-size:0.7rem;color:var(--text-sec)">${detail}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Financial Details -->
    <div class="grid-3">
      <div class="card">
        <div class="card-title" style="margin-bottom:12px">📊 Premium Details</div>
        <div class="fin-row"><span class="fin-label">Weekly Premium</span><span class="fin-val text-cyan">₹${w.premium?.toFixed(0)||'—'}</span></div>
        <div class="fin-row"><span class="fin-label">Monthly Equiv.</span><span class="fin-val">₹${Math.round((w.premium||0)*4.33)}</span></div>
        <div class="fin-row"><span class="fin-label">Risk Score</span><span class="fin-val text-amber">${w.risk||'—'}/100</span></div>
        <div class="fin-row"><span class="fin-label">Zone</span><span class="fin-val">${(w.zone||'medium').toUpperCase()}</span></div>
      </div>
      <div class="card">
        <div class="card-title" style="margin-bottom:12px">🎯 Coverage Details</div>
        <div class="fin-row"><span class="fin-label">Max Payout</span><span class="fin-val text-green">₹${Math.round((w.income||7000)*0.9).toLocaleString()}</span></div>
        <div class="fin-row"><span class="fin-label">Loss Threshold</span><span class="fin-val">20% of weekly income</span></div>
        <div class="fin-row"><span class="fin-label">Payout Method</span><span class="fin-val">UPI Instant</span></div>
        <div class="fin-row"><span class="fin-label">Valid From</span><span class="fin-val">${new Date().toLocaleDateString('en-IN')}</span></div>
      </div>
      <div class="card">
        <div class="card-title" style="margin-bottom:12px">⚡ Active Triggers</div>
        ${(w.triggers || ['heavy_rain','extreme_heat','high_wind','severe_aqi']).map(t => `
          <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border)">
            <span class="badge badge-green" style="font-size:0.6rem">✓</span>
            <span style="font-size:0.78rem">${t.replace(/_/g,' ')}</span>
          </div>
        `).join('')}
      </div>
    </div>
  </div>`;
}
