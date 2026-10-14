/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-icon. Base: cards (2 columns).
 * Source: https://www.bndes.gov.br/wps/portal/site/home
 * Selectors: #destaque-botoes > .container.setores, .container.setores
 * Structure: one row per item -> [icon image | linked h3 label]
 * Iterates block-level div.icon-block wrappers (not the inner <a>).
 * Icons are SVG files. On the live page a script swaps each <img> for an inline
 * <svg class="replaced-svg" id="Layer_*">; in the cleaned DOM they are data-URI <img>s.
 * Both are mapped back to the original portal SVG URLs (migration-work/metadata.json
 * images.mapping) by the svg id / position; unknown inline SVGs fall back to a data URI.
 */
const ICON_BASE = 'https://www.bndes.gov.br/wps/wcm/connect/site/';
const ICONS = {
  canais: `${ICON_BASE}e6bcfce7-a341-401e-8650-23a9a76b2882/ICONE_Canais+de+Atendimento.svg?MOD=AJPERES&CACHEID=ROOTWORKSPACE.Z18_7QGCHA41LORVA0AHO1SIO51085-e6bcfce7-a341-401e-8650-23a9a76b2882-pYVstc8`,
  finame: `${ICON_BASE}5ed57d7f-67c4-4696-91df-b4a9d25469af/ICONE_Finame.svg?MOD=AJPERES&CACHEID=ROOTWORKSPACE.Z18_7QGCHA41LORVA0AHO1SIO51085-5ed57d7f-67c4-4696-91df-b4a9d25469af-pYVs5G.`,
  estudos: `${ICON_BASE}d51f7e4a-74d1-4ddb-9806-3521b46d0d06/%C3%8DCONE_Estudos+e+Pesquisas.svg?MOD=AJPERES&CACHEID=ROOTWORKSPACE.Z18_7QGCHA41LORVA0AHO1SIO51085-d51f7e4a-74d1-4ddb-9806-3521b46d0d06-pYVsFYf`,
  online: `${ICON_BASE}00c5ee78-c6aa-4063-b76b-c713e98f1da9/ICONE_Servi%C3%A7os+Online.svg?MOD=AJPERES&CACHEID=ROOTWORKSPACE.Z18_7QGCHA41LORVA0AHO1SIO51085-00c5ee78-c6aa-4063-b76b-c713e98f1da9-pYVshvs`,
};
// Document order of the icons on the source page (fallback when no id hint exists).
const ICON_ORDER = ['canais', 'finame', 'estudos', 'online'];

function iconFromHint(hint) {
  const h = (hint || '').toLowerCase();
  const key = Object.keys(ICONS).find((k) => h.includes(k));
  return key ? ICONS[key] : '';
}

function svgDataUri(svg) {
  const clone = svg.cloneNode(true);
  clone.querySelectorAll('title').forEach((t) => t.remove());
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(clone.outerHTML)}`;
}

function resolveImgSrc(img, index) {
  const src = img.getAttribute('src') || '';
  if (src && !src.startsWith('data:')) return src;
  const lazy = img.getAttribute('data-src') || img.getAttribute('data-original');
  if (lazy && !lazy.startsWith('data:')) return lazy;
  return iconFromHint(`${img.id} ${img.getAttribute('class') || ''}`)
    || ICONS[ICON_ORDER[index]] || src;
}

function resolveSvgSrc(svg, index) {
  return iconFromHint(`${svg.id} ${svg.getAttribute('data-name') || ''}`)
    || svgDataUri(svg) || ICONS[ICON_ORDER[index]];
}

export default function parse(element, { document }) {
  let items = [...element.querySelectorAll(':scope > .icon-block')];
  if (!items.length) items = [...element.querySelectorAll('.icon-block')];
  if (!items.length) items = [...element.querySelectorAll(':scope > div, :scope > a')];

  const cells = [];
  items.forEach((item, index) => {
    const icon = item.querySelector('img, svg');
    const heading = item.querySelector('h3, h2, h4');
    const link = (heading && heading.closest('a[href]')) || item.querySelector('a[href]');
    if (!heading && !icon) return;

    const text = heading ? heading.textContent.replace(/\s+/g, ' ').trim() : '';

    const imageCell = [];
    if (icon) {
      const isImg = icon.tagName.toLowerCase() === 'img';
      const img = document.createElement('img');
      img.src = isImg ? resolveImgSrc(icon, index) : resolveSvgSrc(icon, index);
      img.alt = (isImg && icon.getAttribute('alt')) || text;
      imageCell.push(img);
    }

    const contentCell = [];
    if (text) {
      const h3 = document.createElement('h3');
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

    cells.push([imageCell.length ? imageCell : '', contentCell.length ? contentCell : '']);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-icon', cells });
  element.replaceWith(block);
}
