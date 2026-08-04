'use strict';

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

/* ── Pantallas ── */
function showScreen(toId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const to = document.getElementById(toId);
  to.classList.add('active');
}

function transitionTo(fromId, toId) {
  const from = document.getElementById(fromId);
  from.style.opacity = '0';
  from.style.transition = 'opacity 0.5s ease';
  setTimeout(() => {
    showScreen(toId);
    const to = document.getElementById(toId);
    to.style.opacity = '0';
    to.style.transition = 'opacity 0.7s ease';
    setTimeout(() => { to.style.opacity = '1'; }, 30);
  }, 500);
}

/* ═══ PANTALLA 1 – VALIDACIÓN ═══ */
(async function initValidation() {
  const bar        = document.getElementById('progressBar');
  const pctLabel   = document.getElementById('progressPct');
  const checks     = ['chk0','chk1','chk2','chk3','chk4'].map(id => document.getElementById(id));
  const foundBadge = document.getElementById('foundBadge');
  const btnCont    = document.getElementById('btnContinuar');

  function setProgress(target, durationMs) {
    return new Promise(resolve => {
      const start = parseFloat(bar.style.width) || 0;
      const delta = target - start;
      const t0 = performance.now();
      function tick(now) {
        const p = Math.min((now - t0) / durationMs, 1);
        const eased = 1 - (1 - p) * (1 - p);
        const cur = start + delta * eased;
        bar.style.width = cur + '%';
        pctLabel.textContent = Math.round(cur) + '%';
        if (p < 1) requestAnimationFrame(tick);
        else resolve();
      }
      requestAnimationFrame(tick);
    });
  }

  function completeCheck(el) {
    el.classList.add('done');
    el.querySelector('.check-icon').textContent = '✔';
  }

  await wait(600);
  await setProgress(18, 2800); completeCheck(checks[0]); await wait(400);
  await setProgress(40, 3800); completeCheck(checks[1]); await wait(500);
  await setProgress(62, 4500); completeCheck(checks[2]); await wait(400);
  await setProgress(82, 4200); completeCheck(checks[3]); await wait(450);
  await setProgress(99, 5500); completeCheck(checks[4]);
  await wait(2100);
  await setProgress(100, 400);
  await wait(500);

  pctLabel.style.opacity = '0';
  foundBadge.classList.remove('hidden');
  await wait(800);
  btnCont.classList.remove('hidden');

  /* Botón CONTINUAR — listeners explícitos para iOS */
  function gotoS2() {
    transitionTo('screen-validation', 'screen-envelope');
  }
  btnCont.addEventListener('click', gotoS2);
  btnCont.addEventListener('touchend', function(e) {
    e.stopPropagation();
    gotoS2();
  });
})();

/* ═══ PANTALLA 2 – SOBRE ═══ */
function initEnvelope() {
  const btnAbrir = document.getElementById('btnAbrir');

  function openEnvelope() {
    if (btnAbrir.dataset.used) return;
    btnAbrir.dataset.used = '1';
    btnAbrir.style.opacity = '0.5';

    const envelope = document.getElementById('envelope');
    envelope.classList.add('open');
    envelope.style.animation = 'none';

    setTimeout(() => {
      transitionTo('screen-envelope', 'screen-letter');
      setTimeout(() => startTypewriter(), 500);
    }, 1200);
  }

  btnAbrir.addEventListener('click', openEnvelope);
  btnAbrir.addEventListener('touchend', function(e) {
    e.stopPropagation();
    openEnvelope();
  });
}

/* ═══ PANTALLA 3 – TYPEWRITER ═══ */
const PHRASES = [
  'Dicen que las mejores historias…',
  '…empiezan cuando menos las esperás.',
  '',
  'Y aunque hoy vinimos al cine…',
  '…mi parte favorita',
  '…no estuvo en la pantalla.',
  '',
  'Estuvo en compartir este momento con vos.',
  '',
  'Porque desde hace mucho tiempo…',
  '…hay una pregunta que quiero hacerte.',
];

async function startTypewriter() {
  const stage = document.getElementById('typewriterStage');

  for (let i = 0; i < PHRASES.length; i++) {
    const phrase = PHRASES[i];
    if (phrase === '') { await wait(620); continue; }

    const line   = document.createElement('p');
    line.classList.add('type-line');
    const cursor = document.createElement('span');
    cursor.classList.add('type-cursor');
    line.appendChild(cursor);
    stage.appendChild(line);

    await wait(40);
    line.classList.add('visible');

    for (const char of phrase) {
      const t = document.createTextNode(char);
      line.insertBefore(t, cursor);
      await wait(42 + (Math.random() * 20 - 10));
    }

    if (i < PHRASES.length - 1) cursor.remove();
    await wait(820);
  }

  await wait(600);
  const heartReveal = document.getElementById('heartReveal');
  const bigHeart    = document.getElementById('bigHeart');
  heartReveal.classList.remove('hidden');
  await wait(80);
  bigHeart.classList.add('show');

  await wait(2500);
  transitionTo('screen-letter', 'screen-question');
  setTimeout(() => initQuestion(), 600);
}

/* ═══ PANTALLA 4 – LA PREGUNTA ═══ */
function initQuestion() {
  const btnYes = document.getElementById('btnYes');
  const btnNo  = document.getElementById('btnNo');
  let noAttempts = 0;

  function gotoS5() {
    transitionTo('screen-question', 'screen-yes');
    setTimeout(() => {
      startConfetti();
      startHearts();
      setTimeout(() => {
        document.querySelector('.yes-card').classList.add('visible');
      }, 300);
    }, 600);
  }

  btnYes.addEventListener('click', gotoS5);
  btnYes.addEventListener('touchend', function(e) {
    e.stopPropagation();
    gotoS5();
  });

  function noEscape(e) {
    e.preventDefault();
    e.stopPropagation();
    noAttempts++;

    if (noAttempts >= 6) {
      btnNo.style.transition = 'opacity 0.5s, transform 0.5s';
      btnNo.style.opacity    = '0';
      btnNo.style.transform  = 'scale(0.5)';
      setTimeout(() => btnNo.remove(), 500);
      const msg = document.getElementById('noMsg');
      msg.classList.remove('hidden');
      setTimeout(() => msg.classList.add('visible'), 50);
      return;
    }

    const container = document.querySelector('.question-buttons');
    const cRect     = container.getBoundingClientRect();
    const bRect     = btnNo.getBoundingClientRect();
    const maxX      = cRect.width  - bRect.width  - 16;
    const maxY      = cRect.height - bRect.height - 8;
    const randX     = Math.floor(Math.random() * maxX);
    const randY     = Math.floor(Math.random() * maxY);
    const speed     = Math.max(80, 250 - noAttempts * 25);

    btnNo.style.transition = `left ${speed}ms cubic-bezier(0.22,1,0.36,1), top ${speed}ms cubic-bezier(0.22,1,0.36,1)`;
    btnNo.style.position   = 'absolute';
    btnNo.style.left       = randX + 'px';
    btnNo.style.top        = randY + 'px';
  }

  btnNo.addEventListener('mouseenter', noEscape);
  btnNo.addEventListener('touchstart', noEscape, { passive: false });
}

/* ═══ CONFETI ═══ */
function startConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const COLORS = ['#c9a84c','#e4c472','#f0d080','#c0392b','#e74c3c','#ff6b6b','#f5f5f0','#ffffff','#ffd700'];
  const SHAPES = ['circle','rect','triangle'];

  const particles = Array.from({ length: 140 }, () => ({
    x: Math.random() * canvas.width,
    y: -10 - Math.random() * 200,
    vx: (Math.random() - 0.5) * 3,
    vy: 2.5 + Math.random() * 3.5,
    size: 4 + Math.random() * 7,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    angle: Math.random() * Math.PI * 2,
    spin:  (Math.random() - 0.5) * 0.18,
    alpha: 1,
  }));

  let frame = 0;
  function draw() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx + Math.sin(frame * 0.02 + p.y * 0.01) * 0.5;
      p.y += p.vy;
      p.angle += p.spin;
      p.vy += 0.04;
      if (p.y > canvas.height * 0.75) p.alpha = Math.max(0, p.alpha - 0.012);
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle   = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      if (p.shape === 'circle') {
        ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill();
      } else if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath(); ctx.moveTo(0, -p.size/2); ctx.lineTo(p.size/2, p.size/2); ctx.lineTo(-p.size/2, p.size/2); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
      if (p.y > canvas.height + 20) { p.y = -10; p.x = Math.random() * canvas.width; p.alpha = 1; p.vy = 2.5 + Math.random() * 3.5; }
    });
    if (frame < 720) requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

/* ═══ CORAZONES ═══ */
function startHearts() {
  const container = document.getElementById('heartsContainer');
  const EMOJIS    = ['❤️','🩷','💕','💖','💗','💝'];
  let count = 0;

  function spawnHeart() {
    if (count >= 60) return;
    count++;
    const el       = document.createElement('div');
    el.classList.add('floating-heart');
    el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    const duration = 4500 + Math.random() * 4000;
    const delay    = Math.random() * 500;
    el.style.cssText = `left:${2 + Math.random()*94}%;font-size:${18+Math.random()*22}px;animation-duration:${duration}ms;animation-delay:${delay}ms;`;
    container.appendChild(el);
    setTimeout(() => el.remove(), duration + delay + 200);
  }

  for (let i = 0; i < 18; i++) setTimeout(spawnHeart, i * 120);
  const iv = setInterval(() => { spawnHeart(); if (count >= 60) clearInterval(iv); }, 600);
}

/* ═══ SCROLL PREVENTION ═══ */
// Safari iOS: no usamos preventDefault en touchmove, se maneja con overflow:hidden en CSS

/* ═══ INIT ═══ */
document.addEventListener('DOMContentLoaded', () => {
  initEnvelope();
});

window.addEventListener('resize', () => {
  const canvas = document.getElementById('confettiCanvas');
  if (canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
});
