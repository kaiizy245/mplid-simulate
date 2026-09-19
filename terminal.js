/* ==========================================================
   MPL ID SIMULATE — Terminal Animation System
   Efek: boot sequence, typewriter, kursor berkedip
   ========================================================== */

/* ---------- Typewriter ---------- */
function typewriter(el, text, speed = 32, callback) {
  el.textContent = '';
  el.style.borderRight = '2px solid currentColor';
  el.style.animation = 'none';
  let i = 0;
  const interval = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      // Ganti jadi kursor berkedip setelah selesai
      el.style.borderRight = 'none';
      const cursor = document.createElement('span');
      cursor.className = 'term-cursor';
      cursor.textContent = '█';
      el.appendChild(cursor);
      if (callback) callback();
    }
  }, speed);
}

/* ---------- Typewriter semua h1 di halaman ---------- */
function animateHeadings() {
  const headings = document.querySelectorAll('h1[data-type]');
  headings.forEach(h => {
    const original = h.dataset.type;
    typewriter(h, original, 28);
  });
}

/* ---------- Boot Overlay ---------- */
const BOOT_KEY = 'mplid_booted';

function runBootSequence(onDone) {
  const overlay = document.createElement('div');
  overlay.id = 'boot-overlay';
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 9999;
    background: #080B0F;
    display: flex; flex-direction: column;
    justify-content: center; align-items: flex-start;
    padding: 48px 10vw;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.875rem;
    color: #22C55E;
    overflow: hidden;
  `;
  document.body.appendChild(overlay);

  const lines = [
    { text: 'MPL_ID_SIMULATE v1.0', delay: 0, color: '#38BDF8', bold: true },
    { text: '─────────────────────────────────', delay: 80, color: '#1E2733' },
    { text: '[OK] Initializing simulation engine...', delay: 160 },
    { text: '[OK] Loading teams.json................', delay: 320 },
    { text: '[OK] Loading players.json..............', delay: 480 },
    { text: '[OK] Loading schedule.json.............', delay: 640 },
    { text: '[OK] Mounting localStorage overrides...', delay: 800 },
    { text: '[OK] Calculating standings.............', delay: 960 },
    { text: '[OK] Building playoff bracket..........', delay: 1100 },
    { text: '─────────────────────────────────', delay: 1200, color: '#1E2733' },
    { text: 'SIM_ENGINE: ACTIVE █', delay: 1320, color: '#22C55E', bold: true },
  ];

  lines.forEach(({ text, delay, color, bold }) => {
    setTimeout(() => {
      const line = document.createElement('div');
      line.style.cssText = `
        color: ${color || '#22C55E'};
        font-weight: ${bold ? '700' : '400'};
        margin-bottom: 4px;
        opacity: 0;
        transform: translateX(-8px);
        transition: opacity 0.15s ease, transform 0.15s ease;
      `;
      line.textContent = text;
      overlay.appendChild(line);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          line.style.opacity = '1';
          line.style.transform = 'translateX(0)';
        });
      });
    }, delay);
  });

  // Fade out setelah selesai
  setTimeout(() => {
    overlay.style.transition = 'opacity 0.4s ease';
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.remove();
      sessionStorage.setItem(BOOT_KEY, '1');
      if (onDone) onDone();
    }, 400);
  }, 1800);
}

/* ---------- Loading bar untuk fetch data ---------- */
function createLoadingBar(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--color-text-muted); margin-bottom: 8px;">
      LOADING<span class="term-dots"></span>
    </div>
    <div style="height: 2px; background: var(--color-border); border-radius: 2px; overflow: hidden;">
      <div class="term-progress-bar" style="height: 100%; width: 0%; background: var(--color-cyan); border-radius: 2px;"></div>
    </div>
  `;

  // Animasi progress bar
  const bar = el.querySelector('.term-progress-bar');
  let w = 0;
  const iv = setInterval(() => {
    w = Math.min(w + Math.random() * 18, 85);
    bar.style.width = w + '%';
    if (w >= 85) clearInterval(iv);
  }, 80);

  return {
    finish: () => {
      clearInterval(iv);
      bar.style.transition = 'width 0.2s ease';
      bar.style.width = '100%';
      setTimeout(() => el.innerHTML = '', 200);
    }
  };
}

/* ---------- Flash effect saat tabel di-update ---------- */
function flashRow(rowEl) {
  rowEl.style.transition = 'background 0s';
  rowEl.style.background = 'rgba(56, 189, 248, 0.15)';
  setTimeout(() => {
    rowEl.style.transition = 'background 0.6s ease';
    rowEl.style.background = '';
  }, 50);
}

/* ---------- CSS animasi tambahan ---------- */
const style = document.createElement('style');
style.textContent = `
  .term-cursor {
    color: var(--color-cyan, #38BDF8);
    animation: blink-cursor 1s step-end infinite;
    margin-left: 2px;
    font-size: 0.85em;
  }
  @keyframes blink-cursor {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  .term-dots::after {
    content: '';
    animation: dots 1.2s steps(4, end) infinite;
  }
  @keyframes dots {
    0%   { content: ''; }
    25%  { content: '.'; }
    50%  { content: '..'; }
    75%  { content: '...'; }
    100% { content: ''; }
  }

  @keyframes fade-up {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up {
    animation: fade-up 0.3s ease forwards;
  }
`;
document.head.appendChild(style);

/* ---------- Init otomatis ---------- */
document.addEventListener('DOMContentLoaded', () => {
  // Boot sequence hanya sekali per session (di halaman home)
  const isHome = document.title === 'MPL ID Simulate' && !window.location.href.includes('index') && window.location.href.includes('home');
  const alreadyBooted = sessionStorage.getItem(BOOT_KEY);

  if (isHome && !alreadyBooted) {
    runBootSequence();
  }

  // Typewriter untuk semua h1 dengan data-type
  document.querySelectorAll('h1[data-type]').forEach(h => {
    const text = h.dataset.type;
    typewriter(h, text, 28);
  });
});