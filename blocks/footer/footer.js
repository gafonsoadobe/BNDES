/**
 * Fetches the footer fragment as an inert document. Tries the local /content path
 * first (aem up), then the site root (DA/EDS preview and live).
 * @returns {Promise<Document|null>} parsed footer document
 */
async function fetchFooter() {
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return null;
  const doc = new DOMParser().parseFromString(await resp.text(), 'text/html');
  // resolve relative media against the fragment location, not the current page
  doc.querySelectorAll('img[src]').forEach((img) => {
    img.src = new URL(img.getAttribute('src'), resp.url).href;
  });
  doc.querySelectorAll('source[srcset]').forEach((source) => {
    source.srcset = new URL(source.getAttribute('srcset'), resp.url).href;
  });
  return doc;
}

function el(tag, className, ...children) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...children);
  return node;
}

function sectionContent(section) {
  if (!section) return [];
  const wrapper = section.querySelector(':scope > .default-content-wrapper');
  return [...(wrapper || section).children].map((n) => document.importNode(n, true));
}

/**
 * Groups a flat list of nodes into items, each starting at a heading.
 */
function groupByHeading(nodes) {
  const groups = [];
  nodes.forEach((node) => {
    if (/^H[1-6]$/.test(node.tagName) || !groups.length) groups.push([]);
    groups[groups.length - 1].push(node);
  });
  return groups;
}

function buildColumn(section, className) {
  const column = el('div', `footer-column ${className}`);
  groupByHeading(sectionContent(section)).forEach((group) => {
    const item = el('div', 'footer-item', ...group);
    if (group[0].querySelector('img')) item.classList.add('footer-item-icon');
    column.append(item);
  });
  return column;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const doc = await fetchFooter();
  if (!doc) return;
  const [contact, links, extra, legal] = [...doc.body.children];

  const main = el(
    'div',
    'footer-main',
    el(
      'div',
      'footer-container',
      buildColumn(contact, 'footer-column-contact'),
      buildColumn(links, 'footer-column-links'),
      buildColumn(extra, 'footer-column-extra'),
    ),
  );
  const copyright = el('div', 'footer-copyright', el('div', 'footer-container', ...sectionContent(legal)));

  block.textContent = '';
  block.append(main, copyright);
}
