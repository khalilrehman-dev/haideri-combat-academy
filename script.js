const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');

if (menuButton && mobileMenu) {
  menuButton.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open menu');
    });
  });
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('visible'));
} else {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
  revealItems.forEach((item) => observer.observe(item));
}
