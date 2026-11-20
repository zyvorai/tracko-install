const PAGES = 'https://zyvorai.github.io/tracko-install';

const cmds = {
  mac: `curl -fsSL ${PAGES}/install.sh | bash`,
};

const hints = {
  en: {
    mac: 'macOS Apple Silicon. Installs to /Applications and launches.',
  },
  hi: {
    mac: 'macOS Apple Silicon — /Applications में इंस्टॉल होकर लॉन्च होगा।',
  },
};

const copy = {
  en: {
    lede: 'Freight, finally clear.',
    sub: 'One control tower for India’s road logistics — GST, e-Way, SIM, FASTag, RFQ. Install in a single line.',
    heroCopy: 'Copy install command',
    seeProduct: 'See the product',
  },
  hi: {
    lede: 'फ्रेट, आख़िरकार साफ़।',
    sub: 'भारत की रोड लॉजिस्टिक्स के लिए एक कंट्रोल टॉवर — GST, e-Way, SIM, FASTag, RFQ। एक कमांड में इंस्टॉल।',
    heroCopy: 'इंस्टॉल कमांड कॉपी करें',
    seeProduct: 'प्रॉडक्ट देखें',
  },
};

let lang = localStorage.getItem('tracko-lang') || 'en';

function setOs(os) {
  document.querySelectorAll('.tab').forEach((t) => {
    const on = t.dataset.os === os;
    t.classList.toggle('active', on);
    t.setAttribute('aria-selected', on ? 'true' : 'false');
    t.tabIndex = on ? 0 : -1;
  });
  const cmd = cmds[os] || cmds.mac;
  ['install-cmd', 'install-cmd-2', 'hero-cmd'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = cmd;
  });
  const pack = hints[lang] || hints.en;
  const hint = document.getElementById('os-hint');
  if (hint) {
    hint.textContent = pack[os] || pack.mac;
  }
  const heroHint = document.getElementById('hero-hint');
  if (heroHint) {
    heroHint.textContent = 'macOS Apple Silicon · 30-day trial key works on every device (hub + browser)';
  }
  const eyebrow = document.getElementById('hero-eyebrow');
  if (eyebrow) {
    eyebrow.textContent = 'Mac · Apple Silicon';
  }
  const panel = document.getElementById('install-panel');
  if (panel) panel.setAttribute('aria-labelledby', `tab-${os}`);
  window.__trackoCmd = cmd;
}

function detectOs() {
  return 'mac';
}

function applyLang(next) {
  lang = next === 'hi' ? 'hi' : 'en';
  try { localStorage.setItem('tracko-lang', lang); } catch {}
  const c = copy[lang];
  const lede = document.querySelector('.lede');
  const sub = document.querySelector('.hero .sub');
  const heroBtn = document.getElementById('hero-copy');
  const see = document.querySelector('.cta-row .btn-ghost');
  if (lede) lede.textContent = c.lede;
  if (sub) sub.textContent = c.sub;
  if (heroBtn) heroBtn.textContent = c.heroCopy;
  if (see) see.textContent = c.seeProduct;
  document.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
    btn.setAttribute('aria-pressed', btn.dataset.lang === lang ? 'true' : 'false');
  });
  const os = document.querySelector('.tab.active')?.dataset.os || detectOs();
  setOs(os);
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
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    const prev = btn.textContent;
    btn.textContent = lang === 'hi' ? 'कॉपी हो गया' : 'Copied';
    showToast(lang === 'hi' ? 'क्लिपबोर्ड पर कॉपी' : 'Copied — paste in Terminal');
    setTimeout(() => { btn.textContent = prev; }, 1400);
  } catch {
    btn.textContent = 'Select & copy';
  }
}

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => setOs(tab.dataset.os));
  tab.addEventListener('keydown', (e) => {
    const tabs = [...document.querySelectorAll('.tab')];
    const i = tabs.indexOf(tab);
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      next.focus();
      setOs(next.dataset.os);
    }
  });
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

document.querySelectorAll('[data-lang]').forEach((btn) => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});

setOs(detectOs());
applyLang(lang);

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

/* Manifest → version badge */
fetch('./downloads/manifest.json')
  .then((r) => r.json())
  .then((m) => {
    const api = m.pilot?.api_version || m.world_class || '0.3.0';
    const desk = m.pilot?.desktop_build || m.version || '0.1.0';
    const beta = document.querySelector('.beta');
    if (beta) {
      beta.innerHTML = `Public beta · hub ${api} · desktop ${desk} · <a href="./CHANGELOG.md">What’s new</a> · <a href="#status">Status</a>`;
    }
    const verEl = document.getElementById('spec-api-version');
    if (verEl) verEl.textContent = `API / plan ${api} · world_class`;
    const deskEl = document.getElementById('spec-desktop-version');
    if (deskEl) deskEl.textContent = `Desktop build ${desk}`;

    setOs(document.querySelector('.tab.active')?.dataset.os || detectOs());
  })
  .catch(() => {});

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
