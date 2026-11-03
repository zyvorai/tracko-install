const PAGES = 'https://zyvorai.github.io/tracko-install';

const cmds = {
  mac: `curl -fsSL ${PAGES}/install.sh | bash`,
  linux: `curl -fsSL ${PAGES}/install.sh | bash`,
  win: `irm ${PAGES}/install.ps1 | iex`,
};

const hints = {
  mac: 'macOS Apple Silicon. Installs to /Applications and launches.',
  linux: 'Linux AppImage next — script detects OS and guides you.',
  win: 'Windows 10/11 x64. One PowerShell line. Setup.exe is fetched by the script when published — never linked as a public CTA.',
};

function setOs(os) {
  document.querySelectorAll('.tab').forEach((t) => {
    t.classList.toggle('active', t.dataset.os === os);
  });
  const cmd = cmds[os] || cmds.mac;
  ['install-cmd', 'install-cmd-2', 'hero-cmd'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = cmd;
  });
  const hint = document.getElementById('os-hint');
  if (hint) hint.textContent = hints[os] || hints.mac;
  const heroHint = document.getElementById('hero-hint');
  if (heroHint) {
    heroHint.textContent =
      os === 'win'
        ? 'Windows · PowerShell · no public .exe'
        : os === 'linux'
          ? 'Linux · coming soon'
          : 'macOS Apple Silicon · no public .exe';
  }
  const eyebrow = document.getElementById('hero-eyebrow');
  if (eyebrow) {
    eyebrow.textContent =
      os === 'win' ? 'Windows · x64' : os === 'linux' ? 'Linux · coming' : 'Mac · Apple Silicon';
  }
  window.__trackoCmd = cmd;
}

function detectOs() {
  const ua = navigator.userAgent || '';
  if (/Windows/i.test(ua)) return 'win';
  if (/Linux/i.test(ua) && !/Android/i.test(ua)) return 'linux';
  return 'mac';
}

function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg || 'Copied to clipboard';
  el.hidden = false;
  requestAnimationFrame(() => el.classList.add('show'));
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => { el.hidden = true; }, 250);
  }, 1600);
}

async function copyText(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    const prev = btn.textContent;
    btn.textContent = 'Copied';
    showToast('Copied — paste in Terminal');
    setTimeout(() => { btn.textContent = prev; }, 1400);
  } catch {
    btn.textContent = 'Select & copy';
  }
}

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => setOs(tab.dataset.os));
});

document.getElementById('copy-btn')?.addEventListener('click', (e) => {
  copyText(document.getElementById('install-cmd').textContent, e.currentTarget);
});
document.getElementById('copy-btn-2')?.addEventListener('click', (e) => {
  copyText(document.getElementById('install-cmd-2').textContent, e.currentTarget);
});
document.getElementById('hero-copy')?.addEventListener('click', (e) => {
  copyText(window.__trackoCmd || cmds[detectOs()], e.currentTarget);
});

setOs(detectOs());

function currentTheme() {
  const forced = document.documentElement.getAttribute('data-theme');
  if (forced === 'light' || forced === 'dark') return forced;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem('tracko-theme', theme); } catch {}
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

document.getElementById('theme-toggle')?.addEventListener('click', () => {
  applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
});

/* Scroll reveal */
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in'));
}

/* Soft parallax on hero film */
const film = document.querySelector('[data-parallax]');
if (film && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener(
    'scroll',
    () => {
      const y = Math.min(window.scrollY * 0.12, 48);
      film.style.transform = `translate3d(0, ${y}px, 0) scale(1.02)`;
    },
    { passive: true },
  );
}
