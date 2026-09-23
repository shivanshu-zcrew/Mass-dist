// Application form handling.
// NOTE: this is a static site with no backend — there is nowhere for this
// form to actually send data yet. Wire this up to a form-handling service
// (e.g. Formspree) or a serverless function before launch. For now it
// validates inline and shows a real confirmation panel in place of a fake
// network response. There is deliberately no submission-failure or
// duplicate-application state here — neither can happen honestly without
// a real backend to produce them.

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

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    var submitBtn = form.querySelector('.apply-submit-btn');
    var originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';

    // Placeholder for the real submit — swap for a fetch() to a form
    // handler once one is chosen.
    window.setTimeout(function () {
      form.hidden = true;
      document.getElementById('apply-success').hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }, 600);
  });
});
