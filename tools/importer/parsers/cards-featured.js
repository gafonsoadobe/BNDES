/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-featured. Base: cards (2 columns).
 * Source: https://www.bndes.gov.br/wps/portal/site/home
 * Selectors: #owl-carrousel, .container-bndes-carrossel > .owl-carousel
 * Structure: one row per card -> [image | linked h3 title + paragraph]
 * Source titles are h2 inside figcaption; output as h3.
 * Iterates block-level <article> wrappers (not inline <a>); skips owl-carousel
 * ".cloned" items so looped carousels do not duplicate cards.
 */
export default function parse(element, { document }) {
  let items = [...element.querySelectorAll('.owl-item:not(.cloned) article')];
  if (!items.length) items = [...element.querySelectorAll('article')];
  if (!items.length) items = [...element.querySelectorAll('.owl-item:not(.cloned), :scope > a, :scope > div:not(.owl-nav):not(.owl-dots)')];

  const seen = new Set();
  const cells = [];
  items.forEach((item) => {
    const img = item.querySelector('figure img, img');
    const heading = item.querySelector('figcaption h2, figcaption h3, h2, h3');
    const description = item.querySelector('figcaption p, p');
    const link = item.querySelector('a[href]') || item.closest('a[href]');
    if (!heading && !description && !img) return;

    const href = link ? link.getAttribute('href') : '';
    const title = heading ? heading.textContent.replace(/\s+/g, ' ').trim() : '';
    const key = `${href}|${title}`;
    if (seen.has(key)) return;
    seen.add(key);

    const imageCell = [];
    if (img) {
      const image = document.createElement('img');
      image.src = img.getAttribute('src');
      image.alt = img.getAttribute('alt') || '';
      imageCell.push(image);
    }

    const contentCell = [];
    if (title) {
      const h3 = document.createElement('h3');
      if (href) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = title;
        h3.append(a);
      } else {
        h3.textContent = title;
      }
      contentCell.push(h3);
    }
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.replace(/\s+/g, ' ').trim();
      contentCell.push(p);
    }

    cells.push([imageCell.length ? imageCell : '', contentCell.length ? contentCell : '']);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-featured', cells });
  element.replaceWith(block);
}
