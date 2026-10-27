(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  var header = document.getElementById('top');

  /* ---------- 1. Theme Toggle & Meta Color ---------- */
  var themeBtn = document.getElementById('themeToggle');
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function syncThemeColor() {
    if (!themeMeta) return;
    var isDark = root.getAttribute('data-theme') === 'dark';
    themeMeta.setAttribute('content', isDark ? '#05070b' : '#f4f1eb');
  }
  syncThemeColor();

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncThemeColor();
    });
  }

  /* ---------- 2. Mobile Nav Menu ---------- */
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');

  function setMenu(open) {
    if (!header || !menuBtn) return;
    header.classList.toggle('nav-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      setMenu(!header.classList.contains('nav-open'));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
  }

  /* ---------- 3. Active Nav Link Observer ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('#nav a'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });

    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------- 4. Advanced 3D Card Mouse Glow & Tilt ---------- */
  var tiltCards = document.querySelectorAll('.card, .project-media, .cert, .form');
  
  tiltCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');

      // 3D Tilt calculation
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var rotateX = ((y - centerY) / centerY) * -8;
      var rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-6px)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  /* ---------- 5. Reveal Elements on Scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 6. Dynamic Counter Animation for Stats ---------- */
  var statValues = document.querySelectorAll('.stat dd');
  if ('IntersectionObserver' in window && statValues.length) {
    var statsObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var target = entry.target;
          var text = target.textContent.trim();
          var numeric = parseInt(text, 10);

          if (!isNaN(numeric)) {
            var count = 0;
            var step = Math.ceil(numeric / 25);
            var timer = setInterval(function () {
              count += step;
              if (count >= numeric) {
                target.textContent = text; // Restore original formatted string (e.g., "4+", "100%")
                clearInterval(timer);
              } else {
                target.textContent = count + (text.includes('+') ? '+' : text.includes('%') ? '%' : '');
              }
            }, 40);
          }
          obs.unobserve(target);
        }
      });
    }, { threshold: 0.5 });

    statValues.forEach(function (stat) { statsObserver.observe(stat); });
  }

  /* ---------- 7. Custom Cyber Neon Cursor ---------- */
  var cursor = document.createElement('div');
  cursor.className = 'cyber-cursor';
  document.body.appendChild(cursor);

  // Add styles for custom cursor dynamically
  var style = document.createElement('style');
  style.textContent = `
    .cyber-cursor {
      position: fixed;
      width: 18px;
      height: 18px;
      border: 2px solid var(--accent-orange, #ff6b1a);
      border-radius: 50%;
      pointer-events: none;
      transform: translate(-50%, -50%);
      transition: width 0.2s, height 0.2s, background-color 0.2s, border-color 0.2s;
      z-index: 9999;
      box-shadow: 0 0 12px var(--glow-orange, rgba(255,107,26,0.5));
    }
    body:hover .cyber-cursor { opacity: 1; }
    .cursor-hover {
      width: 38px !important;
      height: 38px !important;
      background: rgba(0, 240, 255, 0.15) !important;
      border-color: var(--accent-cyan, #00f0ff) !important;
      box-shadow: 0 0 20px rgba(0, 240, 255, 0.6) !important;
    }
  `;
  document.head.appendChild(style);

  document.addEventListener('mousemove', function (e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  var interactiveEls = document.querySelectorAll('a, button, .card, input, textarea');
  interactiveEls.forEach(function (el) {
    el.addEventListener('mouseenter', function () { cursor.classList.add('cursor-hover'); });
    el.addEventListener('mouseleave', function () { cursor.classList.remove('cursor-hover'); });
  });

  /* ---------- 8. Certificate Lightbox Modal ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');

  if (lightbox && lightboxImg) {
    document.querySelectorAll('[data-cert]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        lightboxImg.src = btn.getAttribute('data-cert');
        lightboxImg.alt = 'Certificate: ' + (btn.getAttribute('data-title') || 'Preview');
        if (typeof lightbox.showModal === 'function') {
          lightbox.showModal();
        } else {
          window.open(btn.getAttribute('data-cert'), '_blank');
        }
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', function () { lightbox.close(); });
    }
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) lightbox.close();
    });
    lightbox.addEventListener('close', function () { lightboxImg.removeAttribute('src'); });
  }

  /* ---------- 9. AJAX Contact Form Submission ---------- */
  var form = document.getElementById('contactForm');
  var statusEl = document.getElementById('formStatus');
  var submitBtn = document.getElementById('submitBtn');

  function setStatus(text, isError) {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.classList.toggle('error', !!isError);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      setStatus('');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      var url = form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');

      fetch(url, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed');
          form.reset();
          setStatus('Thanks, your message is on its way!');
        })
        .catch(function () {
          setStatus('Something went wrong. You can email me directly at abdullahreda752@gmail.com.', true);
        })
        .then(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send message';
          }
        });
    });
  }

  /* ---------- 10. Footer Dynamic Year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();