const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.nav-links');

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menu.classList.toggle('open', !open);
    document.body.classList.toggle('menu-open', !open);
  });

  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
    document.body.classList.remove('menu-open');
  }));
}

const revealObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 })
  : null;

document.querySelectorAll('.reveal').forEach((item) => {
  if (revealObserver) revealObserver.observe(item);
  else item.classList.add('visible');
});

const lightbox = document.querySelector('.lightbox');
if (lightbox) {
  const lightboxImage = lightbox.querySelector('img');
  const lightboxCaption = lightbox.querySelector('figcaption');
  const closeButton = lightbox.querySelector('.lightbox-close');
  let previousFocus = null;

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    if (previousFocus) previousFocus.focus();
  };

  document.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => {
      const image = item.querySelector('img');
      previousFocus = item;
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightboxCaption.textContent = item.dataset.caption || image.alt;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('menu-open');
      closeButton.focus();
    });
  });

  closeButton.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
}

document.querySelectorAll('[data-year]').forEach((item) => {
  item.textContent = new Date().getFullYear();
});
