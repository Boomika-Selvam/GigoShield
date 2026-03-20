/* ============================================================
   GIGOSHIELD — pages/onboarding.js
   3-step worker registration: Profile → Coverage → Policy
   ============================================================ */

let obState = { platform: 'Zomato', plan: 'basic', step: 1 };

function onboarding() {
  return `
  <div class="page-enter">
    <div class="section-header">
      <div class="section-eyebrow">WORKER REGISTRATION</div>
      <h1 class="section-title">Get Protected in 60 Seconds</h1>
      <p class="section-sub">AI-powered risk profiling creates your personalized policy instantly</p>
    </div>

    <div style="max-width:640px;margin:0 auto">

      <!-- Step Indicator -->
      <div class="step-indicator">
        <div class="si-step active" id="si_1"><div class="si-num">1</div><div class="si-label">Profile</div></div>
        <div class="si-line" id="siLine1"></div>
        <div class="si-step" id="si_2"><div class="si-num">2</div><div class="si-label">Coverage</div></div>
        <div class="si-line" id="siLine2"></div>
        <div class="si-step" id="si_3"><div class="si-num">3</div><div class="si-label">Policy</div></div>
      </div>

      <!-- STEP 1 — Profile -->
      <div class="card onboard-step active" id="obStep1">
        <h3 style="font-family:var(--font-display);font-weight:700;font-size:1.1rem;margin-bottom:20px">Your Delivery Profile</h3>

        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input type="text" id="ob_name" placeholder="e.g. Ravi Kumar">
        </div>
        <div class="form-group">
          <label class="form-label">Phone Number</label>
          <input type="tel" id="ob_phone" placeholder="+91 98765 43210">
        </div>

        <div class="form-group">
          <label class="form-label">Delivery Platform</label>
          <div class="platform-grid">
            ${PLATFORMS.map((p, i) => `
              <div class="platform-card ${i === 0 ? 'selected' : ''}" onclick="selectPlatform(this,'${p}')" data-platform="${p}">
                ${['🍕','🍔','⚡','🛒','📦','🚴'][i]} ${p}
              </div>
            `).join('')}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">City</label>
          <select id="ob_city" style="margin:0">
            ${Object.entries(CITIES).map(([k, v]) => `<option value="${k}">${v.name}</option>`).join('')}
          </select>
        </div>

        <div class="grid-2" style="gap:12px;margin-bottom:16px">
          <div class="form-group">
            <label class="form-label">Weekly Income (₹)</label>
            <input type="number" id="ob_income" value="7000" min="2000" max="30000">
          </div>
          <div class="form-group">
            <label class="form-label">Experience (months)</label>
            <input type="number" id="ob_exp" value="6" min="1" max="120">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Zone Risk Level</label>
          <select id="ob_zone" style="margin:0">
            <option value="low">🟢 Low — Suburban, less flood history</option>
            <option value="medium" selected>🟡 Medium — Mixed zone</option>
            <option value="high">🔴 High — Flood-prone / high-rainfall zone</option>
          </select>
        </div>

        <button class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px" onclick="obNext1()">
          Next: Choose Coverage <i data-lucide="arrow-right"></i>
        </button>
      </div>

      <!-- STEP 2 — Coverage -->
      <div class="card onboard-step" id="obStep2">
        <h3 style="font-family:var(--font-display);font-weight:700;font-size:1.1rem;margin-bottom:8px">Your Risk Profile</h3>

        <div id="riskResult" style="margin-bottom:20px;padding:14px;background:var(--surface2);border-radius:var(--radius-sm);border:1px solid var(--border)">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <div style="font-size:0.72rem;color:var(--text-sec);margin-bottom:4px">Computed Risk Score</div>
              <div style="font-family:var(--font-display);font-weight:800;font-size:1.8rem" id="riskScoreDisplay">—</div>
            </div>
            <span id="riskLevelBadge" class="badge badge-amber">Medium</span>
          </div>
          <div style="font-size:0.72rem;color:var(--text-sec);margin-top:8px;font-family:var(--font-mono)" id="riskFormula">—</div>
        </div>

        <div style="margin-bottom:20px">
          <div style="font-size:0.82rem;font-weight:600;margin-bottom:12px">Choose Your Plan</div>
          <div class="grid-2">
            <div class="plan-card selected" id="planBasic" onclick="selectPlan('basic')">
              <div style="font-family:var(--font-display);font-weight:800;font-size:1.1rem;margin-bottom:6px">Basic</div>
              <div style="font-size:1.6rem;font-family:var(--font-display);font-weight:800;color:var(--cyan)" id="premiumBasic">₹—/wk</div>
              <div style="font-size:0.72rem;color:var(--text-sec);margin-top:8px;line-height:1.7">
                ✅ Rain, Heat, Wind triggers<br>
                ✅ Auto UPI payout<br>
                ✅ Trust score protection<br>
                ❌ AQI, Curfew, Outage
              </div>
            </div>
            <div class="plan-card" id="planPro" onclick="selectPlan('pro')">
              <div style="font-family:var(--font-display);font-weight:800;font-size:1.1rem;margin-bottom:6px">Pro ⭐</div>
              <div style="font-size:1.6rem;font-family:var(--font-display);font-weight:800;color:var(--violet)" id="premiumPro">₹—/wk</div>
              <div style="font-size:0.72rem;color:var(--text-sec);margin-top:8px;line-height:1.7">
                ✅ All Basic triggers<br>
                ✅ AQI + Gov. Curfew<br>
                ✅ Platform Outage<br>
                ✅ Priority claims processing
              </div>
            </div>
          </div>
        </div>

        <div style="display:flex;gap:10px">
          <button class="btn btn-ghost" onclick="obBack(1)" style="flex:1;justify-content:center">← Back</button>
          <button class="btn btn-primary" onclick="obNext2()" style="flex:2;justify-content:center">
            Get My Policy <i data-lucide="arrow-right"></i>
          </button>
        </div>
      </div>

      <!-- STEP 3 — Policy Generated -->
      <div class="card onboard-step" id="obStep3">
        <div style="text-align:center;padding:20px 0">
          <div style="font-size:3rem;margin-bottom:12px">🎉</div>
          <div style="font-family:var(--font-display);font-weight:800;font-size:1.4rem;margin-bottom:6px" id="policyGreeting">
            Welcome to GigoShield!
          </div>
          <div style="color:var(--text-sec);font-size:0.82rem;margin-bottom:24px" id="policySubtitle">
            Your policy is active immediately.
          </div>
        </div>

        <div class="policy-hero" id="policyCard">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
            <div>
              <div style="font-size:0.7rem;color:var(--text-sec);font-family:var(--font-mono);margin-bottom:4px">POLICY NUMBER</div>
              <div style="font-family:var(--font-display);font-weight:800;font-size:1.3rem;color:var(--cyan)" id="policyIdDisplay">GS-XXXXXX</div>
            </div>
            <span class="badge badge-green">✅ ACTIVE</span>
          </div>
          <div class="grid-2" style="gap:12px">
            <div><div style="font-size:0.65rem;color:var(--text-sec);font-family:var(--font-mono)">WORKER</div><div style="font-weight:600" id="policyWorkerName">—</div></div>
            <div><div style="font-size:0.65rem;color:var(--text-sec);font-family:var(--font-mono)">PLAN</div><div style="font-weight:600" id="policyPlan">—</div></div>
            <div><div style="font-size:0.65rem;color:var(--text-sec);font-family:var(--font-mono)">WEEKLY PREMIUM</div><div style="font-family:var(--font-display);font-weight:800;color:var(--cyan)" id="policyPremium">—</div></div>
            <div><div style="font-size:0.65rem;color:var(--text-sec);font-family:var(--font-mono)">MAX PAYOUT</div><div style="font-family:var(--font-display);font-weight:800;color:var(--green)" id="policyMaxPayout">—</div></div>
          </div>
          <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border)">
            <div style="font-size:0.65rem;color:var(--text-sec);font-family:var(--font-mono);margin-bottom:6px">COVERED TRIGGERS</div>
            <div id="policyTriggers" style="display:flex;flex-wrap:wrap;gap:6px"></div>
          </div>
        </div>

        <div style="display:flex;gap:10px;margin-top:8px">
          <button class="btn btn-ghost" onclick="navigate('dashboard')" style="flex:1;justify-content:center">
            <i data-lucide="layout-dashboard"></i> Dashboard
          </button>
          <button class="btn btn-primary" onclick="navigate('claims')" style="flex:1;justify-content:center">
            <i data-lucide="zap"></i> View Claims
          </button>
        </div>
      </div>

    </div>
  </div>`;
}

/* ── Step navigation ────────────────────────────────────── */

function selectPlatform(el, platform) {
  document.querySelectorAll('.platform-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  obState.platform = platform;
}

function selectPlan(plan) {
  obState.plan = plan;
  ['Basic','Pro'].forEach(p => {
    const el = document.getElementById(`plan${p}`);
    if (el) el.classList.toggle('selected', p.toLowerCase() === plan);
  });
}

function obNext1() {
  const name  = document.getElementById('ob_name').value.trim();
  const phone = document.getElementById('ob_phone').value.trim();
  if (!name || !phone) { toast('Please fill in name and phone number', 'error'); return; }

  document.getElementById('obStep1').classList.remove('active');
  document.getElementById('obStep2').classList.add('active');
  document.getElementById('si_1').classList.add('done');
  document.getElementById('si_2').classList.add('active');
  document.getElementById('siLine1').classList.add('done');

  // Compute and display risk
  const city     = document.getElementById('ob_city').value;
  const zone     = document.getElementById('ob_zone').value;
  const exp      = +document.getElementById('ob_exp').value || 6;
  const { riskScore, level, components } = computeRiskScore(city, obState.platform, zone, exp);
  const { weeklyPremium: basicP, formula } = computePremium(riskScore, 'basic', zone);
  const { weeklyPremium: proP }            = computePremium(riskScore, 'pro',   zone);

  document.getElementById('riskScoreDisplay').textContent = riskScore + '/100';
  document.getElementById('riskLevelBadge').className     = `badge badge-${level==='high'?'red':level==='medium'?'amber':'green'}`;
  document.getElementById('riskLevelBadge').textContent   = `${level.charAt(0).toUpperCase()+level.slice(1)} Risk`;
  document.getElementById('riskFormula').textContent      = `Zone(${components.zoneBase}) + Platform(${components.platformMod}) + Exp(${components.experienceMod}) = ${riskScore}`;
  document.getElementById('premiumBasic').textContent     = `₹${basicP}/wk`;
  document.getElementById('premiumPro').textContent       = `₹${proP}/wk`;
}

function obBack(step) {
  if (step === 1) {
    document.getElementById('obStep2').classList.remove('active');
    document.getElementById('obStep1').classList.add('active');
    document.getElementById('si_2').classList.remove('active');
    document.getElementById('si_1').classList.remove('done');
    document.getElementById('siLine1').classList.remove('done');
  }
}

function obNext2() {
  const name   = document.getElementById('ob_name').value.trim();
  const phone  = document.getElementById('ob_phone').value.trim();
  const city   = document.getElementById('ob_city').value;
  const zone   = document.getElementById('ob_zone').value;
  const income = +document.getElementById('ob_income').value || 7000;
  const exp    = +document.getElementById('ob_exp').value    || 6;

  const { riskScore }       = computeRiskScore(city, obState.platform, zone, exp);
  const { weeklyPremium }   = computePremium(riskScore, obState.plan, zone);
  const policyId            = 'GS-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  const triggers            = ['heavy_rain','extreme_heat','high_wind','severe_aqi']
                              .concat(obState.plan === 'pro' ? ['curfew','platform_outage'] : []);

  State.registeredWorker = { name, phone, platform:obState.platform, city, zone, income, exp, risk:riskScore, premium:weeklyPremium, plan:obState.plan, policyId, trust:0.72, triggers };

  // Move to step 3
  document.getElementById('obStep2').classList.remove('active');
  document.getElementById('obStep3').classList.add('active');
  document.getElementById('si_2').classList.add('done');
  document.getElementById('si_3').classList.add('active');
  document.getElementById('siLine2').classList.add('done');

  // Populate policy card
  document.getElementById('policyGreeting').textContent    = `Welcome, ${name}!`;
  document.getElementById('policySubtitle').textContent    = `Your GigoShield policy is active immediately. Premium deducted every Monday.`;
  document.getElementById('policyIdDisplay').textContent   = policyId;
  document.getElementById('policyWorkerName').textContent  = name;
  document.getElementById('policyPlan').textContent        = (obState.plan === 'pro' ? 'Pro ⭐' : 'Basic').toUpperCase();
  document.getElementById('policyPremium').textContent     = `₹${weeklyPremium}/week`;
  document.getElementById('policyMaxPayout').textContent   = `₹${Math.round(income * 0.9).toLocaleString()}`;
  document.getElementById('policyTriggers').innerHTML      = triggers.map(t => `<span class="badge badge-green">✓ ${t.replace(/_/g,' ')}</span>`).join('');

  toast(`Policy ${policyId} created! Welcome to GigoShield, ${name}!`, 'success');
  lucide.createIcons();
}
