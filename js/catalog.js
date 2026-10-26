// Product Catalog — data, filtering, pagination, detail drawer, enquiry list.
// Data sourced from "Mass Distributors TN Consignment Details Updated.xlsx"
// (real: code, name, category, pack). No price/availability data exists for
// these SKUs, so neither is shown or filterable — see the plan's data-
// discipline note.

// `image` is only set where a real product photo exists (from the client's
// own Shan brand brochure) and clearly matches this exact SKU — a few items
// (Punjabi Yakhni Pilau, both Zafrani Garam Masala packs) have no distinct
// photo in that set and are deliberately left without one rather than
// reusing a different product's image.
var PRODUCTS = [
  { code: '203002', name: 'Shan Pulau Biryani', pack: '50g', category: 'Biryani & Rice Mixes', image: 'images/products/pilau-biryani.png' },
  { code: '202002', name: 'Shan Biryani', pack: '50g', category: 'Biryani & Rice Mixes', image: 'images/products/biryani-masala.png' },
  { code: '202007', name: 'Shan Biryani', pack: '25g', category: 'Biryani & Rice Mixes', image: 'images/products/biryani-masala.png' },
  { code: '204002', name: 'Shan Special Bombay Biryani', pack: '60g', category: 'Biryani & Rice Mixes', image: 'images/products/bombay-biryani.png' },
  { code: '204007', name: 'Shan Special Bombay Biryani', pack: '30g', category: 'Biryani & Rice Mixes', image: 'images/products/bombay-biryani.png' },
  { code: '202502', name: 'Shan Malay Chicken Biryani', pack: '60g', category: 'Biryani & Rice Mixes', image: 'images/products/malay-chicken-biryani.png' },
  { code: '202507', name: 'Shan Malay Chicken Biryani', pack: '30g', category: 'Biryani & Rice Mixes', image: 'images/products/malay-chicken-biryani.png' },
  { code: '201802', name: 'Shan Sindhi Biryani', pack: '60g', category: 'Biryani & Rice Mixes', image: 'images/products/sindhi-biryani.png' },
  { code: '202602', name: 'Shan Memoni Button Biryani', pack: '60g', category: 'Biryani & Rice Mixes', image: 'images/products/memoni-mutton-biryani.png' },
  { code: '202702', name: 'Shan Punjabi Yakhni Pilau', pack: '50g', category: 'Biryani & Rice Mixes' },

  { code: '202902', name: 'Shan Shami Kabab', pack: 'Standard', category: 'BBQ & Kabab Mixes', image: 'images/products/shami-kabab.png' },
  { code: '208002', name: 'Shan Seekh Kabab', pack: '50g', category: 'BBQ & Kabab Mixes', image: 'images/products/seekh-kabab.png' },
  { code: '203202', name: 'Shan Chapli Kabab', pack: 'Standard', category: 'BBQ & Kabab Mixes', image: 'images/products/chapli-kabab.png' },
  { code: '206002', name: 'Shan Chicken Tikka', pack: '50g', category: 'BBQ & Kabab Mixes', image: 'images/products/chicken-tikka.png' },
  { code: '206007', name: 'Shan Chicken Tikka', pack: '25g', category: 'BBQ & Kabab Mixes', image: 'images/products/chicken-tikka.png' },
  { code: '207002', name: 'Shan Tandoori Masala', pack: '50g', category: 'BBQ & Kabab Mixes', image: 'images/products/tandoori-masala.png' },
  { code: '207007', name: 'Shan Tandoori Masala', pack: '25g', category: 'BBQ & Kabab Mixes', image: 'images/products/tandoori-masala.png' },
  { code: '201002', name: 'Shan Tikka Boti', pack: '50g', category: 'BBQ & Kabab Mixes', image: 'images/products/tikka-boti-masala.png' },

  { code: '201102', name: 'Shan Nihari', pack: '60g', category: 'Curry & Meat Mixes', image: 'images/products/nihari.png' },
  { code: '201302', name: 'Shan Achar Gosht', pack: '50g', category: 'Curry & Meat Mixes', image: 'images/products/achar-gosht.png' },
  { code: '205002', name: 'Shan Chicken Masala', pack: '50g', category: 'Curry & Meat Mixes', image: 'images/products/chicken-masala.png' },
  { code: '205007', name: 'Shan Chicken Masala', pack: '25g', category: 'Curry & Meat Mixes', image: 'images/products/chicken-masala.png' },
  { code: '209002', name: 'Shan Korma', pack: '50g', category: 'Curry & Meat Mixes', image: 'images/products/korma.png' },
  { code: '202802', name: 'Shan Keema', pack: '50g', category: 'Curry & Meat Mixes', image: 'images/products/keema.png' },
  { code: '201502', name: 'Shan Fried Fish', pack: '50g', category: 'Curry & Meat Mixes', image: 'images/products/fried-fish.png' },
  { code: '201202', name: 'Shan Karahi Gosht', pack: '50g', category: 'Curry & Meat Mixes', image: 'images/products/karahi.png' },
  { code: '202102', name: 'Shan Butter Chicken', pack: '50g', category: 'Curry & Meat Mixes', image: 'images/products/butter-chicken.png' },
  { code: '202402', name: 'Shan Meat Masala', pack: '100g', category: 'Curry & Meat Mixes', image: 'images/products/meat-masala.png' },
  { code: '202202', name: 'Shan Paya Masala', pack: '50g', category: 'Curry & Meat Mixes', image: 'images/products/paya.png' },

  { code: '201902', name: 'Shan Haleem Masala', pack: '50g', category: 'Specialty & General Spice Mixes', image: 'images/products/haleem-masala.png' },
  { code: '203302', name: 'Shan Shahi Haleem', pack: '300g', category: 'Specialty & General Spice Mixes', image: 'images/products/shahi-haleem.png' },
  { code: '202302', name: 'Shan Chana Masala', pack: '100g', category: 'Specialty & General Spice Mixes', image: 'images/products/chana-masala.png' },
  { code: '201602', name: 'Shan Chaat Masala', pack: '100g', category: 'Specialty & General Spice Mixes', image: 'images/products/chaat-masala.png' },
  { code: '211502', name: 'Shan Zafrani Garam Masala (115)', pack: '50g', category: 'Specialty & General Spice Mixes', image: 'images/products/garam-masala.png' },
  { code: '211503', name: 'Shan Zafrani Garam Masala (130)', pack: '50g', category: 'Specialty & General Spice Mixes', image: 'images/products/garam-masala.png' },

  { code: '204302', name: 'Shahi Paneer Masala', pack: '100g', category: 'Vegetarian Mixes', image: 'images/products/shahi-paneer.png' },
  { code: '204502', name: 'Paneer Butter Masala', pack: '100g', category: 'Vegetarian Mixes', image: 'images/products/paneer-butter-masala.png' }
];

var CATEGORY_META = {
  'Biryani & Rice Mixes': {
    short: 'Biryani & Rice',
    bg: 'var(--cat-biryani-bg)', fg: 'var(--cat-biryani-fg)',
    icon: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 11h16"/><path d="M5 11a7 7 0 0014 0"/><path d="M12 11V5"/><path d="M9 5c0 1.3 1.2 2 3 2s3-.7 3-2"/></svg>'
  },
  'BBQ & Kabab Mixes': {
    short: 'BBQ & Kabab',
    bg: 'var(--cat-bbq-bg)', fg: 'var(--cat-bbq-fg)',
    icon: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2c1.5 2 2 3.5 1 5-1 1.2-2 .5-2-.5-1 1-1.5 2.5-.5 4 1.3 1.3 3.5 1 4-1 1 2 .3 4.5-1.8 5.8-2.5 1.6-5.7.5-6.7-2.2-1-2.7.3-5.3 2-7C10 4 11 3 12 2z"/></svg>'
  },
  'Curry & Meat Mixes': {
    short: 'Curry & Meat',
    bg: 'var(--cat-curry-bg)', fg: 'var(--cat-curry-fg)',
    icon: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 10h16l-1.2 8.2a2 2 0 01-2 1.8H7.2a2 2 0 01-2-1.8L4 10z"/><path d="M2 10h20"/><path d="M9 10V7a3 3 0 016 0v3"/></svg>'
  },
  'Specialty & General Spice Mixes': {
    short: 'Specialty',
    bg: 'var(--cat-specialty-bg)', fg: 'var(--cat-specialty-fg)',
    icon: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l2.6 6.6L21 11l-6.4 2.4L12 20l-2.6-6.6L3 11l6.4-2.4L12 2z"/></svg>'
  },
  'Vegetarian Mixes': {
    short: 'Vegetarian',
    bg: 'var(--cat-veg-bg)', fg: 'var(--cat-veg-fg)',
    icon: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 9a11 11 0 0122 0"/><path d="M5 12a7 7 0 0114 0"/><path d="M9 15a3 3 0 016 0"/><circle cx="12" cy="19" r="1"/></svg>'
  }
};

var CATEGORIES = ['All'].concat(Object.keys(CATEGORY_META));

function packBucket(pack) {
  if (pack === 'Standard') return 'Standard pack';
  var g = parseInt(pack, 10);
  if (g <= 30) return '25g–30g';
  if (g <= 60) return '50g–60g';
  if (g === 100) return '100g';
  return '300g+';
}

var PACK_BUCKETS = ['25g–30g', '50g–60g', '100g', '300g+', 'Standard pack'];

// ------------------------------------------------------------------ state

var state = {
  search: '',
  category: 'All',
  packBuckets: [],   // multi-select
  visibleCount: 12,
  enquiry: [],        // array of product codes
  view: 'grid'        // 'grid' | 'list' — no product photography exists, so
                       // list view is a first-class way to scan/compare, not
                       // an afterthought
};

var PAGE_SIZE = 12;
var ENQUIRY_KEY = 'md_enquiry_list';

try {
  var saved = sessionStorage.getItem(ENQUIRY_KEY);
  if (saved) state.enquiry = JSON.parse(saved);
} catch (e) { /* sessionStorage unavailable — enquiry list just won't persist */ }

function saveEnquiry() {
  try { sessionStorage.setItem(ENQUIRY_KEY, JSON.stringify(state.enquiry)); } catch (e) {}
}

// -------------------------------------------------------------- filtering

function getFiltered() {
  return PRODUCTS.filter(function (p) {
    var matchesSearch = state.search === '' || p.name.toLowerCase().indexOf(state.search.toLowerCase()) !== -1;
    var matchesCategory = state.category === 'All' || p.category === state.category;
    var matchesPack = state.packBuckets.length === 0 || state.packBuckets.indexOf(packBucket(p.pack)) !== -1;
    return matchesSearch && matchesCategory && matchesPack;
  });
}

function hasActiveFilters() {
  return state.packBuckets.length > 0;
}

// ---------------------------------------------------------------- render

function smallIcon(meta, size) {
  return meta.icon.replace(/width="\d+"/, 'width="' + size + '"').replace(/height="\d+"/, 'height="' + size + '"');
}

function cardHtml(p) {
  var meta = CATEGORY_META[p.category];
  var isAdded = state.enquiry.indexOf(p.code) !== -1;
  var media = p.image
    ? '<span class="product-card-photo img-wrap"><img class="img-fade" src="' + p.image + '" alt="' + p.name + ' pack" loading="lazy"></span>'
    : '<span class="product-card-photo product-card-photo-fallback" style="background:' + meta.bg + '; color:' + meta.fg + ';">' + smallIcon(meta, 26) + '</span>';
  return '' +
    '<div class="product-card" data-code="' + p.code + '">' +
      '<button type="button" class="product-card-media" data-open-detail="' + p.code + '" tabindex="-1" aria-hidden="true">' + media + '</button>' +
      '<div class="product-card-body">' +
      '<button type="button" class="product-card-clickable" data-open-detail="' + p.code + '" aria-label="View details for ' + p.name + '">' +
        '<span class="item-code-top">#' + p.code + '</span>' +
        '<span class="name-row">' +
          '<span class="row-cat-dot" style="background:' + meta.fg + ';" title="' + meta.short + '"></span>' +
          '<span class="product-name">' + p.name + '</span>' +
        '</span>' +
        '<span class="product-meta">' + p.pack + '</span>' +
      '</button>' +
      '<div class="card-footer">' +
        '<button type="button" class="card-enquiry-text' + (isAdded ? ' is-added' : '') + '" data-toggle-enquiry="' + p.code + '">' +
          (isAdded
            ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display:inline;"><path d="M4 12l5 5L20 6"/></svg> Added'
            : '+ Add to Enquiry') +
        '</button>' +
        '<button type="button" class="card-details-btn" data-open-detail="' + p.code + '" aria-label="View details">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
        '</button>' +
      '</div>' +
      '</div>' +
    '</div>';
}

function listRowHtml(p) {
  var meta = CATEGORY_META[p.category];
  var isAdded = state.enquiry.indexOf(p.code) !== -1;
  var thumb = p.image ? '<span class="list-thumb img-wrap"><img class="img-fade" src="' + p.image + '" alt="" loading="lazy"></span>' : '';
  return '' +
    '<div class="list-row" data-code="' + p.code + '">' +
      '<div class="list-cat-bar" style="background:' + meta.fg + ';"></div>' +
      '<span class="list-name" data-open-detail="' + p.code + '">' + thumb + '<span>' + p.name + '</span></span>' +
      '<span class="list-category">' + meta.short + '</span>' +
      '<span class="list-pack">' + p.pack + '</span>' +
      '<span class="list-code">' + p.code + '</span>' +
      '<div class="list-actions">' +
        '<button type="button" class="btn-enquiry' + (isAdded ? ' is-added' : '') + '" data-toggle-enquiry="' + p.code + '">' +
          (isAdded ? 'Added' : '+ Enquiry') +
        '</button>' +
        '<button type="button" class="btn-view-details" data-open-detail="' + p.code + '">Details</button>' +
      '</div>' +
    '</div>';
}

function emptyStateHtml() {
  var isSearch = state.search !== '';
  var isFiltered = hasActiveFilters() || state.category !== 'All';
  var message = 'Try a different search term.';
  if (isSearch && isFiltered) message = 'No products match "' + state.search + '" within the current filters.';
  else if (isSearch) message = 'No products match "' + state.search + '".';
  else if (isFiltered) message = 'No products match the selected category and pack filters.';

  return '' +
    '<div class="empty-state">' +
      '<div class="empty-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg></div>' +
      '<h3>No products found</h3>' +
      '<p>' + message + '</p>' +
      '<a href="#" class="link-arrow" data-reset-filters>Clear search &amp; filters</a>' +
    '</div>';
}

function renderCategoryTabs() {
  var wrap = document.getElementById('category-tabs');
  if (!wrap) return;
  wrap.innerHTML = CATEGORIES.map(function (cat) {
    var count = cat === 'All' ? PRODUCTS.length : PRODUCTS.filter(function (p) { return p.category === cat; }).length;
    var label = cat === 'All' ? 'All' : CATEGORY_META[cat].short;
    var active = state.category === cat ? ' is-active' : '';
    return '<button type="button" class="cat-tab' + active + '" data-category="' + cat + '">' + label + ' <span class="count">(' + count + ')</span></button>';
  }).join('');
}

function renderPackChips(containerId) {
  var wrap = document.getElementById(containerId);
  if (!wrap) return;
  wrap.innerHTML = PACK_BUCKETS.map(function (bucket) {
    var active = state.packBuckets.indexOf(bucket) !== -1 ? ' is-active' : '';
    return '<button type="button" class="chip-filter' + active + '" data-pack-bucket="' + bucket + '">' + bucket + '</button>';
  }).join('');
}

function renderViewToggle() {
  var gridBtn = document.getElementById('view-toggle-grid');
  var listBtn = document.getElementById('view-toggle-list');
  if (!gridBtn) return;
  gridBtn.classList.toggle('is-active', state.view === 'grid');
  listBtn.classList.toggle('is-active', state.view === 'list');
  document.getElementById('product-grid').hidden = state.view !== 'grid';
  document.getElementById('product-list').hidden = state.view !== 'list';
}

function renderGrid() {
  var grid = document.getElementById('product-grid');
  var list = document.getElementById('product-list');
  var countEl = document.getElementById('result-count');
  var loadMoreWrap = document.getElementById('load-more-wrap');
  if (!grid) return;

  var filtered = getFiltered();

  if (countEl) countEl.textContent = filtered.length + ' of ' + PRODUCTS.length + ' products';

  if (filtered.length === 0) {
    grid.innerHTML = emptyStateHtml();
    list.innerHTML = '<div class="list-row" style="grid-template-columns: 1fr; border:none;">' + emptyStateHtml() + '</div>';
    if (loadMoreWrap) loadMoreWrap.hidden = true;
    return;
  }

  var visible = filtered.slice(0, state.visibleCount);
  grid.innerHTML = visible.map(cardHtml).join('');
  list.innerHTML =
    '<div class="list-head-row"><span></span><span>Product</span><span>Category</span><span>Pack</span><span>Code</span><span></span></div>' +
    visible.map(listRowHtml).join('');

  if (loadMoreWrap) {
    var remaining = filtered.length - visible.length;
    loadMoreWrap.hidden = remaining <= 0;
    var btn = document.getElementById('load-more-btn');
    if (btn) btn.textContent = 'Show more (' + remaining + ' remaining)';
  }
}

function renderClearFiltersVisibility() {
  var btn = document.getElementById('clear-filters-btn');
  if (!btn) return;
  btn.hidden = !hasActiveFilters();
}

function renderMobileFilterBadge() {
  var badge = document.getElementById('mobile-filter-badge');
  if (!badge) return;
  var n = state.packBuckets.length;
  badge.hidden = n === 0;
  badge.textContent = n;
}

function renderEnquiryBar() {
  var bar = document.getElementById('enquiry-bar');
  if (!bar) return;
  var n = state.enquiry.length;
  bar.classList.toggle('is-visible', n > 0);
  var countText = document.getElementById('enquiry-count-text');
  if (countText) countText.innerHTML = '<b>' + n + '</b> product' + (n === 1 ? '' : 's') + ' selected';
}

function renderAll() {
  renderCategoryTabs();
  renderPackChips('pack-chips-desktop');
  renderPackChips('pack-chips-sheet');
  renderGrid();
  renderViewToggle();
  renderClearFiltersVisibility();
  renderMobileFilterBadge();
  renderEnquiryBar();
}

// ---------------------------------------------------------------- detail

function openDetail(code) {
  var p = PRODUCTS.filter(function (x) { return x.code === code; })[0];
  if (!p) return;
  var meta = CATEGORY_META[p.category];
  var overlay = document.getElementById('drawer-overlay');
  var panel = document.getElementById('drawer-panel');
  var isAdded = state.enquiry.indexOf(p.code) !== -1;

  var visual = p.image
    ? '<div class="drawer-visual drawer-visual-photo img-wrap">' +
        '<img class="img-fade" src="' + p.image + '" alt="' + p.name + ' pack">' +
        '<span class="product-category-label is-badge" style="background:' + meta.bg + '; color:' + meta.fg + ';">' + p.category + '</span>' +
      '</div>'
    : '<div class="drawer-visual" style="background:' + meta.bg + '; color:' + meta.fg + ';">' +
        smallIcon(meta, 26) +
        '<span class="product-category-label" style="color:' + meta.fg + '; opacity: 0.85;">' + p.category + '</span>' +
      '</div>';

  panel.innerHTML = '' +
    '<button class="drawer-close" data-close-drawer aria-label="Close">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
    '</button>' +
    visual +
    '<div class="drawer-content">' +
      '<div>' +
        '<h2 style="font-size: 22px;">' + p.name + '</h2>' +
      '</div>' +
      '<div>' +
        '<div class="drawer-spec-row" style="border-top:none;"><span class="label">Item code</span><span class="val mono">' + p.code + '</span></div>' +
        '<div class="drawer-spec-row"><span class="label">Pack size</span><span class="val">' + p.pack + '</span></div>' +
        '<div class="drawer-spec-row"><span class="label">Distribution</span><span class="val">Tamil Nadu</span></div>' +
      '</div>' +
      '<p class="text-slate" style="font-size: 13px; line-height: 1.6;">Pricing and live stock status aren’t published here — add this item to your enquiry and the leadership desk will confirm current rates and availability.</p>' +
    '</div>' +
    '<div class="drawer-footer">' +
      '<button type="button" class="btn-enquiry' + (isAdded ? ' is-added' : '') + '" style="flex:1;" data-toggle-enquiry="' + p.code + '">' +
        (isAdded ? 'Added to enquiry' : '+ Add to Enquiry') +
      '</button>' +
      '<a href="https://wa.me/919942675710?text=' + encodeURIComponent('Hi, I\'d like to ask about ' + p.name + ' (' + p.code + ').') + '" class="btn btn-outline-light" style="padding: 12px 16px;" target="_blank" rel="noopener">Ask on WhatsApp</a>' +
    '</div>';

  overlay.classList.add('is-open');
}

function closeDetail() {
  document.getElementById('drawer-overlay').classList.remove('is-open');
}

// --------------------------------------------------------------- enquiry

function toggleEnquiry(code) {
  var idx = state.enquiry.indexOf(code);
  if (idx === -1) state.enquiry.push(code);
  else state.enquiry.splice(idx, 1);
  saveEnquiry();
  renderGrid();
  renderEnquiryBar();

  // If the detail drawer is open for this product, refresh its button too.
  var drawerBtn = document.querySelector('#drawer-panel [data-toggle-enquiry="' + code + '"]');
  if (drawerBtn) {
    var isAdded = state.enquiry.indexOf(code) !== -1;
    drawerBtn.classList.toggle('is-added', isAdded);
    drawerBtn.textContent = isAdded ? 'Added to enquiry' : '+ Add to Enquiry';
  }

  // If the enquiry review panel itself is open (removing an item from that
  // list), re-render it so the item list and the WhatsApp message it builds
  // stay in sync with what was actually removed.
  if (document.getElementById('enquiry-item-list')) {
    openEnquiryPanel();
  }
}

function enquiryWhatsAppHref(items) {
  var lines = items.map(function (p) { return '- ' + p.name + ' (' + p.pack + ')'; }).join('\n');
  var msg = 'Hi, I\'d like to enquire about these products:\n' + lines + '\n\nPlease share catalog and margin details.';
  return 'https://wa.me/919942675710?text=' + encodeURIComponent(msg);
}

function openEnquiryPanel() {
  var overlay = document.getElementById('drawer-overlay');
  var panel = document.getElementById('drawer-panel');
  var items = PRODUCTS.filter(function (p) { return state.enquiry.indexOf(p.code) !== -1; });

  var footer = items.length === 0
    ? '<span class="btn btn-outline-light" style="flex:1; text-align:center; cursor: default;">Add a product to enquire</span>'
    : '<a href="' + enquiryWhatsAppHref(items) + '" class="btn btn-amber" style="flex:1; text-align:center;" target="_blank" rel="noopener">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right:6px; vertical-align:-3px;"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0012.04 2zm5.8 14.09c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.81-.11a16.5 16.5 0 01-1.6-.59c-2.82-1.22-4.66-4.07-4.8-4.26-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07.99-2.35.26-.28.57-.35.76-.35h.55c.18 0 .42-.07.65.5.24.57.81 1.97.88 2.11.07.14.12.31.02.5-.09.19-.14.31-.28.47-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.28.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.18-.28.36-.23.6-.14.24.09 1.55.73 1.81.87.26.14.44.21.5.32.07.12.07.66-.17 1.34z"/></svg>' +
        'Send Enquiry on WhatsApp' +
      '</a>';

  panel.innerHTML = '' +
    '<button class="drawer-close" data-close-drawer aria-label="Close"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
    '<div class="drawer-content" style="padding-top: 56px;">' +
      '<h2 style="font-size: 22px;">Your enquiry</h2>' +
      '<p class="text-slate" style="font-size: 13.5px;">Send this list to the partner desk on WhatsApp — they\'ll reply with catalog and margin details.</p>' +
      '<div id="enquiry-item-list">' +
        (items.length === 0
          ? '<p class="text-slate" style="font-size: 14px; padding: 24px 0;">No products added yet.</p>'
          : items.map(function (p) {
              return '<div class="enquiry-item-row" data-enquiry-row="' + p.code + '">' +
                '<span class="enquiry-item-info">' +
                  (p.image ? '<span class="enquiry-thumb img-wrap"><img class="img-fade" src="' + p.image + '" alt=""></span>' : '') +
                  '<span>' + p.name + ' <span class="text-slate mono" style="font-size:12px;">(' + p.pack + ')</span></span>' +
                '</span>' +
                '<button type="button" class="remove-btn" data-toggle-enquiry="' + p.code + '">Remove</button>' +
              '</div>';
            }).join('')) +
      '</div>' +
    '</div>' +
    '<div class="drawer-footer">' +
      footer +
    '</div>';

  overlay.classList.add('is-open');
}

// ------------------------------------------------------------------ image loading
// Images are injected via innerHTML, so load/error are caught with one
// capture-phase listener (they don't bubble). Until an image loads its
// wrapper shows a shimmer; on error the shimmer stops and the wrapper
// falls back to a neutral box.

function markImage(img, ok) {
  var wrap = img.parentNode;
  if (ok) img.classList.add('is-loaded');
  else img.classList.add('is-failed');
  if (wrap && wrap.classList) wrap.classList.add(ok ? 'is-ready' : 'is-failed');
}

document.addEventListener('load', function (e) {
  if (e.target.classList && e.target.classList.contains('img-fade')) markImage(e.target, true);
}, true);
document.addEventListener('error', function (e) {
  if (e.target.classList && e.target.classList.contains('img-fade')) markImage(e.target, false);
}, true);

// Cached images can finish before the listener sees them.
new MutationObserver(function () {
  var imgs = document.querySelectorAll('img.img-fade:not(.is-loaded):not(.is-failed)');
  for (var i = 0; i < imgs.length; i++) {
    if (imgs[i].complete) markImage(imgs[i], imgs[i].naturalWidth > 0);
  }
}).observe(document.body || document.documentElement, { childList: true, subtree: true });

// ------------------------------------------------------------------ init

document.addEventListener('DOMContentLoaded', function () {
  var grid = document.getElementById('product-grid');
  if (!grid) return;

  // Data is embedded locally, not fetched — there's nothing to actually
  // wait for, so render immediately rather than faking a loading delay.
  // A previous version simulated a 380ms load with a skeleton screen for
  // "architecture realism"; in practice that just made the page feel stuck
  // before a jarring pop-in. The one-time fade-in below gives a real,
  // honest sense of motion instead — applied only to this initial render,
  // not to every later filter/search re-render (which should feel instant).
  renderAll();
  var list = document.getElementById('product-list');
  grid.classList.add('catalog-fade-in');
  if (list) list.classList.add('catalog-fade-in');

  document.getElementById('catalog-search').addEventListener('input', function (e) {
    state.search = e.target.value;
    state.visibleCount = PAGE_SIZE;
    renderGrid();
  });

  document.getElementById('category-tabs').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-category]');
    if (!btn) return;
    state.category = btn.getAttribute('data-category');
    state.visibleCount = PAGE_SIZE;
    renderCategoryTabs();
    renderGrid();
  });

  document.body.addEventListener('click', function (e) {
    var viewBtn = e.target.closest('[data-view]');
    if (viewBtn) { state.view = viewBtn.getAttribute('data-view'); renderViewToggle(); return; }

    var packBtn = e.target.closest('[data-pack-bucket]');
    if (packBtn) {
      var bucket = packBtn.getAttribute('data-pack-bucket');
      var idx = state.packBuckets.indexOf(bucket);
      if (idx === -1) state.packBuckets.push(bucket); else state.packBuckets.splice(idx, 1);
      state.visibleCount = PAGE_SIZE;
      renderPackChips('pack-chips-desktop');
      renderPackChips('pack-chips-sheet');
      renderGrid();
      renderClearFiltersVisibility();
      renderMobileFilterBadge();
      return;
    }

    var toggleBtn = e.target.closest('[data-toggle-enquiry]');
    if (toggleBtn) { toggleEnquiry(toggleBtn.getAttribute('data-toggle-enquiry')); return; }

    var detailTrigger = e.target.closest('[data-open-detail]');
    if (detailTrigger) { openDetail(detailTrigger.getAttribute('data-open-detail')); return; }

    if (e.target.closest('[data-close-drawer]') || e.target.id === 'drawer-overlay') { closeDetail(); return; }

    if (e.target.closest('[data-reset-filters]')) {
      e.preventDefault();
      state.search = ''; state.category = 'All'; state.packBuckets = []; state.visibleCount = PAGE_SIZE;
      document.getElementById('catalog-search').value = '';
      renderAll();
      return;
    }

    if (e.target.id === 'clear-filters-btn') {
      state.packBuckets = []; state.visibleCount = PAGE_SIZE;
      renderPackChips('pack-chips-desktop'); renderPackChips('pack-chips-sheet');
      renderGrid(); renderClearFiltersVisibility(); renderMobileFilterBadge();
      return;
    }

    if (e.target.id === 'load-more-btn') {
      state.visibleCount += PAGE_SIZE;
      renderGrid();
      return;
    }

    if (e.target.closest('#mobile-filter-open')) { openMobileSheet(); return; }
    if (e.target.closest('#mobile-sheet-clear')) {
      state.packBuckets = [];
      renderPackChips('pack-chips-sheet');
      renderGrid(); renderClearFiltersVisibility(); renderMobileFilterBadge();
      return;
    }
    if (e.target.closest('#mobile-sheet-apply') || e.target.id === 'mobile-filter-overlay') { closeMobileSheet(); return; }

    if (e.target.closest('#enquiry-bar-cta')) { openEnquiryPanel(); return; }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeDetail(); closeMobileSheet(); }
  });
});

function openMobileSheet() {
  renderPackChips('pack-chips-sheet');
  document.getElementById('mobile-filter-overlay').classList.add('is-open');
}

function closeMobileSheet() {
  document.getElementById('mobile-filter-overlay').classList.remove('is-open');
}
