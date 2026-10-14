/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-horizontal. Base: cards (2 columns).
 * Source: https://www.bndes.gov.br/wps/portal/site/home
 * Selector: #destaque-imagens > .container > .row
 * Structure: one row per card -> [image | linked h3 + paragraph]
 * Source cards are sibling <a class="col s6"> wrapping block content. Iteration is
 * keyed on the inner block wrapper (div.conteudo) and pairs it with its sibling
 * image, so html2md inline-element merging cannot collapse cards. The href is
 * read from the enclosing anchor and re-attached to the heading.
 */
export default function parse(element, { document }) {
  let items = [...element.querySelectorAll('.conteudo')].map((body) => ({
    body,
    image: body.parentElement && body.parentElement.querySelector(':scope > img, :scope > picture img'),
    link: body.closest('a[href]'),
  }));
  if (!items.length) {
    // Fallback: iterate the anchor wrappers directly.
    items = [...element.querySelectorAll(':scope > a')].map((card) => ({
      body: card,
      image: card.querySelector('img'),
      link: card,
    }));
  }

  const cells = [];
  items.forEach(({ body, image, link }) => {
    const heading = body.querySelector('h3, h2, h4');
    const description = body.querySelector('p');
    if (!heading && !description && !image) return;

    const imageCell = [];
    if (image) {
      const img = document.createElement('img');
      img.src = image.getAttribute('src');
      img.alt = image.getAttribute('alt') || '';
      imageCell.push(img);
    }

    const contentCell = [];
    const href = link && link.getAttribute('href');
    if (heading) {
      const h3 = document.createElement('h3');
      const text = heading.textContent.replace(/\s+/g, ' ').trim();
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

    cells.push([imageCell.length ? imageCell : '', contentCell.length ? contentCell : '']);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-horizontal', cells });
  element.replaceWith(block);
}
