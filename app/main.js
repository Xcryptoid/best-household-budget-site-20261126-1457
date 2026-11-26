// RumahRapi entrypoint: build the navigation once, then hand control to
// the router. Nothing here fetches anything — the whole site is its own
// files, so it opens offline on a desktop and on a phone alike.

// Boot order, on purpose: the navigation is built first so the reader
// always sees every page link even before the first view renders, and the
// router then paints the current hash. A later hashchange only repaints
// the view — the header never rebuilds, so the nav never flickers.

import { render, renderNav } from './router.js';

document.querySelector('header').insertAdjacentHTML('beforeend', renderNav('#/'));
window.addEventListener('hashchange', render);
render();
