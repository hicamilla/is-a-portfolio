
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });


(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return; // ignore placeholder links

      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return; // no target id on page

      e.preventDefault();

      // Scroll to section respecting user's motion preferences
      el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });

      if (e.detail === 0) {
        const prev = el.getAttribute('tabindex');
        el.setAttribute('tabindex', '-1');
        el.focus({ preventScroll: true });
        if (prev === null) {
          el.addEventListener('blur', () => el.removeAttribute('tabindex'), { once: true });
        }
      }

      const nav = document.querySelector('.navbar-collapse');
      if (nav && nav.classList.contains('show') && window.bootstrap) {
        const inst = window.bootstrap.Collapse.getInstance(nav) || new window.bootstrap.Collapse(nav, { toggle: false });
        inst.hide();
      }
    });
  });
})();