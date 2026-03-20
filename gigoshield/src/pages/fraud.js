/* ============================================================
   GIGOSHIELD — pages/fraud.js
   Adversarial defense, anti-spoofing, and live simulation
   arena for GPS fraud ring detection.
   ============================================================ */

function fraud() {
  return `
  <div class="page-enter">
    <div class="section-header">
      <div class="section-eyebrow">ADVERSARIAL DEFENSE & ANTI-SPOOFING</div>
      <div class="section-actions" style="margin-bottom:0">
        <div>
          <h1 class="section-title">Fraud Intelligence Center</h1>
          <p class="section-sub">Detecting coordinated GPS spoofing syndicates in real-time</p>
        </div>
        <span class="badge badge-red" style="font-size:0.82rem;padding:8px 16px;animation:pulse 2s infinite">🔴 THREAT MODEL ACTIVE</span>
      </div>
    </div>

    <div class="alert-banner">
      <i data-lucide="alert-triangle"></i>
      <div class="alert-banner-text">
        <strong>⚠️ 24-Hour Response</strong>
        <p>A 500-person Telegram syndicate uses GPS spoofing apps to fake locations in weather-hit zones. Our behavior-first AI detects them without relying on GPS alone.</p>
      </div>
    </div>

    <!-- 3 Strategy Cards -->
    <div class="grid-3" style="margin-bottom:24px">
      ${[
        ['🎯','Differentiation','We shift from <em>"Where is the user?"</em> to <em>"Is this user behaving like a real delivery partner?"</em> Movement must show 3–25 km/h velocity, GPS must snap to OSM roads, speed must show human entropy.','red'],
        ['📊','Beyond-GPS Data','Accelerometer vibration, IP subnet clustering, device fingerprints, order logs, cell tower match, claim timing sync analysis, road-network snap, 50-peer zone comparison.','amber'],
        ['💚','UX Balance','Network drops get 60% instant + 24h re-verify. Never fully blocked on first flag. Clear reasons shown. Appeal process available.','green'],
      ].map(([icon, title, desc, color]) => `
        <div class="card" style="border-color:rgba(${color==='red'?'239,68,68':color==='amber'?'245,158,11':'16,185,129'},0.2)">
          <div class="mc-icon ${color}" style="margin-bottom:12px"><span style="font-size:1.2rem">${icon}</span></div>
          <div class="card-title" style="margin-bottom:8px">${title}</div>
          <div style="font-size:0.78rem;color:var(--text-sec);line-height:1.7">${desc}</div>
        </div>
      `).join('')}
    </div>

    <!-- Live Simulation Arena -->
    <div class="card" style="border-color:rgba(239,68,68,0.2);margin-bottom:24px">
      <div class="card-header">
        <div>
          <div class="card-title">🔴 Live Fraud Ring Simulation Arena</div>
          <div class="card-sub">96 delivery workers · Watch AI detect the syndicate in real-time</div>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <div style="display:flex;gap:10px;font-size:0.7rem">
            ${[['var(--green)','Genuine'],['var(--red)','Fraud Ring'],['var(--amber)','Flagged'],['var(--cyan)','Paid']].map(([c,l])=>`
              <span style="display:flex;align-items:center;gap:5px">
                <span style="width:8px;height:8px;border-radius:50%;background:${c};display:inline-block"></span>${l}
              </span>`).join('')}
          </div>
          <button class="btn btn-primary btn-sm" id="startSimBtn" onclick="startFraudSim()">
            <i data-lucide="play"></i> Start
          </button>
          <button class="btn btn-ghost btn-sm" onclick="resetFraudSim()">
            <i data-lucide="rotate-ccw"></i> Reset
          </button>
        </div>
      </div>

      <div class="fraud-arena" id="fraudArena"></div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div>
          <div style="font-size:0.72rem;font-family:var(--font-mono);color:var(--text-sec);margin-bottom:8px">DETECTION LOG</div>
          <div class="log-box" id="fraudLog">Waiting for simulation to start...</div>
        </div>
        <div>
          <div style="font-size:0.72rem;font-family:var(--font-mono);color:var(--text-sec);margin-bottom:8px">LIVE STATS</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            ${[
              ['Genuine Workers','0','green','genuineCount'],
              ['Fraud Ring','0','red','fraudCount'],
              ['Flagged','0','amber','flaggedCount'],
              ['Paid Out','0','cyan','paidCount'],
              ['₹ Prevented','₹0','green','preventedAmt'],
              ['Detection %','0%','violet','detectionPct'],
            ].map(([l,v,c,id]) => `
              <div style="background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px">
                <div style="font-size:0.65rem;color:var(--text-sec);font-family:var(--font-mono)">${l}</div>
                <div style="font-family:var(--font-display);font-weight:700;color:var(--${c})" id="${id}">${v}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- Signal Matrix -->
    <div class="card">
      <div class="card-title" style="margin-bottom:16px">📡 Anti-Fraud Signal Matrix</div>
      <div class="signal-grid">
        ${[
          ['📡','GPS Road Snap',    'GPS → OSM road validation',      'Spoofers land in buildings/water','critical'],
          ['📳','Accelerometer',   'Physical vibration pattern',      'Sitting at home = flat/zero',     'critical'],
          ['🌐','IP Subnet Cluster','Network address clustering',      '20 claims from 3 subnets = ring', 'high'],
          ['⏱️','Claim Timing',    'Synchronized mass-claiming',      '20 claims in 12s = coordinated',  'critical'],
          ['📦','Order Activity',  'Platform API last N orders',      'Zero orders = no proof of work',  'high'],
          ['📱','Device Fingerprint','Hardware + SIM hash',           '9 devices / 38 accounts = ring',  'high'],
          ['📶','Cell Tower Match','Network cell vs GPS location',    'Cell ≠ GPS = location faked',     'medium'],
          ['🏃','Speed Entropy',   'Velocity variation analysis',     'Constant speed = spoofer artifact','high'],
          ['👥','Peer Density',    '50+ peers in 1km² comparison',   'All peers inactive = genuine event','medium'],
        ].map(([icon, name, check, fail, sev]) => `
          <div class="signal-row">
            <span class="signal-icon">${icon}</span>
            <div>
              <div class="signal-name">${name}</div>
              <div style="font-size:0.65rem;color:var(--text-sec)">${check}</div>
              <div style="font-size:0.62rem;color:var(--red);margin-top:2px">Fail: ${fail}</div>
            </div>
            <span class="badge badge-${sev==='critical'?'red':sev==='high'?'amber':'cyan'}" style="font-size:0.55rem">${sev.toUpperCase()}</span>
          </div>
        `).join('')}
      </div>
    </div>
  </div>`;
}

/* ── Fraud arena ─────────────────────────────────────────── */

function initFraud() { buildFraudArena(); }

function buildFraudArena() {
  const arena = document.getElementById('fraudArena');
  if (!arena) return;
  State.fraudNodes = [];
  arena.innerHTML  = '';
  for (let i = 0; i < 96; i++) {
    State.fraudNodes.push({ id: i, type: i < 12 ? 'fraud' : 'genuine' });
    const el = document.createElement('div');
    el.className  = 'arena-node';
    el.id         = `node_${i}`;
    el.title      = `Worker #${i + 1}`;
    el.textContent = i + 1;
    arena.appendChild(el);
  }
}

async function startFraudSim() {
  if (State.simRunning) return;
  State.simRunning = true;
  document.getElementById('startSimBtn').disabled = true;

  const log    = document.getElementById('fraudLog');
  log.innerHTML = '';

  const addLog = (msg, cls = 'log-info') => {
    log.innerHTML += `<span class="log-entry ${cls}">[${new Date().toLocaleTimeString()}] ${msg}</span><br>`;
    log.scrollTop  = log.scrollHeight;
  };

  addLog('🌧️ Heavy rain event detected in Delhi NCR — threshold breached', 'log-warn');
  await sleep(800);
  addLog('📡 96 claims received in < 12 seconds — analyzing...', 'log-warn');
  await sleep(600);

  let genuine = 0, fraud = 0, flagged = 0, paid = 0;

  for (let i = 0; i < 96; i++) {
    await sleep(80);
    const el = document.getElementById(`node_${i}`);
    if (!el) continue;
    if (i < 12) {
      el.className = 'arena-node fraud'; fraud++;
      if (i === 0)  addLog('🚨 GPS teleportation: 0→15km in <3s on 12 devices', 'log-err');
      if (i === 5)  addLog('🚨 IP cluster: 3 subnets across 12 workers', 'log-err');
      if (i === 10) addLog('🚨 Zero accelerometer on all 12 devices — stationary!', 'log-err');
    } else if (i < 20) {
      el.className = 'arena-node flagged'; flagged++;
      if (i === 12) addLog('⚠️ 8 workers: network drop — partial payout + re-verify', 'log-warn');
    } else {
      el.className = 'arena-node genuine'; genuine++;
    }
    document.getElementById('genuineCount').textContent = genuine;
    document.getElementById('fraudCount').textContent   = fraud;
    document.getElementById('flaggedCount').textContent = flagged;
  }

  await sleep(500);
  addLog('✅ Processing 76 genuine claims — instant UPI payout...', 'log-ok');
  await sleep(800);

  for (let i = 20; i < 96; i++) {
    await sleep(30);
    const el = document.getElementById(`node_${i}`);
    if (el?.className.includes('genuine')) { el.className = 'arena-node paid'; paid++; }
    document.getElementById('paidCount').textContent = paid;
  }

  const prevented = fraud * 3200;
  document.getElementById('preventedAmt').textContent  = '₹' + prevented.toLocaleString();
  document.getElementById('detectionPct').textContent  = Math.round(fraud / (fraud + paid) * 100) + '%';

  addLog(`💰 ${paid} workers paid instantly · ${fraud} ring members blocked · ₹${prevented.toLocaleString()} saved`, 'log-ok');
  addLog(`🔍 ${flagged} workers flagged for 24h re-verification`, 'log-warn');
  addLog('✅ Fraud ring neutralized. Legitimate workers protected.', 'log-ok');

  toast('Simulation complete — fraud ring detected!', 'success');
  State.simRunning = false;
  document.getElementById('startSimBtn').disabled = false;
}

function resetFraudSim() {
  State.simRunning = false;
  buildFraudArena();
  const log = document.getElementById('fraudLog');
  if (log) log.innerHTML = 'Arena reset. Click Start to run simulation.';
  ['genuineCount','fraudCount','flaggedCount','paidCount'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '0';
  });
  document.getElementById('preventedAmt').textContent = '₹0';
  document.getElementById('detectionPct').textContent = '0%';
  document.getElementById('startSimBtn').disabled = false;
}
