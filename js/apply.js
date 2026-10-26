// Application form handling.
// NOTE: this is a static site with no backend, so nothing is stored or
// emailed. On submit the application is formatted into a WhatsApp message
// to the leadership desk and wa.me is opened with it pre-filled; the
// applicant must still tap Send. Replace with a real form handler (Zoho /
// serverless function) when the backend exists.

document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('apply-form');
  if (!form) return;

  // Coming from "Apply for This Territory" on the Distribution Network page
  // — prefill so the applicant doesn't retype what they already told us by
  // clicking that specific territory. sessionStorage is checked first (set
  // synchronously on click, in js/network.js) since it survives file://
  // navigation reliably; the ?town= URL param is a fallback for when the
  // link is opened directly or the site is served over a real HTTP server.
  var prefillTown = '';
  try { prefillTown = sessionStorage.getItem('prefillTown') || ''; } catch (err) {}
  if (!prefillTown) {
    prefillTown = new URLSearchParams(window.location.search).get('town') || '';
  }
  if (prefillTown) {
    document.getElementById('town').value = prefillTown;
    try { sessionStorage.removeItem('prefillTown'); } catch (err) {}
  }

  var requiredFields = ['contact', 'whatsapp', 'company', 'town', 'warehouse', 'capital'];

  // Optional fields: blank is always fine, but if filled they must be
  // well-formed. Each returns true when the value is acceptable.
  var optionalValidators = {
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); },
    altphone: function (v) { return /^[6-9][0-9]{9}$/.test(v); },
    gstin: isValidGstin
  };
  var optionalFields = Object.keys(optionalValidators);

  // GSTIN: 2-digit state code (01-38, 97, 99) + 10-char PAN (AAAAA9999A)
  // + entity digit/letter + literal 'Z' + mod-36 check character. This
  // proves the number is well-formed, not that it is registered or active.
  var GSTIN_PATTERN = /^(0[1-9]|[12][0-9]|3[0-8]|97|99)[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
  var GSTIN_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  function gstinCheckChar(first14) {
    var sum = 0;
    for (var i = 0; i < 14; i++) {
      var v = GSTIN_CHARS.indexOf(first14.charAt(i)) * (i % 2 === 0 ? 1 : 2);
      sum += Math.floor(v / 36) + (v % 36);
    }
    return GSTIN_CHARS.charAt((36 - (sum % 36)) % 36);
  }

  function isValidGstin(v) {
    return GSTIN_PATTERN.test(v) && gstinCheckChar(v.slice(0, 14)) === v.charAt(14);
  }

  function optionalValue(id) {
    var v = document.getElementById(id).value.trim();
    return id === 'gstin' ? v.toUpperCase().replace(/\s+/g, '') : v;
  }

  function optionalOk(id) {
    var v = optionalValue(id);
    return v === '' || optionalValidators[id](v);
  }

  // Keep GSTIN tidy as the user types/pastes, and strip non-digits from
  // the phone field.
  document.getElementById('gstin').addEventListener('input', function () {
    this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  });
  document.getElementById('altphone').addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '');
  });
  optionalFields.forEach(function (id) {
    var el = document.getElementById(id);
    el.addEventListener('input', function () { if (optionalOk(id)) clearError(id); });
    el.addEventListener('blur', function () { if (!optionalOk(id)) showError(id); });
  });

  function fieldWrap(id) {
    return document.getElementById(id).closest('.apply-field');
  }

  function showError(id) {
    var wrap = fieldWrap(id);
    if (wrap) wrap.classList.add('has-error');
  }

  function clearError(id) {
    var wrap = fieldWrap(id);
    if (wrap) wrap.classList.remove('has-error');
  }

  // Clear a field's error the moment it becomes valid again, so the user
  // isn't stuck staring at a red border after fixing the input.
  requiredFields.forEach(function (id) {
    var el = document.getElementById(id);
    el.addEventListener('input', function () { if (el.checkValidity()) clearError(id); });
    el.addEventListener('change', function () { if (el.checkValidity()) clearError(id); });
  });

  var DESK_NUMBER = '919942675710';

  function clean(id, max) {
    var v = document.getElementById(id).value.replace(/\s+/g, ' ').trim();
    return v.length > max ? v.slice(0, max) + '…' : v;
  }

  function selectedText(id) {
    var el = document.getElementById(id);
    return el.options[el.selectedIndex].text;
  }

  // Formatted with WhatsApp markup (*bold*). Optional fields are left out
  // when blank so the message only contains what the applicant gave us.
  function buildMessage() {
    var lines = [
      '*New Distributor Application*',
      'Mass Distributors website',
      '',
      '*ABOUT THE APPLICANT*',
      'Name: ' + clean('contact', 80),
      'WhatsApp: ' + clean('whatsapp', 15)
    ];
    if (clean('altphone', 15)) lines.push('Alternate no.: ' + clean('altphone', 15));
    if (clean('email', 120)) lines.push('Email: ' + clean('email', 120));
    lines.push('', '*BUSINESS*', 'Company: ' + clean('company', 120));
    if (clean('address', 250)) lines.push('Address: ' + clean('address', 250));
    if (clean('city', 60)) lines.push('City: ' + clean('city', 60));
    if (optionalValue('gstin')) lines.push('GSTIN: ' + optionalValue('gstin'));
    lines.push(
      '',
      '*TERRITORY*',
      'Target district/town: ' + clean('town', 100),
      '',
      '*CAPABILITY*',
      'Warehouse space: ' + selectedText('warehouse'),
      'Working capital: ' + selectedText('capital')
    );
    if (clean('coverage', 400)) lines.push('Current coverage: ' + clean('coverage', 400));
    lines.push('', 'Please confirm my tier and next steps.');
    return lines.join('\n');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var firstInvalid = null;
    requiredFields.forEach(function (id) {
      var el = document.getElementById(id);
      if (el.checkValidity()) {
        clearError(id);
      } else {
        showError(id);
        if (!firstInvalid) firstInvalid = el;
      }
    });

    optionalFields.forEach(function (id) {
      if (optionalOk(id)) {
        clearError(id);
      } else {
        showError(id);
        if (!firstInvalid) firstInvalid = document.getElementById(id);
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    // No backend yet, so the application is handed to the leadership desk
    // as a pre-filled WhatsApp message. The applicant still has to tap Send
    // in WhatsApp — a website cannot send a message on their behalf.
    var url = 'https://wa.me/' + DESK_NUMBER + '?text=' + encodeURIComponent(buildMessage());
    var link = document.getElementById('apply-wa-link');
    if (link) link.href = url;

    // Opened synchronously inside the submit click so popup blockers allow it.
    var opened = window.open(url, '_blank', 'noopener');

    form.hidden = true;
    document.getElementById('apply-success').hidden = false;
    document.getElementById('apply-success').scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (!opened && link) link.focus();
  });
});
