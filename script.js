/* ============================================================
   NIMA ALIZADEH — Portfolio Scripts
   ============================================================ */

(function () {
  'use strict';

  /* ---------- NAVBAR: scroll behavior + active link ---------- */
  const navbar  = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], div[id="about"]');

  function onScroll() {
    // Sticky style
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link
    let current = '';
    document.querySelectorAll('section[id]').forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });

    // Back to top button
    const backBtn = document.getElementById('backToTop');
    if (backBtn) {
      if (window.scrollY > 500) {
        backBtn.classList.add('visible');
      } else {
        backBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- MOBILE NAV TOGGLE ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinksEl = document.getElementById('navLinks');

  if (navToggle && navLinksEl) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinksEl.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    navLinksEl.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinksEl.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
      });
    });
  }

  /* ---------- SCROLL FADE-IN ANIMATIONS ---------- */
  const fadeEls = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings in same parent
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.fade-in:not(.visible)'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Math.min(idx * 80, 320));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => observer.observe(el));

  /* ---------- COUNTER ANIMATION (stats bar) ---------- */
  function animateCounter(el, target, duration = 1400) {
    const start = performance.now();
    const update = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    };
    requestAnimationFrame(update);
  }

  const statsBar = document.querySelector('.stats-bar');
  let statsCounted = false;

  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !statsCounted) {
      statsCounted = true;
      document.querySelectorAll('.stat-num').forEach(el => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        animateCounter(el, target);
      });
    }
  }, { threshold: 0.5 });

  if (statsBar) statsObserver.observe(statsBar);

  /* ---------- PUBLICATIONS TABS ---------- */
  const pubTabs   = document.querySelectorAll('.pub-tab');
  const pubPanels = document.querySelectorAll('.pub-panel');

  pubTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');

      pubTabs.forEach(t => t.classList.remove('active'));
      pubPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const panel = document.getElementById('tab-' + target);
      if (panel) {
        panel.classList.add('active');
        // Re-trigger fade-ins inside the newly shown panel
        panel.querySelectorAll('.fade-in:not(.visible)').forEach(el => {
          el.classList.add('visible');
        });
      }
    });
  });

  /* ---------- CERTIFICATIONS ACCORDION ---------- */
  const certToggle = document.getElementById('certToggle');
  const certList   = document.getElementById('certList');

  if (certToggle && certList) {
    certToggle.addEventListener('click', () => {
      const isOpen = certList.classList.toggle('open');
      certToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  /* ---------- CONTACT FORM (mailto fallback) ---------- */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name    = document.getElementById('name').value.trim();
      const email   = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) return;

      const subject  = encodeURIComponent('Portfolio Contact from ' + name);
      const body     = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n\n' +
        message
      );
      window.location.href = 'mailto:nimaalizadeh184@gmail.com?subject=' + subject + '&body=' + body;
    });
  }

  /* ---------- SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

  /* ---------- BACK TO TOP ---------- */
  const backBtn = document.getElementById('backToTop');
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();

// Thesis abstract toggles
document.querySelectorAll('.thesis-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const abstract = btn.nextElementSibling;
    abstract.classList.toggle('open');
    btn.textContent = abstract.classList.contains('open') ? '▲ Hide Abstract' : '▼ Read Abstract';
  });
});
