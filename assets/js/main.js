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

// Sombra no cabeçalho ao rolar
const header = document.querySelector('.header');
window.addEventListener('scroll', () => header.classList.toggle('is-scrolled', window.scrollY > 8), { passive: true });
