/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: adds the Brand Concierge agent block in its own section right
 * after the hero carousel. The block is not on the source page; it mounts the
 * Adobe Brand Concierge web agent (see blocks/brand-concierge).
 */
function findBlockTable(root, name) {
  return [...root.querySelectorAll('table')].find((table) => {
    const firstCell = table.querySelector('tr > th, tr > td');
    return firstCell && firstCell.textContent.trim().toLowerCase() === name.toLowerCase();
  });
}

export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;
  const hero = findBlockTable(element, 'Carousel Hero');
  if (!hero || findBlockTable(element, 'Brand Concierge')) return;

  const block = WebImporter.Blocks.createBlock(payload.document || element.ownerDocument, {
    name: 'Brand Concierge',
    cells: [['Assistente virtual do BNDES']],
  });
  const hr = (payload.document || element.ownerDocument).createElement('hr');
  hero.after(hr, block);
}
