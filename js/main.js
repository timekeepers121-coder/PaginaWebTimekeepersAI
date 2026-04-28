/* ============================================================
   TimeKeepers AI — main.js
   ============================================================ */

const isTouch = window.matchMedia('(hover: none)').matches;
const isMobile = window.matchMedia('(max-width: 768px)').matches;

/* =============== Scroll reveal =============== */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, {threshold:0.15});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* =============== Counters =============== */
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const isFloat = target % 1 !== 0;
  const dur = 1800;
  const start = performance.now();
  function tick(t){
    const p = Math.min(1, (t - start)/dur);
    const eased = 1 - Math.pow(1-p, 3);
    const v = target * eased;
    el.textContent = isFloat ? v.toFixed(1) : Math.round(v).toLocaleString();
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const countIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.done) {
      e.target.dataset.done = '1';
      animateCount(e.target);
    }
  });
}, {threshold:0.5});
document.querySelectorAll('[data-count]').forEach(el => countIO.observe(el));

/* =============== Custom cursor (desktop + hover only) =============== */
if (!isTouch){
  const cdot = document.getElementById('cdot');
  const cring = document.getElementById('cring');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.body.style.cursor = 'none';
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cdot.style.left = (mx-5)+'px';
    cdot.style.top = (my-5)+'px';
    cdot.style.opacity = '1';
    cring.style.opacity = '1';
  });
  function followRing(){
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    cring.style.left = (rx-20)+'px';
    cring.style.top = (ry-20)+'px';
    requestAnimationFrame(followRing);
  }
  followRing();
  document.querySelectorAll('[data-cursor="hover"]').forEach(el => {
    el.addEventListener('mouseenter', () => { cring.style.transform = 'scale(1.8)'; cring.style.background = 'rgba(40,168,223,.1)'; });
    el.addEventListener('mouseleave', () => { cring.style.transform = 'scale(1)'; cring.style.background = 'transparent'; });
  });
}

/* =============== Nav shrink on scroll =============== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

/* =============== Mobile menu toggle =============== */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks){
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  // Close when clicking a link
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* =============== FAQ =============== */
document.querySelectorAll('.faq-item').forEach(item => {
  item.addEventListener('click', () => {
    const open = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!open) item.classList.add('open');
  });
});

/* =============== Form submit =============== */
const cform = document.getElementById('cform');
if (cform){
  cform.addEventListener('submit', (e) => {
    e.preventDefault();
    cform.style.opacity = '.4';
    document.getElementById('frmSuccess').classList.add('on');
    setTimeout(() => {
      cform.reset();
      cform.style.opacity = '1';
      setTimeout(() => document.getElementById('frmSuccess').classList.remove('on'), 3000);
    }, 500);
  });
}
