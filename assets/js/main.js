// Ano atual no rodapé
document.getElementById('year').textContent = new Date().getFullYear();

// Alternância de tema (claro/escuro)
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

function currentTheme() {
  const explicit = root.getAttribute('data-theme');
  if (explicit) return explicit;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

themeToggle.addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch (e) {}
});

// Menu mobile
const nav = document.getElementById('nav');
const navToggle = document.getElementById('nav-toggle');

function setNav(open) {
  nav.classList.toggle('is-open', open);
  navToggle.classList.toggle('is-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
}

navToggle.addEventListener('click', () => setNav(!nav.classList.contains('is-open')));
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setNav(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });

// Destaque do link ativo conforme a rolagem
const links = [...document.querySelectorAll('.nav__link')];
const sections = links.map((l) => document.querySelector(l.getAttribute('href')));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === '#' + entry.target.id));
    });
  },
  { rootMargin: '-45% 0px -50% 0px' }
);
sections.forEach((s) => s && observer.observe(s));

// Linha no cabeçalho ao rolar
const header = document.querySelector('.header');
window.addEventListener('scroll', () => header.classList.toggle('is-scrolled', window.scrollY > 8), { passive: true });

// Timecode da cartela: começa em 01:00:00:00, como uma timeline, a 24 quadros por segundo
const tc = document.getElementById('timecode');
const FPS = 24;
const pad = (n) => String(n).padStart(2, '0');

function formatTimecode(totalFrames) {
  const f = totalFrames % FPS;
  const s = Math.floor(totalFrames / FPS) % 60;
  const m = Math.floor(totalFrames / (FPS * 60)) % 60;
  const h = 1 + Math.floor(totalFrames / (FPS * 3600));
  return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const start = performance.now();
  const tick = (now) => {
    tc.textContent = formatTimecode(Math.floor(((now - start) / 1000) * FPS));
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// Filtro de trabalhos por formato
const filters = [...document.querySelectorAll('.filter')];
const works = [...document.querySelectorAll('.work')];

filters.forEach((btn) => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.filter;
    filters.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    works.forEach((w) => { w.hidden = cat !== 'todos' && w.dataset.cat !== cat; });
  });
});

// Player: links do YouTube ou Vimeo abrem o vídeo aqui mesmo
const player = document.getElementById('player');
const frame = player.querySelector('.player__frame');

function embedUrl(href) {
  let url;
  try { url = new URL(href, location.href); } catch (e) { return null; }
  const host = url.hostname.replace(/^www\./, '');
  if (host === 'youtu.be') return `https://www.youtube-nocookie.com/embed/${url.pathname.slice(1)}?autoplay=1`;
  if (host === 'youtube.com' || host === 'm.youtube.com') {
    const id = url.searchParams.get('v') || url.pathname.split('/').pop();
    return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1` : null;
  }
  if (host === 'vimeo.com') {
    const id = url.pathname.split('/').filter(Boolean)[0];
    return /^\d+$/.test(id || '') ? `https://player.vimeo.com/video/${id}?autoplay=1` : null;
  }
  return null;
}

document.querySelectorAll('.work__link').forEach((link) => {
  link.addEventListener('click', (e) => {
    const src = embedUrl(link.getAttribute('href'));
    if (!src || typeof player.showModal !== 'function') return;
    e.preventDefault();
    const title = link.closest('.work').querySelector('.work__title').textContent;
    frame.innerHTML = `<iframe src="${src}" title="${title.replace(/"/g, '&quot;')}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    player.showModal();
  });
});

player.addEventListener('close', () => { frame.innerHTML = ''; });
player.addEventListener('click', (e) => { if (e.target === player) player.close(); });
