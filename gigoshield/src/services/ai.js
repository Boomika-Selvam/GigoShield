/* ============================================================
   GIGOSHIELD — services/ai.js
   Gemini Flash 2.5 integration.
   Handles key management, chat messages, and context building.
   ============================================================ */

/* ── Key Management ─────────────────────────────────────── */

function openGeminiModal() {
  document.getElementById('geminiModal').style.display = 'flex';
}

function closeGeminiModal() {
  document.getElementById('geminiModal').style.display = 'none';
}

function saveGeminiKey() {
  const key = document.getElementById('geminiKeyInput').value.trim();
  if (!key) { toast('Please enter an API key', 'error'); return; }
  State.geminiKey = key;
  closeGeminiModal();
  toast('Gemini AI enabled! ✨', 'success');
  openAIPanel();
}

/* ── Panel Controls ─────────────────────────────────────── */

function openAIPanel() {
  if (!State.geminiKey) { openGeminiModal(); return; }
  document.getElementById('ai-panel').classList.add('open');
  document.body.classList.add('ai-open');
}

function closeAIPanel() {
  document.getElementById('ai-panel').classList.remove('open');
  document.body.classList.remove('ai-open');
}

function toggleAIPanel() {
  const panel = document.getElementById('ai-panel');
  if (panel.classList.contains('open')) closeAIPanel();
  else openAIPanel();
}

/* ── Message Sending ────────────────────────────────────── */

async function sendAIMsg() {
  const input = document.getElementById('aiInput');
  const msg   = input.value.trim();
  if (!msg) return;
  input.value = '';
  await askAI(msg);
}

/**
 * Send a message to Gemini with full platform context.
 * Appends user and bot messages to the chat panel.
 *
 * @param {string} msg  User's question
 */
async function askAI(msg) {
  const chatArea = document.getElementById('aiChatArea');

  chatArea.innerHTML += `<div class="ai-msg user">${escapeHtml(msg)}</div>`;
  chatArea.innerHTML += `<div class="ai-msg thinking" id="aiThinking">🤔 Thinking...</div>`;
  chatArea.scrollTop  = chatArea.scrollHeight;

  if (!State.geminiKey) {
    document.getElementById('aiThinking').remove();
    chatArea.innerHTML += `<div class="ai-msg bot">⚠️ No Gemini API key configured. <span class="ai-chip" onclick="openGeminiModal()">Add Key</span></div>`;
    chatArea.scrollTop  = chatArea.scrollHeight;
    return;
  }

  const context = buildContext();

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${State.geminiKey}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          contents: [{
            role:  'user',
            parts: [{ text: `${context}\n\nUser question: ${msg}` }],
          }],
          generationConfig: { maxOutputTokens: 400, temperature: 0.7 },
        }),
      }
    );

    const data  = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
                  || 'Sorry, I could not generate a response.';

    document.getElementById('aiThinking').remove();
    chatArea.innerHTML += `<div class="ai-msg bot">${formatAIReply(reply)}</div>`;

  } catch (e) {
    document.getElementById('aiThinking').remove();
    chatArea.innerHTML += `<div class="ai-msg bot">❌ Error: ${e.message}. Check your API key.</div>`;
  }

  chatArea.scrollTop = chatArea.scrollHeight;
}

/* ── Context Builder ────────────────────────────────────── */

/**
 * Build a rich system prompt with live platform data injected
 * so Gemini can answer context-aware questions.
 */
function buildContext() {
  const cityData = State.weather[State.selectedCity];
  const paid     = claimsDB.filter(c => c.status === 'paid').length;
  const rejected = claimsDB.filter(c => c.status === 'rejected').length;

  return `You are GigoShield's AI assistant — a parametric insurance platform protecting India's gig economy delivery workers from income loss due to weather events and fraud.

Current city selected: ${cityData?.city || 'Mumbai'}
Live weather: temp ${cityData?.temp ?? '?'}°C, rain ${cityData?.rain ?? '?'} mm/h, wind ${cityData?.wind ?? '?'} km/h, humidity ${cityData?.humidity ?? '?'}%
Active triggers: ${cityData?.triggers?.active ? cityData.triggers.fired.map(f => f.type).join(', ') : 'None currently active'}

Parametric thresholds: rain > ${State.thresholds.rain} mm/h, heat > ${State.thresholds.heat}°C, wind > ${State.thresholds.wind} km/h, AQI > ${State.thresholds.aqi}

Claims summary: total=${claimsDB.length}, paid=${paid}, rejected=${rejected}, partial=${claimsDB.length - paid - rejected}

Trust score formula: Score = 0.30×Movement + 0.30×Activity + 0.20×PeerMatch + 0.20×ClaimHistory
  • Score ≥ 0.80 → Instant full UPI payout
  • Score 0.50–0.79 → 60% now + 24h re-verify
  • Score < 0.50 → Human review (48h SLA)

Premium formula: ₹50 + RiskScore (Basic plan) or × 1.4 (Pro plan)
Risk score: Zone base + Platform modifier + Experience modifier (capped at 100)

Anti-fraud signals: GPS road snap, accelerometer, IP subnet clustering, claim timing analysis, order activity logs, device fingerprint, cell tower match, speed entropy, peer density comparison.

Be concise, data-driven, and empathetic toward gig workers. Relate every answer to income protection and financial safety.`;
}

/* ── Helpers ────────────────────────────────────────────── */

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function formatAIReply(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}
