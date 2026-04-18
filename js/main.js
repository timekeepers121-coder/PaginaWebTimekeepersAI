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

/* =============== Hero panel live log =============== */
const LOG_LINES = [
  {t:'09:42:01', msg:'<span class="arr">▸</span> Receiving lead from LinkedIn Ads...'},
  {t:'09:42:01', msg:'<span class="ok">✓</span> Enriched via Clearbit + Perplexity'},
  {t:'09:42:02', msg:'<span class="arr">▸</span> Scoring intent (Claude 3.5 Sonnet)'},
  {t:'09:42:03', msg:'<span class="ok">✓</span> High-intent · 89% match'},
  {t:'09:42:03', msg:'<span class="arr">▸</span> Generating outreach sequence'},
  {t:'09:42:04', msg:'<span class="ok">✓</span> Personalized — 3 touchpoints'},
  {t:'09:42:04', msg:'<span class="arr">▸</span> Syncing HubSpot → deal created'},
  {t:'09:42:05', msg:'<span class="ok">✓</span> Calendar slot reserved'},
  {t:'09:42:06', msg:'<span class="arr">▸</span> Notifying SDR via Slack'},
  {t:'09:42:06', msg:'<span class="ok">✓</span> Pipeline +$14,200 forecasted'},
];
const hpLog = document.getElementById('hp-log');
let logIdx = 0;
const maxLines = isMobile ? 6 : 9;
function addLogLine(){
  if (!hpLog) return;
  const line = LOG_LINES[logIdx % LOG_LINES.length];
  logIdx++;
  const div = document.createElement('div');
  div.className = 'line';
  div.innerHTML = `<span class="t">${line.t}</span>${line.msg}`;
  hpLog.appendChild(div);
  while (hpLog.children.length > maxLines) hpLog.removeChild(hpLog.firstChild);
}
for (let i = 0; i < maxLines - 1; i++) addLogLine();
setInterval(addLogLine, 1400);

/* =============== KPI jitter =============== */
function jitter(elId, base, range, suffix){
  const el = document.getElementById(elId);
  if (!el) return;
  setInterval(() => {
    const v = base + Math.floor(Math.random()*range);
    el.innerHTML = v + (suffix || '');
  }, 1500);
}
jitter('kpi1', 48, 12, '');
jitter('kpi2', 180, 40, '<span class="u">ms</span>');
jitter('kpi3', 94, 5, '<span class="u">%</span>');

/* =============== Orbit rotation =============== */
const orbitNodes = document.getElementById('orbit-nodes');
if (orbitNodes && !isMobile){
  let orbitAngle = 0;
  function rotateOrbit(){
    orbitAngle += 0.1;
    orbitNodes.setAttribute('transform', `rotate(${orbitAngle} 500 500)`);
    requestAnimationFrame(rotateOrbit);
  }
  rotateOrbit();
}

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
