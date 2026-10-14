// media query match that indicates desktop width
const isDesktop = window.matchMedia('(width >= 900px)');

const ZOOM_STEP = 0.1;
const ZOOM_MIN = 1;
const ZOOM_MAX = 1.5;

/**
 * Fetches the nav fragment as an inert document. Tries the local /content path first
 * (aem up), then the site root (DA/EDS preview and live).
 * @returns {Promise<Document|null>} parsed nav document
 */
async function fetchNav() {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
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

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  node.append(...children);
  return node;
}

/**
 * Returns the content children of a fragment section, unwrapping the
 * default-content wrapper the delivery pipeline may add.
 */
function sectionContent(section) {
  if (!section) return [];
  const wrapper = section.querySelector(':scope > .default-content-wrapper');
  return [...(wrapper || section).children];
}

function adoptAll(nodes) {
  return nodes.map((n) => document.importNode(n, true));
}

function setZoom(delta) {
  const current = parseFloat(document.documentElement.style.zoom) || 1;
  const next = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, current + delta));
  document.documentElement.style.zoom = next === 1 ? '' : next;
}

/**
 * Wires in-page action links (href="#...") from the fragment to their behavior.
 */
function decorateActions(container) {
  const actions = {
    '#aumentar-zoom': () => setZoom(ZOOM_STEP),
    '#diminuir-zoom': () => setZoom(-ZOOM_STEP),
    '#alto-contraste': () => document.body.classList.toggle('alto-contraste'),
  };
  container.querySelectorAll('a[href^="#"]').forEach((a) => {
    const action = actions[a.getAttribute('href')];
    if (!action) return;
    a.setAttribute('role', 'button');
    a.addEventListener('click', (e) => {
      e.preventDefault();
      action();
    });
  });
}

function buildGovBar(section) {
  const [logo, links] = adoptAll(sectionContent(section));
  const inner = el('div', { class: 'header-gov-inner' });
  if (logo) {
    logo.classList.add('header-gov-logo');
    inner.append(logo);
  }
  if (links) {
    links.classList.add('header-gov-links');
    inner.append(links);
  }
  return el('div', { class: 'header-gov' }, inner);
}

function buildBrandRow(brandSection, utilitySection) {
  const inner = el('div', { class: 'header-brand-inner' });
  const [logo] = adoptAll(sectionContent(brandSection));
  if (logo) {
    logo.classList.add('header-logo');
    inner.append(logo);
  }
  const utility = el('div', { class: 'header-utility' });
  const lists = adoptAll(sectionContent(utilitySection));
  ['header-tools', 'header-social', 'header-top-menu'].forEach((cls, i) => {
    if (lists[i]) {
      lists[i].classList.add(cls);
      utility.append(lists[i]);
    }
  });
  decorateActions(utility);
  inner.append(utility);
  return el('div', { class: 'header-brand' }, inner);
}

function buildSearch(searchLink) {
  const form = el('form', {
    class: 'header-search',
    role: 'search',
    method: 'get',
    action: searchLink ? searchLink.href : '',
  });
  const label = searchLink ? searchLink.textContent.trim() : '';
  const input = el('input', {
    type: 'search', name: 'q', class: 'header-search-input', 'aria-label': label,
  });
  const submit = el('button', { type: 'submit', class: 'header-search-submit', 'aria-label': label });
  form.append(input, submit);
  return form;
}

function setMenuOpen(menu, open) {
  menu.classList.toggle('is-open', open);
  menu.querySelectorAll('.header-menu-toggle, .header-menu-caret').forEach((b) => {
    b.setAttribute('aria-expanded', open);
  });
  document.body.classList.toggle('header-menu-open', open && !isDesktop.matches);
}

function buildMenuBar(section) {
  const [titleP, list, searchP] = adoptAll(sectionContent(section));
  const titleLink = titleP && titleP.querySelector('a');
  const label = titleLink ? titleLink.textContent.trim() : '';
  const menu = el('div', { class: 'header-menu' });

  const toggle = el('button', {
    type: 'button', class: 'header-menu-toggle', 'aria-expanded': 'false', 'aria-controls': 'header-menu-panel',
  }, el('span', { class: 'header-visually-hidden' }, label));
  const caret = el('button', {
    type: 'button', class: 'header-menu-caret', 'aria-label': label, 'aria-expanded': 'false', 'aria-controls': 'header-menu-panel',
  });
  if (titleLink) titleLink.classList.add('header-menu-title');
  const separator = el('span', { class: 'header-menu-separator', 'aria-hidden': 'true' });

  const panel = el('nav', { class: 'header-menu-panel', id: 'header-menu-panel', 'aria-label': label });
  const panelHead = el('div', { class: 'header-menu-panel-head' });
  const panelTitle = el('span', { class: 'header-menu-panel-title' }, label);
  const close = el('button', { type: 'button', class: 'header-menu-close', 'aria-label': 'Fechar' });
  panelHead.append(panelTitle, close);
  panel.append(panelHead);
  if (list) panel.append(list);

  const backdrop = el('div', { class: 'header-menu-backdrop', 'aria-hidden': 'true' });

  menu.append(toggle, ...(titleLink ? [titleLink] : []), caret, separator, panel, backdrop);

  [toggle, caret].forEach((b) => b.addEventListener('click', () => {
    setMenuOpen(menu, !menu.classList.contains('is-open'));
  }));
  [close, backdrop].forEach((b) => b.addEventListener('click', () => setMenuOpen(menu, false)));
  document.addEventListener('click', (e) => {
    if (menu.classList.contains('is-open') && !menu.contains(e.target)) setMenuOpen(menu, false);
  });

  const searchLink = searchP && searchP.querySelector('a');
  const bar = el('div', { class: 'header-menubar' }, menu, buildSearch(searchLink));
  return { bar, menu };
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const doc = await fetchNav();
  if (!doc) return;
  const [gov, brand, utility, menuSection] = [...doc.body.children];

  const nav = el('nav', { id: 'nav', 'aria-label': 'Cabeçalho' });
  const { bar, menu } = buildMenuBar(menuSection);
  nav.append(buildGovBar(gov), buildBrandRow(brand, utility), bar);

  block.textContent = '';
  block.append(el('div', { class: 'nav-wrapper' }, nav));

  // reset menu state when crossing the desktop breakpoint
  isDesktop.addEventListener('change', () => setMenuOpen(menu, false));
}
