const cmds = {
  mac: 'curl -fsSL https://zyvorai.github.io/tracko-install/install.sh | TRACKO_BASE_URL=https://zyvorai.github.io/tracko-install bash',
  linux: 'curl -fsSL https://zyvorai.github.io/tracko-install/install.sh | TRACKO_BASE_URL=https://zyvorai.github.io/tracko-install bash',
  win: 'irm https://zyvorai.github.io/tracko-install/install.ps1 | iex',
};

const hints = {
  mac: 'Available for macOS Apple Silicon. DMG also downloadable below.',
  linux: 'Linux AppImage coming next — script will detect and guide you.',
  win: 'Windows MSI planned — PowerShell install stub for private hosting.',
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

// If opened via a real host, rewrite install URLs to current origin
(() => {
  const base = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');
  if (!/^https?:\/\/127\.0\.0\.1:8787\/?$/.test(window.location.origin + '/')) {
    const origin = base.replace(/\/$/, '');
    const sh = `${origin}/install.sh`;
    cmds.mac = `curl -fsSL ${sh} | TRACKO_BASE_URL=${origin} bash`;
    cmds.linux = `curl -fsSL ${sh} | TRACKO_BASE_URL=${origin} bash`;
    cmds.win = `irm ${origin}/install.ps1 | iex`;
    setOs(document.querySelector('.tab.active')?.dataset.os || 'mac');
  }
})();
