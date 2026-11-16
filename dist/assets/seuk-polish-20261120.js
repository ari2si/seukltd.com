/* Small finishing touches for seukltd.com.
   1. Division pages: the header tightens once the page is scrolled, and the
      small-screen menu closes when a link in it is used.
   2. Section headings and photographs ease in the first time they are scrolled
      to. Nothing is hidden unless this script runs, and visitors who ask for
      reduced motion get none. */
(function () {
  'use strict';

  var header = document.querySelector('[data-hd]');
  if (header) {
    var setHeader = function () { header.classList.toggle('is-scrolled', window.scrollY > 40); };
    setHeader();
    window.addEventListener('scroll', setHeader, { passive: true });
    var menu = header.querySelector('details.menu');
    if (menu) {
      menu.addEventListener('click', function (event) {
        if (event.target && event.target.closest && event.target.closest('a')) menu.removeAttribute('open');
      });
    }
  }

  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.setAttribute('data-reveal', 'in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  function arm() {
    var els = document.querySelectorAll('main section > div h2, main > section > h2, .seuk-band img, [data-reveal-me]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.hasAttribute('data-reveal')) continue;
      if (header && !el.hasAttribute('data-reveal-me')) continue; // division pages mark their own
      // anything already on screen is left exactly as it is
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) continue;
      el.setAttribute('data-reveal', 'wait');
      io.observe(el);
    }
  }

  var root = document.getElementById('root');
  if (root && root.querySelector(':scope > [data-pre]') && window.MutationObserver) {
    // home page: wait until the live script has replaced the stored copy
    var mo = new MutationObserver(function () {
      if (root.querySelector(':scope > [data-pre]')) return;
      mo.disconnect();
      window.requestAnimationFrame(arm);
    });
    mo.observe(root, { childList: true });
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arm);
  } else {
    arm();
  }
})();
