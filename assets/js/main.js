// Ano atual no rodapé
document.getElementById('year').textContent = new Date().getFullYear();

// Alternância de tema: o site abre no escuro; o botão troca para o claro
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
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

// Links do YouTube e do Vimeo: miniatura automática (YouTube) e player no próprio site
function videoInfo(href) {
  let url;
  try { url = new URL(href, location.href); } catch (e) { return null; }
  const host = url.hostname.replace(/^www\./, '');
  let id = null;
  if (host === 'youtu.be') id = url.pathname.slice(1);
  if (host === 'youtube.com' || host === 'm.youtube.com') id = url.searchParams.get('v') || url.pathname.split('/').pop();
  if (id) {
    return {
      embed: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`,
      thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    };
  }
  if (host === 'vimeo.com') {
    const vid = url.pathname.split('/').filter(Boolean)[0];
    if (/^\d+$/.test(vid || '')) return { embed: `https://player.vimeo.com/video/${vid}?autoplay=1` };
  }
  return null;
}

const player = document.getElementById('player');
const frame = player.querySelector('.player__frame');

document.querySelectorAll('.work__link').forEach((link) => {
  const info = videoInfo(link.getAttribute('href'));
  if (!info) return;

  const still = link.querySelector('.work__still');
  if (info.thumb && still) still.style.setProperty('--thumb', `url("${info.thumb}")`);

  link.addEventListener('click', (e) => {
    if (typeof player.showModal !== 'function') return;
    e.preventDefault();
    const title = link.querySelector('.work__title').textContent;
    frame.innerHTML = `<iframe src="${info.embed}" title="${title.replace(/"/g, '&quot;')}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    player.showModal();
  });
});

player.addEventListener('close', () => { frame.innerHTML = ''; });
player.addEventListener('click', (e) => { if (e.target === player) player.close(); });
