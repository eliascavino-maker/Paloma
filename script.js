/* ═══════════════════════════════════════════════════════
   CINEPASS – PROPUESTA DE NOVIA
   script.js  ·  Vanilla JS  ·  Zero dependencies
═══════════════════════════════════════════════════════ */

'use strict';

/* ─── Utilidades ─── */

/**
 * Espera ms milisegundos (Promise).
 */
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Transición entre pantallas con fade.
 * @param {string} fromId - id de la pantalla que sale
 * @param {string} toId   - id de la pantalla que entra
 */
function transitionTo(fromId, toId) {
  const from = document.getElementById(fromId);
  const to   = document.getElementById(toId);

  from.classList.add('fade-out');
  from.classList.remove('active');

  setTimeout(() => {
    from.classList.remove('fade-out');
    to.classList.add('active', 'fade-in');
    setTimeout(() => to.classList.remove('fade-in'), 700);
  }, 500);
}

/* ═══════════════════════════════════════════════════════
   PANTALLA 1 – BARRA DE PROGRESO Y CHECKLIST
═══════════════════════════════════════════════════════ */

(async function initValidation() {

  const bar       = document.getElementById('progressBar');
  const pctLabel  = document.getElementById('progressPct');
  const checks    = [
    document.getElementById('chk0'),
    document.getElementById('chk1'),
    document.getElementById('chk2'),
    document.getElementById('chk3'),
    document.getElementById('chk4'),
  ];
  const foundBadge   = document.getElementById('foundBadge');
  const btnContinuar = document.getElementById('btnContinuar');

  /**
   * Actualiza la barra de progreso con animación fluida.
   * Usa requestAnimationFrame para que sea muy suave.
   */
  function setProgress(target, durationMs) {
    return new Promise(resolve => {
      const start    = parseFloat(bar.style.width) || 0;
      const delta    = target - start;
      const startTime = performance.now();

      function tick(now) {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        // ease-out quad
        const eased    = 1 - (1 - progress) * (1 - progress);
        const current  = start + delta * eased;

        bar.style.width     = current + '%';
        pctLabel.textContent = Math.round(current) + '%';

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          resolve();
        }
      }

      requestAnimationFrame(tick);
    });
  }

  /**
   * Marca un item del checklist como completado.
   */
  function completeCheck(el) {
    el.classList.add('done');
    el.querySelector('.check-icon').textContent = '✔';
  }

  /* ── Secuencia de validación ─────────────────────── */

  // Pausa inicial para que se vea la pantalla
  await wait(600);

  // Paso 1: 0 → 18% · Conectando
  await setProgress(18, 2800);
  completeCheck(checks[0]);
  await wait(400);

  // Paso 2: 18 → 40% · Verificando fecha
  await setProgress(40, 3800);
  completeCheck(checks[1]);
  await wait(500);

  // Paso 3: 40 → 62% · Consultando
  await setProgress(62, 4500);
  completeCheck(checks[2]);
  await wait(400);

  // Paso 4: 62 → 82% · Validando
  await setProgress(82, 4200);
  completeCheck(checks[3]);
  await wait(450);

  // Paso 5: 82 → 99% · Preparando
  await setProgress(99, 5500);
  completeCheck(checks[4]);

  // Pausa en 99% para mayor realismo
  await wait(2100);

  // Cierre: 99 → 100%
  await setProgress(100, 400);
  await wait(500);

  // Ocultar porcentaje, mostrar badge
  pctLabel.style.opacity = '0';
  foundBadge.classList.remove('hidden');
  await wait(800);

  // Mostrar botón
  btnContinuar.classList.remove('hidden');

})();

/* ═══════════════════════════════════════════════════════
   PANTALLA 2 – SOBRE
═══════════════════════════════════════════════════════ */

/** Llamado por el botón CONTINUAR de pantalla 1. */
function goToScreen2() {
  transitionTo('screen-validation', 'screen-envelope');
}

/** Animación de apertura del sobre y transición a pantalla 3. */
function openEnvelope() {
  const envelope = document.getElementById('envelope');
  const btnAbrir = document.getElementById('btnAbrir');

  // Deshabilitar botón para evitar doble tap
  btnAbrir.disabled = true;
  btnAbrir.style.opacity = '0.5';

  // Abrir sobre
  envelope.classList.add('open');
  envelope.style.animation = 'none'; // detener float

  // Escalar el sobre mientras se abre
  envelope.style.transition = 'transform 0.8s cubic-bezier(0.22,1,0.36,1)';
  envelope.style.transform  = 'scale(1.06)';

  setTimeout(() => {
    transitionTo('screen-envelope', 'screen-letter');
    setTimeout(() => startTypewriter(), 400);
  }, 1200);
}

/* ═══════════════════════════════════════════════════════
   PANTALLA 3 – TYPEWRITER
═══════════════════════════════════════════════════════ */

/**
 * Frases que se escriben una a una.
 * '' representa una línea vacía (pausa visual).
 */
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

/** Velocidad de escritura en ms por carácter. */
const CHAR_SPEED   = 42;
/** Pausa entre frases en ms. */
const PHRASE_PAUSE = 820;
/** Pausa extra en líneas vacías. */
const EMPTY_PAUSE  = 620;

async function startTypewriter() {
  const stage = document.getElementById('typewriterStage');

  for (let i = 0; i < PHRASES.length; i++) {
    const phrase = PHRASES[i];

    if (phrase === '') {
      await wait(EMPTY_PAUSE);
      continue;
    }

    // Crear elemento
    const line = document.createElement('p');
    line.classList.add('type-line');

    // Cursor parpadeante
    const cursor = document.createElement('span');
    cursor.classList.add('type-cursor');
    line.appendChild(cursor);

    stage.appendChild(line);

    // Fade in
    await wait(40);
    line.classList.add('visible');

    // Escribir carácter a carácter
    for (const char of phrase) {
      const text = document.createTextNode(char);
      line.insertBefore(text, cursor);
      await wait(CHAR_SPEED + (Math.random() * 20 - 10)); // variación natural
    }

    // Quitar cursor de la línea actual (excepto la última)
    if (i < PHRASES.length - 1) {
      cursor.remove();
    }

    await wait(PHRASE_PAUSE);
  }

  // Mostrar corazón grande
  await wait(600);
  showBigHeart();
}

async function showBigHeart() {
  const heartReveal = document.getElementById('heartReveal');
  const bigHeart    = document.getElementById('bigHeart');

  heartReveal.classList.remove('hidden');
  await wait(80);
  bigHeart.classList.add('show');

  // Transición a pantalla 4 después de 2.5s
  await wait(2500);
  transitionTo('screen-letter', 'screen-question');
}

/* ═══════════════════════════════════════════════════════
   PANTALLA 4 – LA PREGUNTA / BOTÓN "NO" QUE ESCAPA
═══════════════════════════════════════════════════════ */

let noAttempts = 0;
const MAX_NO_ATTEMPTS = 6;

/**
 * Mueve el botón "No" a una posición aleatoria cada vez
 * que el usuario intenta tocarlo / hacer hover.
 */
function noEscape(event) {
  event.preventDefault();

  noAttempts++;

  const btn       = document.getElementById('btnNo');
  const container = document.querySelector('.question-buttons');
  const cRect     = container.getBoundingClientRect();
  const bRect     = btn.getBoundingClientRect();

  if (noAttempts >= MAX_NO_ATTEMPTS) {
    // Desaparecer el botón
    btn.style.transition = 'opacity 0.5s, transform 0.5s';
    btn.style.opacity    = '0';
    btn.style.transform  = 'scale(0.5)';
    setTimeout(() => btn.remove(), 500);

    // Mostrar mensaje
    const msg = document.getElementById('noMsg');
    msg.classList.remove('hidden');
    setTimeout(() => msg.classList.add('visible'), 50);
    return;
  }

  // Calcular zona segura dentro del contenedor
  const maxX = cRect.width  - bRect.width  - 16;
  const maxY = cRect.height - bRect.height - 8;

  const randX = Math.floor(Math.random() * maxX);
  const randY = Math.floor(Math.random() * maxY);

  // Velocidad de escape más rápida en intentos avanzados
  const speed = Math.max(80, 250 - noAttempts * 25);

  btn.style.transition = `left ${speed}ms cubic-bezier(0.22,1,0.36,1), top ${speed}ms cubic-bezier(0.22,1,0.36,1)`;
  btn.style.position   = 'absolute';
  btn.style.left       = randX + 'px';
  btn.style.top        = randY + 'px';
}

/** Listener hover para desktop – el botón huye antes del click. */
(function setupNoHover() {
  const btn = document.getElementById('btnNo');
  if (!btn) return;

  // En móvil, touchstart dispara primero → usamos ese evento
  btn.addEventListener('touchstart', noEscape, { passive: false });
  // En desktop, mouseenter (huye antes del click)
  btn.addEventListener('mouseenter', noEscape);
})();

/* ═══════════════════════════════════════════════════════
   PANTALLA 5 – CELEBRACIÓN
═══════════════════════════════════════════════════════ */

function goToScreen5() {
  transitionTo('screen-question', 'screen-yes');
  setTimeout(() => {
    startConfetti();
    startHearts();
    revealYesCard();
  }, 600);
}

/** Muestra la carta con animación. */
function revealYesCard() {
  const card = document.querySelector('.yes-card');
  setTimeout(() => card.classList.add('visible'), 300);
}

/* ── Confeti ──────────────────────────────────────── */

function startConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx    = canvas.getContext('2d');

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const COLORS = [
    '#c9a84c', '#e4c472', '#f0d080',
    '#c0392b', '#e74c3c', '#ff6b6b',
    '#f5f5f0', '#ffffff',
    '#8b1a1a', '#ffd700',
  ];

  const SHAPES = ['circle', 'rect', 'triangle'];

  // Generar partículas
  const particles = Array.from({ length: 140 }, () => ({
    x:      Math.random() * canvas.width,
    y:      -10 - Math.random() * 200,
    vx:     (Math.random() - 0.5) * 3,
    vy:     2.5 + Math.random() * 3.5,
    size:   4 + Math.random() * 7,
    color:  COLORS[Math.floor(Math.random() * COLORS.length)],
    shape:  SHAPES[Math.floor(Math.random() * SHAPES.length)],
    angle:  Math.random() * Math.PI * 2,
    spin:   (Math.random() - 0.5) * 0.18,
    alpha:  1,
  }));

  let running = true;
  let frame   = 0;

  function draw() {
    if (!running) return;
    frame++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x     += p.vx + Math.sin(frame * 0.02 + p.y * 0.01) * 0.5;
      p.y     += p.vy;
      p.angle += p.spin;
      p.vy    += 0.04; // gravedad

      // Fade out al llegar abajo
      if (p.y > canvas.height * 0.75) {
        p.alpha = Math.max(0, p.alpha - 0.012);
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle   = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);

      switch (p.shape) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'rect':
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          break;
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(0, -p.size / 2);
          ctx.lineTo(p.size / 2, p.size / 2);
          ctx.lineTo(-p.size / 2, p.size / 2);
          ctx.closePath();
          ctx.fill();
          break;
      }

      ctx.restore();

      // Reiniciar si salió por abajo
      if (p.y > canvas.height + 20) {
        p.y     = -10;
        p.x     = Math.random() * canvas.width;
        p.alpha = 1;
        p.vy    = 2.5 + Math.random() * 3.5;
      }
    });

    // Detener después de 12 segundos
    if (frame < 12 * 60) {
      requestAnimationFrame(draw);
    } else {
      running = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  requestAnimationFrame(draw);
}

/* ── Corazones flotantes ─────────────────────────── */

function startHearts() {
  const container = document.getElementById('heartsContainer');
  const EMOJIS    = ['❤️', '🩷', '💕', '💖', '💗', '💝'];
  let   count     = 0;
  const MAX_HEARTS = 60;

  function spawnHeart() {
    if (count >= MAX_HEARTS) return;
    count++;

    const el = document.createElement('div');
    el.classList.add('floating-heart');
    el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

    const duration = 4500 + Math.random() * 4000;
    const delay    = Math.random() * 500;
    const size     = 18 + Math.random() * 22;
    const left     = 2 + Math.random() * 94; // % del ancho

    el.style.cssText = `
      left: ${left}%;
      font-size: ${size}px;
      animation-duration: ${duration}ms;
      animation-delay: ${delay}ms;
    `;

    container.appendChild(el);
    setTimeout(() => el.remove(), duration + delay + 200);
  }

  // Generar ráfaga inicial intensa
  for (let i = 0; i < 18; i++) {
    setTimeout(spawnHeart, i * 120);
  }

  // Luego continuo más lento
  const interval = setInterval(() => {
    spawnHeart();
    if (count >= MAX_HEARTS) clearInterval(interval);
  }, 600);
}

/* ═══════════════════════════════════════════════════════
   RESIZE HANDLER (confeti canvas)
═══════════════════════════════════════════════════════ */

window.addEventListener('resize', () => {
  const canvas = document.getElementById('confettiCanvas');
  if (canvas) {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});

/* ═══════════════════════════════════════════════════════
   PREVENIR SCROLL / ZOOM no deseado en móvil
═══════════════════════════════════════════════════════ */

document.addEventListener('touchmove', e => {
  // Permitir scroll solo dentro de tarjetas que lo necesiten
  if (!e.target.closest('.yes-inner')) {
    e.preventDefault();
  }
}, { passive: false });

// Evitar doble-tap zoom en botones
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('touchend', e => e.preventDefault(), { passive: false });
});
