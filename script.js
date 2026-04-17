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

    // Close on non-dropdown link click
    navLinksEl.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        const parentDropdown = link.closest('.nav-dropdown');
        if (parentDropdown && link.classList.contains('nav-link')) {
          // Toggle dropdown instead of closing the menu on mobile
          if (window.innerWidth <= 768) {
            e.preventDefault();
            const isOpen = parentDropdown.classList.toggle('open');
            parentDropdown.querySelector('.nav-link').setAttribute('aria-expanded', isOpen);
            return;
          }
        }
        if (!parentDropdown || !link.closest('.dropdown-menu')) return;
        navLinksEl.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
        document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
      });
    });
  }

  /* ---------- DESKTOP DROPDOWN (click-toggle fallback) ---------- */
  document.querySelectorAll('.nav-dropdown > .nav-link').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      if (window.innerWidth > 768) {
        e.preventDefault();
        const dropdown = trigger.closest('.nav-dropdown');
        const isOpen = dropdown.classList.toggle('open');
        // Close others
        document.querySelectorAll('.nav-dropdown').forEach(d => {
          if (d !== dropdown) d.classList.remove('open');
        });
        trigger.setAttribute('aria-expanded', isOpen);
      }
    });
  });

  // On desktop, also show on hover (keep existing CSS :hover) but sync the class
  document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
    dropdown.addEventListener('mouseleave', () => {
      if (window.innerWidth > 768) dropdown.classList.remove('open');
    });
  });

  // Close desktop dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (window.innerWidth > 768 && !e.target.closest('.nav-dropdown')) {
      document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('open'));
    }
  });

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

/* ---------- SCROLL PROGRESS BAR ---------- */
(function () {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  function updateBar() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', updateBar, { passive: true });
})();

/* ---------- TYPEWRITER ANIMATION ---------- */
(function () {
  const el = document.getElementById('heroTyping');
  if (!el) return;

  const phrases = [
    'Interpenetrating Polymer Networks',
    'DLP 3D Printing & Additive Manufacturing',
    'Block Copolymers & Semiconductor Patterning',
    'High-Temperature Aerospace Materials',
    'AI-Assisted Materials Science'
  ];

  let pIdx = 0, cIdx = 0, deleting = false;

  function tick() {
    const phrase = phrases[pIdx];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++cIdx);
      if (cIdx === phrase.length) {
        deleting = true;
        return setTimeout(tick, 2200);
      }
    } else {
      el.textContent = phrase.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
        return setTimeout(tick, 400);
      }
    }
    setTimeout(tick, deleting ? 35 : 65);
  }

  setTimeout(tick, 1000);
})();
