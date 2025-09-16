document.addEventListener('DOMContentLoaded', function () {
  // 1) Load partials (navbar + footer), then initialize behaviors
  Promise.all([
    loadPartial('#navbar-placeholder', './partials/navbar.html'),
    loadPartial('#footer-placeholder', './partials/footer.html')
  ]).then(init);

  // --- helpers ---
  function loadPartial(selector, url) {
    var slot = document.querySelector(selector);
    if (!slot) return Promise.resolve();

    return fetch(url, { credentials: 'same-origin' })
      .then(function (res) {
        if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
        return res.text();
      })
      .then(function (html) { slot.innerHTML = html; })
      .catch(function (err) {
        console.error('Include failed:', url, err);
        slot.innerHTML = '<!-- include failed: ' + url + ' -->';
      });
  }

  function init() {
    // 2) Footer year (after footer exists)
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();

    // 3) Smooth scroll for in-page links (respects reduced motion)
    var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var links = document.querySelectorAll('a[href^="#"]');
    links.forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (!href || href === '#') return; // ignore placeholders

        var id = href.slice(1);
        var target = document.getElementById(id);
        if (!target) return; // target not on this page

        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });

        // Close the mobile navbar (if using Bootstrap bundle)
        var nav = document.querySelector('.navbar-collapse');
        if (nav && nav.classList.contains('show') && window.bootstrap) {
          var inst = window.bootstrap.Collapse.getInstance(nav);
          if (!inst) {
            inst = new window.bootstrap.Collapse(nav, { toggle: false });
          }
          inst.hide();
        }
      });
    });

    // 4) Namespaced copyEmail for inline onclick
    window.app = window.app || {};
    window.app.copyEmail = function (btn) {
      var email = (btn && btn.dataset && btn.dataset.email) ? btn.dataset.email : 'hicamillacardoso@gmail.com';

      function flash(text) {
        var label = btn ? btn.querySelector('.copy-label') : null;
        if (!label) return;
        var prev = label.textContent;
        label.textContent = text;
        setTimeout(function () { label.textContent = prev; }, 1600);
      }

      // Use modern Clipboard API when available (HTTPS / localhost)
      if (window.isSecureContext && navigator.clipboard) {
        navigator.clipboard.writeText(email).then(
          function () { flash('Copied!'); },
          function () { flash('Copy failed'); }
        );
      } else {
        // Fallback: prompt (no deprecated execCommand)
        window.prompt('Copy this email:', email);
      }
    };

    // 5) Initialize Bootstrap tooltips
    if (window.bootstrap && window.bootstrap.Tooltip) {
      document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function (el) {
        new window.bootstrap.Tooltip(el);
      });
    }
  }
});