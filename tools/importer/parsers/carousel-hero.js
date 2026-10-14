/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-hero. Base: carousel.
 * Source: https://www.bndes.gov.br/wps/portal/site/home
 * Selectors: #cd-slider, .cd-slider-wrapper > ul.cd-slider
 * Structure: one row per slide -> [image | h2 title + paragraph + CTA link (slide href)]
 * Iterates block-level <li> slides (not the a.item-hero wrappers, which are inline
 * elements wrapping block content and can be merged by html2md preprocessing).
 */
export default function parse(element, { document }) {
  let slides = [...element.querySelectorAll(':scope > li')];
  if (!slides.length) slides = [...element.querySelectorAll('li')];

  const cells = [];
  slides.forEach((slide) => {
    const img = slide.querySelector('.parallax img, picture img, img');
    const heading = slide.querySelector('h2, h1, h3, .header');
    const description = slide.querySelector('p.subtitulo, .legenda p, p');
    const link = slide.querySelector('a.item-hero') || slide.querySelector('a[href]');

    if (!img && !heading && !description) return;

    const imageCell = [];
    if (img) {
      const image = document.createElement('img');
      image.src = img.getAttribute('src');
      image.alt = img.getAttribute('alt') || '';
      imageCell.push(image);
    }

    const contentCell = [];
    let titleText = '';
    if (heading) {
      titleText = heading.textContent.replace(/\s+/g, ' ').trim();
      const h2 = document.createElement('h2');
      h2.textContent = titleText;
      contentCell.push(h2);
    }
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.replace(/\s+/g, ' ').trim();
      contentCell.push(p);
    }
    const href = link && link.getAttribute('href');
    if (href) {
      const ctaP = document.createElement('p');
      const a = document.createElement('a');
      a.href = href;
      a.textContent = titleText || (img && img.getAttribute('alt')) || href;
      ctaP.append(a);
      contentCell.push(ctaP);
    }

    cells.push([imageCell.length ? imageCell : '', contentCell.length ? contentCell : '']);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
