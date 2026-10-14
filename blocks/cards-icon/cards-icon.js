export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-icon-item';
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((cell) => {
      const hasPicture = cell.querySelector('picture, img');
      if (hasPicture && !cell.textContent.trim()) {
        cell.className = 'cards-icon-image';
      } else if (cell.textContent.trim() || cell.querySelector('a')) {
        cell.className = 'cards-icon-body';
      } else {
        cell.remove();
      }
    });
    if (!li.children.length) return;
    ul.append(li);
  });

  // icons are usually SVGs: keep the original asset (no raster optimization), mark decorative
  ul.querySelectorAll('.cards-icon-image img').forEach((img) => {
    if (!img.alt) img.setAttribute('aria-hidden', 'true');
    img.loading = 'lazy';
  });

  // make the whole tile clickable when the label holds a single link
  ul.querySelectorAll('li').forEach((li) => {
    const links = li.querySelectorAll('a');
    if (links.length === 1) li.classList.add('cards-icon-linked');
  });

  block.replaceChildren(ul);
}
