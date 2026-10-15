import { createOptimizedPicture } from '../../scripts/aem.js';

// Only same-origin assets go through the media optimizer; external URLs (e.g. unprocessed
// imports) would lose their required query string and break.
function isOptimizable(src) {
  try {
    return new URL(src, window.location.href).origin === window.location.origin;
  } catch {
    return false;
  }
}

const ARROW_PATHS = {
  prev: 'M20 11v2H8l5.5 5.5-1.42 1.42L4.16 12l7.92-7.92L13.5 5.5 8 11h12z',
  next: 'M4 11v2h12l-5.5 5.5 1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5 16 11H4z',
};

function createArrow(direction, label) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `cards-featured-${direction}`;
  button.setAttribute('aria-label', label);
  button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${ARROW_PATHS[direction]}"/></svg>`;
  return button;
}

// Mobile carousel arrows (hidden on desktop via CSS, where all cards are visible).
function addNavigation(block, ul) {
  const nav = document.createElement('div');
  nav.className = 'cards-featured-nav';
  const prev = createArrow('prev', 'Ir para destaque anterior');
  const next = createArrow('next', 'Ir para próximo destaque');
  nav.append(prev, next);
  block.append(nav);

  const step = () => {
    const card = ul.firstElementChild;
    const gap = parseFloat(getComputedStyle(ul).columnGap) || 0;
    return card.getBoundingClientRect().width + gap;
  };

  const update = () => {
    const max = ul.scrollWidth - ul.clientWidth - 1;
    prev.disabled = ul.scrollLeft <= 1;
    next.disabled = ul.scrollLeft >= max;
  };

  const behavior = () => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');
  prev.addEventListener('click', () => ul.scrollBy({ left: -step(), behavior: behavior() }));
  next.addEventListener('click', () => ul.scrollBy({ left: step(), behavior: behavior() }));

  let frame;
  ul.addEventListener('scroll', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(update);
  }, { passive: true });
  // the section is hidden while loading, so measure once it gets laid out (and on resize)
  new ResizeObserver(update).observe(ul);
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-featured-item';
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((cell) => {
      const hasPicture = cell.querySelector('picture, img');
      if (hasPicture && !cell.textContent.trim()) {
        cell.className = 'cards-featured-image';
      } else if (cell.textContent.trim() || cell.querySelector('a')) {
        cell.className = 'cards-featured-body';
      } else {
        cell.remove();
      }
    });
    if (!li.children.length) return;
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    if (!isOptimizable(img.src)) {
      img.loading = 'lazy';
      return;
    }
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });

  // whole card is clickable when it holds a single link (the linked heading)
  ul.querySelectorAll('li').forEach((li) => {
    if (li.querySelectorAll('a').length === 1) li.classList.add('cards-featured-linked');
  });

  block.replaceChildren(ul);
  if (ul.children.length > 1) addNavigation(block, ul);
}
