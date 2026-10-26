// Distribution Network / Territory screen.
// Redesigned for a simpler, more sensible default: the district grid is
// always visible (no hidden/collapsed state requiring an extra click),
// filterable by search + status + region, sorted with open territories
// first so the business opportunity still gets priority without needing a
// separate spotlight section. Data carried over from the client's prototype
// (tnDistrictsData) — no lat/lng exists, so this never renders a literal map.

var DISTRICTS = [
  { name: 'Erode Central Hub', region: 'Kongu Belt', statusCat: 'active', statusLabel: 'Active Warehouse Hub', dispatch: 'Same Day Dispatch', demand: 'High', capacity: 'Primary Stockist Center' },
  { name: 'Coimbatore North & South', region: 'Kongu Belt', statusCat: 'open', statusLabel: 'Open for Stockist', dispatch: '24 Hours Route Run', demand: 'Very High', capacity: '2,500+ Cartons/mo' },
  { name: 'Salem Metro & Rural', region: 'Kongu Belt', statusCat: 'open', statusLabel: 'Open for Stockist', dispatch: '24 Hours Route Run', demand: 'High', capacity: '2,000+ Cartons/mo' },
  { name: 'Tirupur Apparel & Town', region: 'Kongu Belt', statusCat: 'active', statusLabel: 'Active Stockist Route', dispatch: '12 Hours Direct Run', demand: 'High', capacity: '1,800+ Cartons/mo' },
  { name: 'Karur & Namakkal', region: 'Central', statusCat: 'open', statusLabel: 'Open for Stockist', dispatch: '24 Hours Route Run', demand: 'Moderate', capacity: '1,200+ Cartons/mo' },
  { name: 'Trichy & Dindigul', region: 'Central', statusCat: 'open', statusLabel: 'Open for Stockist', dispatch: '24–36 Hours', demand: 'High', capacity: '2,200+ Cartons/mo' },
  { name: 'Madurai & Virudhunagar', region: 'South', statusCat: 'open', statusLabel: 'Open for Stockist', dispatch: '36–48 Hours', demand: 'Very High', capacity: '3,000+ Cartons/mo' },
  { name: 'Tirunelveli & Kanyakumari', region: 'South', statusCat: 'open', statusLabel: 'Open for Stockist', dispatch: '48 Hours', demand: 'Moderate', capacity: '1,500+ Cartons/mo' }
];

var REGION_META = [
  { key: 'All', label: 'All Districts' },
  { key: 'Kongu Belt', label: 'Kongu Region (Erode, Kovai, Salem, Tirupur)' },
  { key: 'Central', label: 'Central TN (Trichy, Karur, Dindigul)' },
  { key: 'South', label: 'South TN (Madurai, Tirunelveli)' }
];

var STATUS_META = [
  { key: 'All', label: 'All statuses' },
  { key: 'open', label: 'Open for stockist' },
  { key: 'active', label: 'Active' }
];

var state = { search: '', status: 'All', region: 'All' };

// ------------------------------------------------------------------ shared

function statusPillHtml(d) {
  var cls = d.statusCat === 'active' ? 'is-active' : 'is-open';
  return '<span class="status-pill ' + cls + '">' + d.statusLabel + '</span>';
}

function territoryCardHtml(d) {
  var footer = d.statusCat === 'open'
    ? '<a href="apply.html?town=' + encodeURIComponent(d.name) + '" data-prefill-town="' + d.name + '" class="btn btn-amber">Apply for Territory</a>'
    : '<a href="https://wa.me/919994222846?text=' + encodeURIComponent('Hi, I have a question about the ' + d.name + ' territory.') + '" class="quiet-link" target="_blank" rel="noopener">Ask about this hub <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>';

  return '' +
    '<div class="territory-card is-' + d.statusCat + '">' +
      '<button type="button" class="territory-card-clickable" data-open-territory="' + d.name + '" aria-label="View details for ' + d.name + '">' +
        '<div class="territory-card-head">' +
          '<div><div class="territory-name">' + d.name + '</div><div class="territory-region">' + d.region + '</div></div>' +
          statusPillHtml(d) +
        '</div>' +
        '<div class="territory-stats-row">' +
          '<div class="territory-stat"><span class="stat-label">Dispatch</span><span class="stat-val">' + d.dispatch + '</span></div>' +
          '<div class="territory-stat"><span class="stat-label">Demand</span><span class="stat-val">' + d.demand + '</span></div>' +
          '<div class="territory-stat"><span class="stat-label">' + (d.statusCat === 'active' ? 'Role' : 'Capacity') + '</span><span class="stat-val">' + d.capacity + '</span></div>' +
        '</div>' +
      '</button>' +
      '<div class="territory-footer">' + footer + '</div>' +
    '</div>';
}

// ------------------------------------------------------------------ filtering

function getFiltered() {
  var list = DISTRICTS.filter(function (d) {
    var matchesSearch = state.search === '' || d.name.toLowerCase().indexOf(state.search.toLowerCase()) !== -1;
    var matchesStatus = state.status === 'All' || d.statusCat === state.status;
    var matchesRegion = state.region === 'All' || d.region === state.region;
    return matchesSearch && matchesStatus && matchesRegion;
  });
  // Open territories first — the actual business opportunity — without
  // needing a separate spotlight section.
  return list.slice().sort(function (a, b) {
    if (a.statusCat === b.statusCat) return 0;
    return a.statusCat === 'open' ? -1 : 1;
  });
}

function hasActiveFilters() { return state.status !== 'All' || state.region !== 'All' || state.search !== ''; }

function emptyStateHtml() {
  var isSearch = state.search !== '';
  var isFiltered = state.status !== 'All' || state.region !== 'All';
  var message = 'Try a different search term.';
  if (isSearch && isFiltered) message = 'No districts match "' + state.search + '" within the current filters.';
  else if (isSearch) message = 'No districts match "' + state.search + '". It may not be mapped yet — that doesn’t mean it’s unavailable.';
  else if (isFiltered) message = 'No districts match the selected status and region.';

  return '' +
    '<div class="empty-state">' +
      '<div class="empty-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg></div>' +
      '<h3>No territories found</h3>' +
      '<p>' + message + '</p>' +
      (isSearch
        ? '<a href="https://wa.me/919994222846?text=' + encodeURIComponent('Hi, I want to check if you cover ' + state.search + '.') + '" class="btn btn-amber" target="_blank" rel="noopener" style="margin-top:10px;">Ask on WhatsApp</a>'
        : '<a href="#" class="link-arrow" data-reset-filters>Clear filters</a>') +
    '</div>';
}

// ------------------------------------------------------------------ render

function renderChips() {
  var statusWrap = document.getElementById('status-chips');
  statusWrap.innerHTML = STATUS_META.map(function (s) {
    var active = state.status === s.key ? ' is-active' : '';
    return '<button type="button" class="chip-filter' + active + '" data-status="' + s.key + '">' + s.label + '</button>';
  }).join('');

  var regionWrap = document.getElementById('region-pills');
  regionWrap.innerHTML = REGION_META.map(function (r) {
    var active = state.region === r.key ? ' is-active' : '';
    return '<button type="button" class="cat-tab' + active + '" data-region="' + r.key + '">' + r.label + '</button>';
  }).join('');
}

function renderGrid() {
  var grid = document.getElementById('territory-grid');
  var countEl = document.getElementById('result-count');
  var filtered = getFiltered();

  if (countEl) countEl.textContent = filtered.length + ' of ' + DISTRICTS.length + ' districts';
  grid.innerHTML = filtered.length === 0 ? emptyStateHtml() : filtered.map(territoryCardHtml).join('');
}

function renderClearVisibility() {
  var btn = document.getElementById('clear-filters-btn');
  btn.hidden = !hasActiveFilters();
}

function renderAll() { renderChips(); renderGrid(); renderClearVisibility(); }

// ---------------------------------------------------------------- detail drawer

function openTerritory(name) {
  var d = DISTRICTS.filter(function (x) { return x.name === name; })[0];
  if (!d) return;
  var overlay = document.getElementById('drawer-overlay');
  var panel = document.getElementById('drawer-panel');

  var footer = d.statusCat === 'open'
    ? '<a href="apply.html?town=' + encodeURIComponent(d.name) + '" data-prefill-town="' + d.name + '" class="btn btn-amber" style="flex:1; text-align:center;">Apply for This Territory</a>'
    : '<span class="btn btn-outline-light" style="flex:1; text-align:center; cursor: default;">Hub already active</span>';

  panel.innerHTML = '' +
    '<button class="drawer-close" data-close-drawer aria-label="Close"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
    '<div class="drawer-visual" style="background:' + (d.statusCat === 'active' ? 'var(--green-soft)' : 'var(--amber-soft)') + '; color:' + (d.statusCat === 'active' ? 'var(--green)' : 'var(--amber-hover)') + ';">' +
      '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z"/><circle cx="12" cy="8" r="2.5"/></svg>' +
      '<span class="product-category-label" style="color:inherit; opacity:0.9;">' + d.region + '</span>' +
    '</div>' +
    '<div class="drawer-content">' +
      '<div>' + statusPillHtml(d) + '<h2 style="font-size: 22px; margin-top: 10px;">' + d.name + '</h2></div>' +
      '<div>' +
        '<div class="drawer-spec-row" style="border-top:none;"><span class="label">Dispatch turnaround</span><span class="val">' + d.dispatch + '</span></div>' +
        '<div class="drawer-spec-row"><span class="label">Market demand</span><span class="val">' + d.demand + '</span></div>' +
        '<div class="drawer-spec-row"><span class="label">' + (d.statusCat === 'active' ? 'Role' : 'Order capacity') + '</span><span class="val">' + d.capacity + '</span></div>' +
      '</div>' +
      '<p class="text-slate" style="font-size: 13px; line-height: 1.6;">' +
        (d.statusCat === 'open'
          ? 'This territory does not have an appointed stockist yet — apply to request exclusive district or town rights here.'
          : 'This territory already has an active stockist presence. Reach out if you’d like to ask about it or discuss a neighboring town.') +
      '</p>' +
    '</div>' +
    '<div class="drawer-footer">' +
      footer +
      '<a href="https://wa.me/919994222846?text=' + encodeURIComponent('Hi, I have a question about the ' + d.name + ' territory.') + '" class="btn btn-outline-light" style="padding: 12px 16px;" target="_blank" rel="noopener">WhatsApp</a>' +
    '</div>';

  overlay.classList.add('is-open');
}

function closeDetail() { document.getElementById('drawer-overlay').classList.remove('is-open'); }

// ------------------------------------------------------------------ init

document.addEventListener('DOMContentLoaded', function () {
  var grid = document.getElementById('territory-grid');
  if (!grid) return;

  renderAll();

  document.getElementById('territory-search').addEventListener('input', function (e) {
    state.search = e.target.value;
    renderGrid();
    renderClearVisibility();
  });

  document.body.addEventListener('click', function (e) {
    var openBtn = e.target.closest('[data-open-territory]');
    if (openBtn) { openTerritory(openBtn.getAttribute('data-open-territory')); return; }

    // "Apply for This Territory" — hand the district name to apply.html via
    // sessionStorage, not just the ?town= URL param. Some browsers (Safari
    // in particular) don't reliably preserve query strings across a plain
    // <a href> navigation on file:// URLs, so the URL param alone isn't
    // trustworthy for a site opened by double-clicking the HTML file. The
    // anchor's real href still navigates normally — this only piggybacks
    // extra data alongside it.
    var prefillBtn = e.target.closest('[data-prefill-town]');
    if (prefillBtn) {
      try { sessionStorage.setItem('prefillTown', prefillBtn.getAttribute('data-prefill-town')); } catch (err) {}
    }

    var statusBtn = e.target.closest('[data-status]');
    if (statusBtn) { state.status = statusBtn.getAttribute('data-status'); renderAll(); return; }

    var regionBtn = e.target.closest('[data-region]');
    if (regionBtn) { state.region = regionBtn.getAttribute('data-region'); renderAll(); return; }

    if (e.target.closest('[data-close-drawer]') || e.target.id === 'drawer-overlay') { closeDetail(); return; }

    if (e.target.closest('[data-reset-filters]')) {
      e.preventDefault();
      state = { search: '', status: 'All', region: 'All' };
      document.getElementById('territory-search').value = '';
      renderAll();
      return;
    }

    if (e.target.id === 'clear-filters-btn') {
      state = { search: '', status: 'All', region: 'All' };
      document.getElementById('territory-search').value = '';
      renderAll();
      return;
    }
  });

  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDetail(); });
});
