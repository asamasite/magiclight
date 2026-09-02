const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const preloader = $('.preloader');
const loadBar = $('.preloader__track i');
const loadLabel = $('.preloader b');
let progress = 0;
const loadingTimer = setInterval(() => {
  progress = Math.min(progress + Math.ceil(Math.random() * 13), 94);
  loadBar.style.width = `${progress}%`;
  loadLabel.textContent = `${progress}%`;
}, 100);

window.addEventListener('load', () => {
  clearInterval(loadingTimer);
  loadBar.style.width = '100%';
  loadLabel.textContent = '100%';
  setTimeout(() => {
    preloader.classList.add('is-hidden');
    startCounters();
  }, 350);
});

setTimeout(() => {
  if (!preloader.classList.contains('is-hidden')) {
    preloader.classList.add('is-hidden');
    startCounters();
  }
}, 2800);

const header = $('#header');
const progressLine = $('.scroll-progress i');
const toTop = $('.quick--top');

function syncScroll() {
  const top = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressLine.style.width = `${max > 0 ? (top / max) * 100 : 0}%`;
  header.classList.toggle('is-scrolled', top > 45);
  toTop.classList.toggle('show', top > 650);
}
window.addEventListener('scroll', syncScroll, { passive: true });
syncScroll();

const menuButton = $('.menu-toggle');
const menu = $('.nav');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menu.classList.toggle('open', !open);
  document.body.classList.toggle('menu-open', !open);
});
$$('.nav a').forEach(link => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menu.classList.remove('open');
  document.body.classList.remove('menu-open');
}));

toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .12 }) : null;
$$('.reveal').forEach(el => revealObserver ? revealObserver.observe(el) : el.classList.add('is-visible'));

const counters = $$('[data-count]');
let countersStarted = false;

function startCounters() {
  if (countersStarted) return;
  countersStarted = true;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  counters.forEach((el, index) => {
    const goal = Number(el.dataset.count);
    if (reduceMotion) {
      el.textContent = goal;
      return;
    }

    el.textContent = '0';
    setTimeout(() => {
      const duration = goal > 10 ? 1800 : 1150;
      const startedAt = performance.now();
      function draw(now) {
        const portion = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - portion, 3);
        el.textContent = Math.min(goal, Math.floor(goal * eased));
        if (portion < 1) requestAnimationFrame(draw);
        else el.textContent = goal;
      }
      requestAnimationFrame(draw);
    }, index * 140);
  });
}

const sections = $$('main section[id]');
const navLinks = $$('.nav a');
const sectionObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55%', threshold: 0 }) : null;
sections.forEach(section => sectionObserver?.observe(section));

const lightbox = $('.lightbox');
const lightboxImage = $('.lightbox img');
const lightboxCaption = $('.lightbox figcaption');
const lightboxClose = $('.lightbox > button');
$$('[data-image]').forEach(item => item.addEventListener('click', () => {
  lightboxImage.src = item.dataset.image;
  lightboxImage.alt = item.dataset.caption;
  lightboxCaption.textContent = item.dataset.caption;
  lightbox.showModal();
}));
lightboxClose.addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) lightbox.close();
});

$$('[data-slider]').forEach(slider => {
  const track = $('.project-track', slider);
  const slides = $$('.project-photo', slider);
  const dots = $('.slider-dots', slider);
  let index = 0;

  function show(next) {
    index = (next + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    $$('button', dots).forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index));
  }

  slides.forEach((_, dotIndex) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Фото ${dotIndex + 1}`);
    dot.addEventListener('click', event => {
      event.stopPropagation();
      show(dotIndex);
    });
    dots.append(dot);
  });
  $('.prev', slider).addEventListener('click', event => {
    event.stopPropagation();
    show(index - 1);
  });
  $('.next', slider).addEventListener('click', event => {
    event.stopPropagation();
    show(index + 1);
  });
  show(0);
});

const reviewsViewport = $('.reviews-viewport');
const reviewStep = () => {
  const card = $('.review-card');
  return card ? card.getBoundingClientRect().width + 18 : 320;
};
$('.reviews-prev')?.addEventListener('click', () => reviewsViewport.scrollBy({ left: -reviewStep(), behavior: 'smooth' }));
$('.reviews-next')?.addEventListener('click', () => reviewsViewport.scrollBy({ left: reviewStep(), behavior: 'smooth' }));

$('#year').textContent = new Date().getFullYear();
