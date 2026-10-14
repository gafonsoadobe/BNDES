/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: BNDES (IBM WebSphere Portal) site-wide cleanup.
 * All selectors verified in migration-work/cleaned.html.
 *
 * NOTE: Portal content wrappers use `section.wpthemeHidden` — these hold the
 * authorable content and must NOT be removed. Only the portlet chrome inside
 * them (header.wpthemeControlHeader, .asa-hidden, analytics overlay) is removed.
 *
 * Links are relative portal URLs (e.g. "?1dmy&urile=wcm%3apath%3a...") that don't
 * resolve on EDS; they are made absolute against the source page so they keep
 * pointing to www.bndes.gov.br until those pages are migrated.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Overlays / widgets that can interfere with block parsing
    WebImporter.DOMUtils.remove(element, [
      '#lgpddiv', // LGPD cookie notice (div#lgpddiv.lgpdfooter)
      '#vlibras-access-wrapper', // VLibras accessibility widget
      '#navegadorNaoSuportado', // outdated browser warning
    ]);

    // VLibras plugin markup: <div class="enabled"> wrapping .vw-plugin-top-wrapper
    element.querySelectorAll('.vw-plugin-top-wrapper').forEach((el) => {
      const wrapper = el.closest('.enabled');
      if (wrapper) wrapper.remove();
    });

    // Carousel UI chrome (not authorable)
    WebImporter.DOMUtils.remove(element, [
      '#navid', // hero "continue" link + cd-slider-navigation dots (inside #index-banner)
      '.cd-slider-navigation',
      '.owl-nav', // owl-carousel prev/next buttons (inside #owl-carrousel)
    ]);

    // Screen-reader-only headings (h1/h2.apenas-leitores-tela, h2.invisible)
    WebImporter.DOMUtils.remove(element, [
      '.apenas-leitores-tela',
      'h2.invisible',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Global header / navigation
    WebImporter.DOMUtils.remove(element, [
      'a.lnkContent', // "Ir para o conteudo" skip link
      '#barra-brasil', // gov.br bar
      '#header-bndes',
      '#navegacao-site',
      '#barra-menu', // search + bndes-menu-unificado-acessivel
    ]);

    // Global footer and complementary content
    WebImporter.DOMUtils.remove(element, [
      'footer.page-footer',
      '#wpthemeComplementaryContent',
    ]);

    // Portlet chrome ("Visualizador do Conteudo da Web" headers, asa markers)
    WebImporter.DOMUtils.remove(element, [
      'header.wpthemeControlHeader',
      '.asa-hidden',
      '[class="analytics.overlay"]',
      '#portletState',
    ]);

    // Tracking pixels
    WebImporter.DOMUtils.remove(element, [
      'img[src*="t.co/i/adsct"]',
      'img[src*="analytics.twitter.com"]',
    ]);

    // Non-content elements
    WebImporter.DOMUtils.remove(element, ['script', 'link', 'noscript', 'iframe', 'style']);

    // Relative portal links -> absolute links to the source site
    const baseUrl = (payload && payload.params && payload.params.originalURL) || (payload && payload.url);
    if (baseUrl) {
      element.querySelectorAll('a[href]').forEach((a) => {
        const href = a.getAttribute('href').trim();
        if (!href || /^(#|mailto:|tel:|javascript:)/i.test(href) || /^[a-z][a-z0-9+.-]*:\/\//i.test(href)) return;
        try {
          a.setAttribute('href', new URL(href, baseUrl).href);
        } catch (e) {
          // leave unparseable hrefs untouched
        }
      });
    }
  }
}
