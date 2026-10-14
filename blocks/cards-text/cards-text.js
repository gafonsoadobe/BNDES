export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-text-item';
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((cell) => {
      const hasPicture = cell.querySelector('picture, img');
      if (hasPicture && !cell.textContent.trim()) {
        cell.className = 'cards-text-image';
      } else if (cell.textContent.trim() || cell.querySelector('a')) {
        cell.className = 'cards-text-body';
      } else {
        cell.remove();
      }
    });
    if (!li.children.length) return;
    ul.append(li);
  });

  // whole card is clickable when it holds a single link (the linked heading)
  ul.querySelectorAll('li').forEach((li) => {
    if (li.querySelectorAll('a').length === 1) li.classList.add('cards-text-linked');
  });

  block.replaceChildren(ul);
}
