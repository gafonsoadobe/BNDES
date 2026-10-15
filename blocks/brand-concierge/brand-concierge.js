import { loadScript } from '../../scripts/aem.js';

// Brand Concierge component install (Adobe Web SDK + concierge web agent)
const ALLOY_SRC = 'https://cdn1.adoberesources.net/alloy/2.35.1/alloy.min.js';
const CONCIERGE_SRC = 'https://experience.adobe.net/solutions/experience-platform-brand-concierge-web-agent/static-assets/main.js';
const STYLE_CONFIG_SRC = new URL('./styleConfigurations.js', import.meta.url).href;
const INSTANCE_NAME = 'alloy';

const ALLOY_CONFIG = {
  defaultConsent: 'in',
  edgeDomain: 'edge.adobedc.net',
  edgeBasePath: 'ee',
  datastreamId: '7bdceffd-e548-4440-8f79-cfa5f793e951',
  orgId: '0E061E2D61F93F260A495FD6@AdobeOrg',
  debugEnabled: true,
  idMigrationEnabled: false,
  thirdPartyCookiesEnabled: false,
  prehidingStyle: '.personalization-container { opacity: 0 !important }',
  conversation: {
    region: 'va7',
  },
};

/**
 * Installs the Web SDK command queue stub so alloy() can be called before
 * alloy.min.js finishes loading (same as Adobe's base code snippet).
 */
function installAlloyStub(name) {
  if (window[name]) return;
  window.__alloyNS = window.__alloyNS || []; // eslint-disable-line no-underscore-dangle
  window.__alloyNS.push(name); // eslint-disable-line no-underscore-dangle
  const stub = (...args) => new Promise((resolve, reject) => {
    stub.q.push([resolve, reject, args]);
  });
  stub.q = [];
  window[name] = stub;
}

/**
 * Loads and mounts the Brand Concierge web agent
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  block.textContent = '';
  const mount = document.createElement('div');
  mount.id = 'brand-concierge-mount';
  block.append(mount);

  // style configuration is optional: the agent falls back to its default styling
  await loadScript(STYLE_CONFIG_SRC).catch(() => {});

  installAlloyStub(INSTANCE_NAME);
  await Promise.all([loadScript(ALLOY_SRC), loadScript(CONCIERGE_SRC)]);

  window[INSTANCE_NAME]('configure', ALLOY_CONFIG);
  window[INSTANCE_NAME]('sendEvent', {});

  window.adobe.concierge.bootstrap({
    instanceName: INSTANCE_NAME,
    stylingConfigurations: window.styleConfiguration,
    selector: '#brand-concierge-mount',
    stickySession: false,
  });
}
