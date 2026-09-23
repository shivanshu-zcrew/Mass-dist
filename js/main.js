// Shared behavior: mobile nav toggle + toast helper. Loaded on every page.

document.addEventListener('DOMContentLoaded', function () {
  var hamburger = document.querySelector('[data-hamburger]');
  var navLinks = document.querySelector('[data-nav-links]');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
  }
});

function showToast(message) {
  var toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(function () {
    toast.classList.remove('is-visible');
  }, 3200);
}
