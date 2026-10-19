// Jordan Prayer Times website: language toggle (English / Arabic), navigation, screenshots and small animations.
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Language ---------- */
  const TITLES = {
    en: 'Jordan Prayer Times — Never miss a prayer',
    ar: 'مواقيت الصلاة الأردن — لا تفوّتك صلاة'
  };

  function setLanguage(lang) {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    root.dataset.lang = lang;
    $$('[data-en]').forEach(el => {
      const text = el.getAttribute(`data-${lang}`);
      if (text !== null) el.textContent = text;
    });
    $('#langLabel').textContent = lang === 'ar' ? 'English' : 'العربية';
    document.title = TITLES[lang];
    try { localStorage.setItem('preferredLanguage', lang); } catch { /* storage blocked */ }
  }

  let saved = null;
  try { saved = localStorage.getItem('preferredLanguage'); } catch { /* storage blocked */ }
  const initial = saved || ((navigator.language || '').toLowerCase().startsWith('ar') ? 'ar' : 'en');
  if (initial === 'ar') setLanguage('ar');

  $('#langToggle').addEventListener('click', () => {
    setLanguage(document.documentElement.dataset.lang === 'ar' ? 'en' : 'ar');
  });

  /* ---------- Navbar ---------- */
  const navbar = $('#navbar');
  const toTop = $('#toTop');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    toTop.classList.toggle('show', window.scrollY > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  const links = $('#navLinks');
  const toggle = $('#navToggle');
  const setMenu = open => {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.firstElementChild.className = open ? 'fas fa-xmark' : 'fas fa-bars';
    // The open menu is white, so the bar needs its light look behind it.
    navbar.classList.toggle('scrolled', open || window.scrollY > 20);
  };
  toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  links.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('click', e => {
    if (links.classList.contains('open') && !e.target.closest('#navLinks, #navToggle')) setMenu(false);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- Screenshots ---------- */
  let track = $('#track-phone');
  $$('.tab').forEach(tab => tab.addEventListener('click', () => {
    $$('.tab').forEach(t => {
      const on = t === tab;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', String(on));
    });
    $$('.shot-track').forEach(t => { t.hidden = t.id !== `track-${tab.dataset.track}`; });
    track = $(`#track-${tab.dataset.track}`);
    track.scrollLeft = 0;
  }));

  const step = () => (track.querySelector('.shot')?.getBoundingClientRect().width || 220) + 22;
  // In RTL the track scrolls the other way, so flip the direction of the arrows.
  const dir = () => (document.documentElement.dir === 'rtl' ? -1 : 1);
  $('#shotPrev').addEventListener('click', () => track.scrollBy({ left: -step() * dir(), behavior: 'smooth' }));
  $('#shotNext').addEventListener('click', () => track.scrollBy({ left: step() * dir(), behavior: 'smooth' }));

  const lightbox = $('#lightbox');
  const lbImg = $('#lbImg');
  $$('.shot-track').forEach(t => t.addEventListener('click', e => {
    const btn = e.target.closest('button[data-full]');
    if (!btn) return;
    lbImg.src = btn.dataset.full;
    lbImg.alt = btn.closest('figure').querySelector('figcaption').textContent;
    lightbox.showModal();
  }));
  $('#lbClose').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.close(); });

  /* ---------- Footer year ---------- */
  $('#year').textContent = new Date().getFullYear();
})();
