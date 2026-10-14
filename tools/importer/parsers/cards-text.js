/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-text. Base: cards (no images variant, 1 column).
 * Source: https://www.bndes.gov.br/wps/portal/site/home
 * Selector: #destaque-texto > .section > .row
 * Structure: one row per card -> [linked h3 + paragraph]
 * Iterates block-level column wrappers (div.col), not the inline <a> wrappers.
 */
export default function parse(element, { document }) {
  let items = [...element.querySelectorAll(':scope > div.col')];
  if (!items.length) items = [...element.querySelectorAll(':scope > div')];

  const cells = [];
  items.forEach((item) => {
    const heading = item.querySelector('h3, h2, h4');
    const description = item.querySelector('p');
    const link = (heading && heading.closest('a')) || item.querySelector('a[href]');
    if (!heading && !description) return;

    const contentCell = [];
    if (heading) {
      const h3 = document.createElement('h3');
      const text = heading.textContent.replace(/\s+/g, ' ').trim();
      const href = link && link.getAttribute('href');
      if (href) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = text;
        h3.append(a);
      } else {
        h3.textContent = text;
      }
      contentCell.push(h3);
    }
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.replace(/\s+/g, ' ').trim();
      contentCell.push(p);
    }
    cells.push([contentCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-text', cells });
  element.replaceWith(block);
}
