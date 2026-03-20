/* ============================================================
   GIGOSHIELD — services/utils.js
   Shared utility functions used across all pages.
   ============================================================ */

/**
 * Display a toast notification.
 * @param {string} msg
 * @param {'success'|'error'|'info'} type
 */
function toast(msg, type = 'info') {
  const el = document.createElement('div');
  el.className  = `toast toast-${type}`;
  el.textContent = msg;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

/**
 * Return a coloured badge HTML string for a claim status.
 * @param {string} status
 * @returns {string}
 */
function statusBadge(status) {
  const map = {
    paid:       '<span class="badge badge-green">✅ Paid</span>',
    partial:    '<span class="badge badge-amber">⏳ Partial</span>',
    processing: '<span class="badge badge-cyan">🔄 Processing</span>',
    rejected:   '<span class="badge badge-red">❌ Rejected</span>',
  };
  return map[status] || `<span class="badge badge-gray">${status}</span>`;
}

/**
 * Convert a Unix timestamp to a human-readable "time ago" string.
 * @param {number} ts
 * @returns {string}
 */
function timeAgo(ts) {
  const diff = Date.now() - ts;
  const h    = Math.floor(diff / 3_600_000);
  if (h < 1)  return `${Math.floor(diff / 60_000)}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/**
 * Async sleep helper used in animations.
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Render a list of claims as HTML table rows.
 * @param {Claim[]} list
 * @returns {string}
 */
function renderClaimsRows(list) {
  if (!list.length) {
    return `<tr><td colspan="11" style="text-align:center;color:var(--text-muted);padding:24px">No claims found.</td></tr>`;
  }
  return list.map(c => {
    const barColor = c.trust >= 0.8 ? 'var(--green)' : c.trust >= 0.5 ? 'var(--amber)' : 'var(--red)';
    return `
      <tr>
        <td class="mono text-cyan" style="font-size:0.72rem">${c.id}</td>
        <td style="font-weight:600">${c.worker}</td>
        <td><span class="badge badge-gray">${c.platform}</span></td>
        <td><span class="badge badge-amber">${c.trigger.replace(/_/g, ' ')}</span></td>
        <td class="text-sec">${c.city}</td>
        <td class="mono">₹${c.expected.toLocaleString()}</td>
        <td class="text-amber">${c.loss}%</td>
        <td class="text-green mono">₹${c.payout.toLocaleString()}</td>
        <td>
          <div style="display:flex;align-items:center;gap:6px">
            <div class="progress-bar" style="width:50px">
              <div class="progress-fill" style="background:${barColor};width:${c.trust * 100}%"></div>
            </div>
            <span class="mono" style="font-size:0.7rem">${c.trust.toFixed(2)}</span>
          </div>
        </td>
        <td>${statusBadge(c.status)}</td>
        <td style="font-size:0.7rem;color:var(--text-sec)">${timeAgo(c.ts)}</td>
      </tr>`;
  }).join('');
}
