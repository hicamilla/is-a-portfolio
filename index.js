// Beginner-friendly partial loader + simple behaviors
// Works with placeholders: <div id="navbar-placeholder"></div> and <div id="footer-placeholder"></div>

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

    return fetch(url)
      .then(function (res) { return res.text(); })
      .then(function (html) { slot.outerHTML = html; })
      .catch(function (err) {
        console.error('Include failed:', url, err);
        slot.outerHTML = '<!-- include failed: ' + url + ' -->';
      });
  }

  function init() {
    // 2) Footer year (after footer exists)
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();

    // 3) Smooth scroll for in-page links
    var links = document.querySelectorAll('a[href^="#"]');
    links.forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (!href || href === '#') return; // ignore placeholders

        var id = href.slice(1);
        var target = document.getElementById(id);
        if (!target) return; // target not on this page

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // 4) Close the mobile navbar (if using Bootstrap bundle)
        var nav = document.querySelector('.navbar-collapse');
        if (nav && nav.classList.contains('show') && window.bootstrap) {
          var inst = window.bootstrap.Collapse.getInstance(nav) || new window.bootstrap.Collapse(nav, { toggle: false });
          inst.hide();
        }
      });
    });
    function copyEmail(btn) {
    const email = btn.dataset.email || 'hicamillacardoso@gmail.com';

    function flash(text) {
      const label = btn.querySelector('.copy-label');
      if (!label) return;
      const prev = label.textContent;
      label.textContent = text;
      setTimeout(() => (label.textContent = prev), 1600);
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(
        () => flash('Copied!'),
        () => flash('Copy failed')
      );
    } else {
  
      window.prompt('Copy this email:', email);
    }
  }
  }
});