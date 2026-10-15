import { createOptimizedPicture, fetchPlaceholders } from '../../scripts/aem.js';

// source slider rotates every 5s (data-autoslide="5")
const AUTOPLAY_DELAY = 5000;
const CHEVRON_DOWN = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7.41 8.58 12 13.17l4.59-4.59L18 10l-6 6-6-6z"/></svg>';
let carouselHeroId = 0;

function setActive(block, index) {
  const slides = [...block.querySelectorAll('.carousel-hero-slide')];
  if (!slides.length) return;
  const active = (index + slides.length) % slides.length;
  block.dataset.activeSlide = active;

  slides.forEach((slide, idx) => {
    const isActive = idx === active;
    slide.classList.toggle('is-active', isActive);
    slide.setAttribute('aria-hidden', !isActive);
    slide.querySelectorAll('a, button').forEach((el) => {
      if (isActive) el.removeAttribute('tabindex');
      else el.setAttribute('tabindex', '-1');
    });
  });

  block.querySelectorAll('.carousel-hero-indicator button').forEach((btn, idx) => {
    if (idx === active) {
      btn.setAttribute('aria-current', 'true');
      btn.setAttribute('disabled', 'true');
    } else {
      btn.removeAttribute('aria-current');
      btn.removeAttribute('disabled');
    }
  });
}

function startAutoplay(block) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let timer;
  const stop = () => clearInterval(timer);
  const start = () => {
    stop();
    timer = setInterval(() => {
      setActive(block, parseInt(block.dataset.activeSlide, 10) + 1);
    }, AUTOPLAY_DELAY);
  };
  block.addEventListener('mouseenter', stop);
  block.addEventListener('mouseleave', start);
  block.addEventListener('focusin', stop);
  block.addEventListener('focusout', start);
  start();
}

// Only same-origin assets go through the media optimizer; external URLs (e.g. unprocessed
// imports) would lose their required query string and break.
function isOptimizable(src) {
  try {
    return new URL(src, window.location.href).origin === window.location.origin;
  } catch {
    return false;
  }
}

/**
 * The imported slide carries the slide href as a trailing link-only paragraph whose text
 * repeats the title. Promote it onto the heading (the whole slide becomes clickable) and drop
 * the duplicate. A link with distinct text stays as a visible CTA.
 */
function promoteSlideLink(slide) {
  const content = slide.querySelector('.carousel-hero-slide-content');
  if (!content) return;
  const heading = content.querySelector('h1, h2, h3, h4, h5, h6');
  const linkParas = [...content.querySelectorAll(':scope > p')].filter((p) => {
    const a = p.querySelector(':scope > a');
    return a && p.children.length === 1 && p.textContent.trim() === a.textContent.trim();
  });
  const norm = (t) => t.replace(/\s+/g, ' ').trim().toLowerCase();
  const dup = heading && !heading.querySelector('a')
    && linkParas.find((p) => norm(p.textContent) === norm(heading.textContent));
  if (dup) {
    const a = dup.querySelector('a');
    a.replaceChildren(...heading.childNodes);
    a.removeAttribute('class');
    heading.append(a);
    dup.remove();
  }
  const headingLink = heading && heading.querySelector('a');
  if (headingLink && !content.querySelector('p > a')) {
    // whole slide navigates to the heading link (keyboard users still tab to the heading link)
    slide.classList.add('carousel-hero-slide-linked');
    slide.addEventListener('click', (e) => {
      if (e.target.closest('a, button') || window.getSelection().toString()) return;
      headingLink.click();
    });
  }
}

function createSlide(row, idx, id) {
  const slide = document.createElement('li');
  slide.className = 'carousel-hero-slide';
  slide.id = `carousel-hero-${id}-slide-${idx}`;
  slide.dataset.slideIndex = idx;

  const cells = [...row.children];
  // Tolerate authors swapping cell order or omitting the image cell.
  const imageCell = cells.find((c) => c.querySelector('picture') && !c.textContent.trim());
  cells.forEach((cell) => {
    if (cell === imageCell) {
      cell.className = 'carousel-hero-slide-image';
    } else if (cell.textContent.trim() || cell.querySelector('a')) {
      cell.className = 'carousel-hero-slide-content';
    } else {
      cell.remove();
      return;
    }
    slide.append(cell);
  });

  slide.querySelectorAll('.carousel-hero-slide-image picture > img').forEach((img) => {
    if (!isOptimizable(img.src)) {
      img.loading = idx === 0 ? 'eager' : 'lazy';
      if (idx === 0) img.setAttribute('fetchpriority', 'high');
      return;
    }
    const pic = createOptimizedPicture(img.src, img.alt, idx === 0, [
      { media: '(min-width: 900px)', width: '2000' },
      { width: '900' },
    ]);
    if (idx === 0) pic.querySelector('img').setAttribute('fetchpriority', 'high');
    img.closest('picture').replaceWith(pic);
  });

  promoteSlideLink(slide);

  const heading = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading && heading.id) slide.setAttribute('aria-labelledby', heading.id);
  return slide;
}

export default async function decorate(block) {
  carouselHeroId += 1;
  const id = carouselHeroId;
  block.id = `carousel-hero-${id}`;
  const rows = [...block.children];
  const placeholders = await fetchPlaceholders();

  block.setAttribute('role', 'region');
  // eslint-disable-next-line dot-notation
  block.setAttribute('aria-roledescription', (placeholders.carouselHero || placeholders['carousel']) || 'Carousel');

  const container = document.createElement('div');
  container.className = 'carousel-hero-slides-container';
  const slides = document.createElement('ul');
  slides.className = 'carousel-hero-slides';
  container.append(slides);

  rows.forEach((row, idx) => {
    slides.append(createSlide(row, idx, id));
    row.remove();
  });

  block.replaceChildren(container);

  if (rows.length > 1) {
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', placeholders.carouselSlideControls || 'Carousel Slide Controls');
    const indicators = document.createElement('ol');
    indicators.className = 'carousel-hero-indicators';
    rows.forEach((_, idx) => {
      const li = document.createElement('li');
      li.className = 'carousel-hero-indicator';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-label', `${placeholders.showSlide || 'Show Slide'} ${idx + 1} ${placeholders.of || 'of'} ${rows.length}`);
      btn.addEventListener('click', () => setActive(block, idx));
      li.append(btn);
      indicators.append(li);
    });
    nav.append(indicators);
    container.append(nav);
    block.classList.add('carousel-hero-multi');
  }

  // green band with a chevron that scrolls past the hero to the next section
  const next = block.closest('.section')?.nextElementSibling;
  if (next) {
    const cont = document.createElement('button');
    cont.type = 'button';
    cont.className = 'carousel-hero-continue';
    cont.setAttribute('aria-label', placeholders.carouselScrollDown || 'Clique para rolar a página');
    cont.innerHTML = CHEVRON_DOWN;
    cont.addEventListener('click', () => {
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      next.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    });
    container.append(cont);
  }

  setActive(block, 0);
  if (rows.length > 1) startAutoplay(block);
}
