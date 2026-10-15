/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselHeroParser from './parsers/carousel-hero.js';
import cardsTextParser from './parsers/cards-text.js';
import cardsFeaturedParser from './parsers/cards-featured.js';
import cardsHorizontalParser from './parsers/cards-horizontal.js';
import cardsIconParser from './parsers/cards-icon.js';

// TRANSFORMER IMPORTS
import bndesCleanupTransformer from './transformers/bndes-cleanup.js';
import bndesSectionsTransformer from './transformers/bndes-sections.js';
import bndesBrandConciergeTransformer from './transformers/bndes-brand-concierge.js';

// PARSER REGISTRY
const parsers = {
  'carousel-hero': carouselHeroParser,
  'cards-text': cardsTextParser,
  'cards-featured': cardsFeaturedParser,
  'cards-horizontal': cardsHorizontalParser,
  'cards-icon': cardsIconParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'site',
  description: 'BNDES homepage: hero rotator, text highlights, featured image cards, dark-blue image highlights and icon quick links',
  urls: [
    'https://www.bndes.gov.br/wps/portal/site/home',
  ],
  blocks: [
    {
      name: 'carousel-hero',
      instances: ['#cd-slider', '.cd-slider-wrapper > ul.cd-slider'],
    },
    {
      name: 'cards-text',
      instances: ['#destaque-texto > .section > .row'],
    },
    {
      name: 'cards-featured',
      instances: ['#owl-carrousel', '.container-bndes-carrossel > .owl-carousel'],
    },
    {
      name: 'cards-horizontal',
      instances: ['#destaque-imagens > .container > .row'],
    },
    {
      name: 'cards-icon',
      instances: ['#destaque-botoes > .container.setores', '.container.setores'],
    },
  ],
  sections: [
    {
      id: '1',
      name: 'hero-banner',
      selector: ['#index-banner', '.cd-slider-wrapper'],
      style: null,
      blocks: ['carousel-hero'],
      defaultContent: [],
    },
    {
      id: '2',
      name: 'text-highlights',
      selector: ['#destaque-texto'],
      style: null,
      blocks: ['cards-text'],
      defaultContent: [],
    },
    {
      id: '3',
      name: 'featured-cards',
      selector: ['section#w', '#owlmy'],
      style: null,
      blocks: ['cards-featured'],
      defaultContent: [],
    },
    {
      id: '4',
      name: 'image-highlights',
      selector: ['#destaque-imagens'],
      style: 'dark-blue',
      blocks: ['cards-horizontal'],
      defaultContent: [],
    },
    {
      id: '5',
      name: 'quick-links',
      selector: ['#destaque-botoes'],
      style: null,
      blocks: ['cards-icon'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY - section transformer runs after cleanup
const transformers = [
  bndesCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [bndesSectionsTransformer] : []),
  bndesBrandConciergeTransformer,
];

// The portal serves every page under this prefix; the site home is the prefix itself.
const PORTAL_PREFIX = '/wps/portal/site/home';

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        // Fallback selectors can match an element already claimed by a primary selector
        if (pageBlocks.some((b) => b.element === element)) return;
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

/**
 * Map a portal URL to a document path: strip the portal prefix, and map the
 * site home (empty path) to /index.
 * @param {string} originalURL - Source page URL
 * @returns {string} Sanitized document path
 */
function generateDocumentPath(originalURL) {
  let rawPath = new URL(originalURL).pathname
    .replace(/\/$/, '')
    .replace(/\.html?$/, '');
  if (rawPath.startsWith(PORTAL_PREFIX)) {
    rawPath = rawPath.slice(PORTAL_PREFIX.length);
  }
  return WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Initial cleanup + section breaks
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block; skip elements already replaced by a prior parser
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Final cleanup + section metadata
    executeTransformers('afterTransform', main, payload);

    // 5. Built-in importer rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Document path
    const path = generateDocumentPath(params.originalURL);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
