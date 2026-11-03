const PAGES = 'http://175.110.122.71:8787';

const cmds = {
  mac: `curl -fsSL ${PAGES}/install.sh | bash`,
  linux: `curl -fsSL ${PAGES}/install.sh | bash`,
  win: `irm ${PAGES}/install.ps1 | iex`,
};

const hints = {
  mac: 'macOS Apple Silicon. Installs to /Applications and launches.',
  linux: 'Linux AppImage coming next — script will detect and guide you.',
  win: 'Windows installer planned — PowerShell stub for private hosting.',
};

function setOs(os) {
  document.querySelectorAll('.tab').forEach((t) => {
    t.classList.toggle('active', t.dataset.os === os);
  });
  const cmd = cmds[os] || cmds.mac;
  const c1 = document.getElementById('install-cmd');
  const c2 = document.getElementById('install-cmd-2');
  if (c1) c1.textContent = cmd;
  if (c2) c2.textContent = cmd;
  const hint = document.getElementById('os-hint');
  if (hint) hint.textContent = hints[os] || hints.mac;
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
