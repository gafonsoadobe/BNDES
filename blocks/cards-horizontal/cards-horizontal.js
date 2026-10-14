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

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-horizontal-item';
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((cell) => {
      const hasPicture = cell.querySelector('picture, img');
      if (hasPicture && !cell.textContent.trim()) {
        cell.className = 'cards-horizontal-image';
      } else if (cell.textContent.trim() || cell.querySelector('a')) {
        cell.className = 'cards-horizontal-body';
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
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '500' }]));
  });

  // whole card is clickable when it holds a single link (the linked heading)
  ul.querySelectorAll('li').forEach((li) => {
    if (li.querySelectorAll('a').length === 1) li.classList.add('cards-horizontal-linked');
  });

  block.replaceChildren(ul);
}
