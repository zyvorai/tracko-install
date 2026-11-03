const PAGES = 'http://175.110.122.71:8787';

const cmds = {
  mac: `curl -fsSL ${PAGES}/install.sh | bash`,
  linux: `curl -fsSL ${PAGES}/install.sh | bash`,
  win: `irm ${PAGES}/install.ps1 | iex`,
};

const hints = {
  mac: 'macOS Apple Silicon. One command installs and launches Tracko.',
  linux: 'Linux AppImage next — script detects OS and guides you.',
  win: 'Windows 10/11 x64. One PowerShell line — no Setup.exe download on this page. Set TRACKO_API_URL for your hub.',
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
  const eyebrow = document.getElementById('hero-eyebrow');
  if (eyebrow) {
    eyebrow.textContent =
      os === 'win' ? 'Windows · x64' : os === 'linux' ? 'Linux · coming' : 'Mac · Apple Silicon';
  }
}

function detectOs() {
  const ua = navigator.userAgent || '';
  if (/Windows/i.test(ua)) return 'win';
  if (/Linux/i.test(ua) && !/Android/i.test(ua)) return 'linux';
  return 'mac';
}

async function copyText(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    const prev = btn.textContent;
    btn.textContent = 'Copied';
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
  const cmd = document.getElementById('hero-cmd')?.textContent
    || document.getElementById('install-cmd')?.textContent
    || cmds.mac;
  copyText(cmd, e.currentTarget);
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
  const meta = document.querySelector('meta[name="theme-color"]:not([media])')
    || document.querySelector('meta[name="theme-color"]');
  if (meta && !meta.media) meta.content = theme === 'dark' ? '#000000' : '#f5f5f7';
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

document.getElementById('theme-toggle')?.addEventListener('click', () => {
  applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
});
