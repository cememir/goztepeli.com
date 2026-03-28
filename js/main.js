/**
 * Göztepe Fan Sitesi - main.js
 * Tüm sayfalarda yüklenen ortak JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initActiveLink();
  initSmoothScroll();
  initScrollHeader();
});

/* ---- Hamburger Menü ---- */
function initNav() {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('nav');

  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    nav.classList.toggle('open');
  });

  // Dışarı tıklandığında kapat
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
    }
  });

  // Nav linkine tıklandığında kapat
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
    });
  });
}

/* ---- Aktif Nav Linki ---- */
function initActiveLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ---- Smooth Scroll (tarihçe bölüm linkleri) ---- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('header')?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ---- Header Scroll Gölge Efekti ---- */
function initScrollHeader() {
  const header = document.querySelector('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.style.boxShadow = '0 2px 16px rgba(0,0,0,0.35)';
    } else {
      header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
    }
  }, { passive: true });
}
