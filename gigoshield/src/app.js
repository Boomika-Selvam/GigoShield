/* ============================================================
   GIGOSHIELD — app.js
   Application entry point.
   Handles routing, page rendering, and lifecycle hooks.
   This file is loaded last so all pages and services
   are already available in the global scope.
   ============================================================ */

/* ── Page registry ──────────────────────────────────────── */

/** Human-readable page names used in the breadcrumb. */
const PAGE_NAMES = {
  landing:    'Overview',
  dashboard:  'Dashboard',
  weather:    'Weather Monitor',
  onboarding: 'Registration',
  policy:     'My Policy',
  claims:     'Claims',
  fraud:      'Fraud Detector',
  analytics:  'Analytics',
  admin:      'Admin Panel',
};

/**
 * Map of page keys to their render functions.
 * Each function returns an HTML string.
 */
const PAGE_RENDERERS = {
  landing,
  dashboard,
  weather,
  onboarding,
  policy,
  claims,
  fraud,
  analytics,
  admin,
};

/**
 * Map of page keys to their post-render init functions.
 * Called 50ms after innerHTML is written so the DOM is ready.
 */
const PAGE_INITS = {
  dashboard:  initDashboard,
  analytics:  initAnalytics,
  weather:    initWeather,
  fraud:      initFraud,
  claims:     initClaims,
  admin:      initAdmin,
};

/* ── Router ─────────────────────────────────────────────── */

/**
 * Navigate to a page by key.
 * Updates sidebar active state, breadcrumb, and renders content.
 *
 * @param {string} page  One of the keys in PAGE_RENDERERS
 */
function navigate(page) {
  State.currentPage = page;

  // Sidebar highlight
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const navTarget = document.querySelector(`[data-page="${page}"]`);
  if (navTarget) navTarget.classList.add('active');

  // Breadcrumb
  const breadcrumb = document.getElementById('breadcrumbPage');
  if (breadcrumb) breadcrumb.textContent = PAGE_NAMES[page] || page;

  renderPage(page);
  window.scrollTo(0, 0);
}

/**
 * Render a page into #page-content.
 * @param {string} page
 */
function renderPage(page) {
  const container = document.getElementById('page-content');
  const renderer  = PAGE_RENDERERS[page];

  if (!renderer) {
    container.innerHTML = `<div style="padding:60px;text-align:center;color:var(--text-sec)">Page not found: ${page}</div>`;
    return;
  }

  container.innerHTML  = renderer();
  container.className  = 'page-enter';

  // Re-create Lucide icons injected via HTML strings
  lucide.createIcons();

  // Run page-specific init after DOM settles
  const init = PAGE_INITS[page];
  if (init) setTimeout(init, 50);
}

/* ── App boot ───────────────────────────────────────────── */

async function init() {
  // Create Lucide icons in the static shell (sidebar, topbar)
  lucide.createIcons();

  // Render the default landing page
  navigate('landing');

  // Fetch weather for all cities in the background
  refreshWeather();

  // Auto-refresh weather every 5 minutes
  setInterval(refreshWeather, 5 * 60 * 1000);

  // Keep the claims badge in the sidebar up to date
  setInterval(() => {
    const badge = document.getElementById('claimsCount');
    if (badge) badge.textContent = claimsDB.length;
  }, 2000);
}

// Kick off the app once the DOM is ready
document.addEventListener('DOMContentLoaded', init);
