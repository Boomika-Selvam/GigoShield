/* ============================================================
   GIGOSHIELD — services/engine.js
   Core business logic:
     - Trust Score computation
     - Risk Score computation
     - Premium calculation
     - Payout calculation
   All functions are pure (no DOM side-effects).
   ============================================================ */

/* ── TRUST SCORE ─────────────────────────────────────────── */

/**
 * Compute trust score from four behavioral signals.
 * Formula: 0.30×MC + 0.30×AS + 0.20×PM + 0.20×CH
 *
 * @param {number} mc  Movement Consistency  (0–1)
 * @param {number} as_ Activity Score        (0–1)
 * @param {number} pm  Peer Match            (0–1)
 * @param {number} ch  Claim History         (0–1)
 * @returns {{ score, decision, label, payoutPct, color, badgeCls }}
 */
function computeTrustScore(mc, as_, pm, ch) {
  const score = +(0.30 * mc + 0.30 * as_ + 0.20 * pm + 0.20 * ch).toFixed(4);

  let decision, label, payoutPct, color, badgeCls;

  if (score >= 0.80) {
    decision  = 'instant_payout';
    label     = 'Instant Payout';
    payoutPct = 1.0;
    color     = 'var(--green)';
    badgeCls  = 'badge-green';
  } else if (score >= 0.50) {
    decision  = 'partial_payout';
    label     = 'Partial + Review';
    payoutPct = 0.60;
    color     = 'var(--amber)';
    badgeCls  = 'badge-amber';
  } else {
    decision  = 'flagged';
    label     = 'Flagged';
    payoutPct = 0.0;
    color     = 'var(--red)';
    badgeCls  = 'badge-red';
  }

  return { score, decision, label, payoutPct, color, badgeCls };
}

/**
 * Preset signal values for the three simulation scenarios.
 */
const SCENARIO_PRESETS = {
  genuine:      { mc: 0.88, as_: 0.92, pm: 0.87, ch: 0.91 },
  network_drop: { mc: 0.54, as_: 0.71, pm: 0.89, ch: 0.80 },
  spoofed:      { mc: 0.05, as_: 0.07, pm: 0.11, ch: 0.22 },
};

/* ── RISK SCORE ──────────────────────────────────────────── */

/**
 * Compute a worker's risk score (0–100).
 * Higher = higher-risk zone / platform / newer worker.
 *
 * @param {string} city
 * @param {string} platform
 * @param {string} zone        'low' | 'medium' | 'high'
 * @param {number} expMonths
 * @returns {{ riskScore, level, components }}
 */
function computeRiskScore(city, platform, zone, expMonths) {
  const zoneScores = {
    mumbai:    { low: 20, medium: 55, high: 82 },
    delhi:     { low: 18, medium: 48, high: 75 },
    bangalore: { low: 15, medium: 42, high: 68 },
    chennai:   { low: 25, medium: 60, high: 85 },
    hyderabad: { low: 20, medium: 50, high: 78 },
    kolkata:   { low: 22, medium: 58, high: 80 },
    pune:      { low: 18, medium: 45, high: 72 },
  };

  const platMod = { Zomato: 5, Swiggy: 5, Zepto: 3, Blinkit: 3, Amazon: 0, Dunzo: 2 }[platform] || 0;
  const expMod  = Math.max(0, 10 - Math.min(10, Math.floor(expMonths / 2)));
  const base    = zoneScores[city]?.[zone] || 55;
  const score   = Math.min(100, base + platMod + expMod);

  return {
    riskScore:  score,
    level:      score >= 65 ? 'high' : score >= 35 ? 'medium' : 'low',
    components: { zoneBase: base, platformMod: platMod, experienceMod: expMod },
  };
}

/* ── PREMIUM ─────────────────────────────────────────────── */

/**
 * Calculate weekly premium.
 * Basic = ₹50 + riskScore (with zone discount)
 * Pro   = Basic × 1.4
 *
 * @param {number} riskScore
 * @param {'basic'|'pro'} plan
 * @param {'low'|'medium'|'high'} zone
 * @returns {{ weeklyPremium, monthlyEquiv, formula }}
 */
function computePremium(riskScore, plan, zone) {
  const zoneDiscount = { low: 5, medium: 0, high: 0 }[zone] || 0;
  const base         = 50 + riskScore - zoneDiscount;
  const weekly       = plan === 'pro' ? +(base * 1.4).toFixed(0) : base;
  const monthly      = +(weekly * 4.33).toFixed(0);
  const formula      = `₹50 + ${riskScore} - ${zoneDiscount} = ₹${base}` +
                       (plan === 'pro' ? ` × 1.4 = ₹${weekly}` : '');

  return { weeklyPremium: weekly, monthlyEquiv: monthly, formula };
}

/* ── PAYOUT ──────────────────────────────────────────────── */

/**
 * Calculate claim payout given income loss and trust score.
 *
 * @param {number} expected  Expected weekly income (₹)
 * @param {number} actual    Actual earned this week (₹)
 * @param {number} trustScore  0–1
 * @returns {{ lossPercent, payoutTier, payoutAmount, finalPct }}
 */
function computePayout(expected, actual, trustScore) {
  const loss   = Math.max(0, ((expected - actual) / expected) * 100);
  const lossAmt = expected - actual;

  let basePct = 0;
  let tier    = 'below_threshold';

  if (loss >= 70) { basePct = 0.90; tier = '>70% loss → 90% payout'; }
  else if (loss >= 40) { basePct = 0.75; tier = '40–70% loss → 75% payout'; }
  else if (loss >= 20) { basePct = 0.50; tier = '20–40% loss → 50% payout'; }

  const trustMod    = trustScore >= 0.8 ? 1.0 : trustScore >= 0.5 ? 0.6 : 0.0;
  const finalPct    = basePct * trustMod;
  const payoutAmount = Math.round(lossAmt * finalPct);

  return {
    lossPercent:   +loss.toFixed(1),
    lossAmount:    +lossAmt.toFixed(2),
    payoutTier:    tier,
    basePct,
    trustMod,
    finalPct:      +finalPct.toFixed(2),
    payoutAmount,
  };
}
