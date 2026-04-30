/* ============================================================
   Centro de Pinturas Gupher — main.js
   ============================================================ */

(function () {
  'use strict';

  /* ---- Sticky header scroll effect ---- */
  const header = document.getElementById('header');

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveNavLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Mobile nav toggle ---- */
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');

  navToggle.addEventListener('click', function () {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a link is clicked
  navMenu.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!header.contains(e.target)) {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---- Active nav link on scroll ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__link');

  function updateActiveNavLink() {
    const scrollY = window.scrollY + 120;

    sections.forEach(function (section) {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }

  /* ---- Scroll reveal ---- */
  const revealTargets = document.querySelectorAll(
    '.service-card, .product-card, .brand-card, .why-card, .blog-card, ' +
    '.gallery__item, .stat-item, .about__content, .about__images, ' +
    '.contact-item, .asesoria__info, .asesoria__form-wrap'
  );

  revealTargets.forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 4) * 80 + 'ms';
  });

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach(function (el) { observer.observe(el); });

  /* ---- Advisor form → WhatsApp redirect ---- */
  const form = document.getElementById('asesoriaForm');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      const nombre = form.querySelector('#f-nombre').value.trim();
      const tel    = form.querySelector('#f-tel').value.trim();
      const tipo   = form.querySelector('#f-tipo').value;
      const zona   = form.querySelector('#f-zona').value;

      if (!nombre || !tel || !tipo || !zona) {
        showFormError('Por favor complete los campos obligatorios (*).');
        return;
      }

      const email = form.querySelector('#f-email').value.trim();
      const desc  = form.querySelector('#f-desc').value.trim();

      // Build WhatsApp message
      const tipoLabels = {
        domiciliar:  'Domiciliar (casa/apartamento)',
        automotriz:  'Automotriz',
        industrial:  'Industrial',
        comercial:   'Comercial/Empresa/ASADA',
        agricola:    'Agrícola/Piñera',
        otro:        'Otro'
      };

      const zonaLabels = {
        'aguas-zarcas':    'Aguas Zarcas',
        'ciudad-quesada':  'Ciudad Quesada',
        pital:             'Pital',
        venecia:           'Venecia',
        muelle:            'Muelle de San Carlos',
        florencia:         'Florencia',
        upala:             'Upala',
        'los-chiles':      'Los Chiles',
        otra:              'Otra zona'
      };

      let msg = '🎨 *Solicitud de Visita de Asesoría — Pinturas Gupher*\n\n';
      msg += `👤 *Nombre:* ${nombre}\n`;
      msg += `📱 *Teléfono:* ${tel}\n`;
      if (email) msg += `📧 *Correo:* ${email}\n`;
      msg += `🏗️ *Tipo de proyecto:* ${tipoLabels[tipo] || tipo}\n`;
      msg += `📍 *Zona:* ${zonaLabels[zona] || zona}\n`;
      if (desc) msg += `📝 *Descripción:* ${desc}\n`;
      msg += '\n_Enviado desde pinturas-gupher.com_';

      const waUrl = 'https://wa.me/50688648789?text=' + encodeURIComponent(msg);
      window.open(waUrl, '_blank', 'noopener,noreferrer');

      showFormSuccess();
      form.reset();
    });
  }

  function showFormError(msg) {
    removeFormNotice();
    const notice = document.createElement('p');
    notice.className = 'form__notice form__notice--error';
    notice.textContent = msg;
    notice.style.cssText = 'color:#dc2626;font-size:.85rem;margin-top:.5rem;';
    form.appendChild(notice);
    setTimeout(removeFormNotice, 5000);
  }

  function showFormSuccess() {
    removeFormNotice();
    const notice = document.createElement('p');
    notice.className = 'form__notice form__notice--success';
    notice.innerHTML = '✅ ¡Listo! Será redirigido a WhatsApp para enviar su solicitud.';
    notice.style.cssText = 'color:#16a34a;font-size:.9rem;margin-top:.75rem;text-align:center;font-weight:600;';
    form.appendChild(notice);
    setTimeout(removeFormNotice, 8000);
  }

  function removeFormNotice() {
    const existing = form.querySelector('.form__notice');
    if (existing) existing.remove();
  }

  /* ---- Smooth scroll offset (fixed header compensation) ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

})();
