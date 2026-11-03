/* Sandra Walker — mockup behaviour. No tracking, no third-party scripts. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Condensing sticky header */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-condensed', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Mobile menu */
  var toggle = document.querySelector('.nav-toggle');
  var list = document.getElementById('nav-list');
  if (toggle && list) {
    var setOpen = function (open) {
      list.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close' : 'Menu';
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    list.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && list.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* Scroll reveals + the hairline drawing left to right */
  var targets = document.querySelectorAll('.reveal, .hairline');
  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-in', 'is-drawn'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add(entry.target.classList.contains('hairline') ? 'is-drawn' : 'is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* Contact form: name + one way to reply. Nothing else is required. */
  var form = document.getElementById('contact-form');
  if (!form) return;

  var nameEl = form.querySelector('#f-name');
  var emailEl = form.querySelector('#f-email');
  var phoneEl = form.querySelector('#f-phone');

  function setError(input, msgId, msg) {
    var out = document.getElementById(msgId);
    if (msg) {
      input.setAttribute('aria-invalid', 'true');
      out.textContent = msg;
    } else {
      input.removeAttribute('aria-invalid');
      out.textContent = '';
    }
  }

  function emailLooksValid(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function phoneLooksValid(v) { return v.replace(/\D/g, '').length >= 10; }

  function validate() {
    var ok = true;
    var name = nameEl.value.trim();
    var email = emailEl.value.trim();
    var phone = phoneEl.value.trim();

    if (!name) { setError(nameEl, 'e-name', 'Please tell us your name.'); ok = false; }
    else setError(nameEl, 'e-name', '');

    setError(emailEl, 'e-email', '');
    setError(phoneEl, 'e-phone', '');

    if (!email && !phone) {
      setError(emailEl, 'e-email', 'Please add an email or a phone number.');
      setError(phoneEl, 'e-phone', 'Please add a phone number or an email.');
      ok = false;
    } else {
      if (email && !emailLooksValid(email)) { setError(emailEl, 'e-email', 'That email address doesn’t look complete.'); ok = false; }
      if (phone && !phoneLooksValid(phone)) { setError(phoneEl, 'e-phone', 'Please include the full number, with area code.'); ok = false; }
    }
    return ok;
  }

  [nameEl, emailEl, phoneEl].forEach(function (el) {
    el.addEventListener('blur', function () {
      if (form.dataset.tried) validate();
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.dataset.tried = '1';
    if (!validate()) {
      var first = form.querySelector('[aria-invalid="true"]');
      if (first) first.focus();
      return;
    }
    /* Mockup: nothing is sent. The live handler is [FORM HANDLER — CONFIRM]. */
    window.location.href = 'thanks.html';
  });
})();
