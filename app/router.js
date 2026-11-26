// Hash router for RumahRapi: one route per page, no framework.
// The route table is the site's navigation — every page the nav links to
// has a view behind it, and the active link is marked for the reader.

import {
  bind,
  budgetView,
  billsView,
  dashboardView,
  goalsView,
  reportsView,
  tipsView,
  transactionsView,
} from './views.js';

const PAGES = [
  { hash: '#/', label: 'Ringkasan' },
  { hash: '#/transaksi', label: 'Transaksi' },
  { hash: '#/anggaran', label: 'Anggaran' },
  { hash: '#/tujuan', label: 'Tujuan' },
  { hash: '#/tagihan', label: 'Tagihan' },
  { hash: '#/laporan', label: 'Laporan' },
  { hash: '#/tips', label: 'Tips' },
];

function routeOf() {
  const raw = window.location.hash || '#/';
  const [path, query] = raw.split('?');
  const params = new URLSearchParams(query ?? '');
  return { path, params };
}

function viewFor(route) {
  if (route.path === '#/transaksi') return transactionsView(route.params.get('f') ?? 'semua');
  if (route.path === '#/anggaran') return budgetView();
  if (route.path === '#/tujuan') return goalsView();
  if (route.path === '#/tagihan') return billsView();
  if (route.path === '#/laporan') return reportsView(Number(route.params.get('m') ?? 6));
  if (route.path === '#/tips') return tipsView();
  return dashboardView();
}

export function renderNav(activePath) {
  const links = PAGES.map(
    (page) =>
      '<a href="' + page.hash + '"' + (page.hash === activePath ? ' aria-current="page"' : '') + '>' +
      page.label + '</a>',
  ).join('');
  return '<nav>' + links + '</nav>';
}

export function render() {
  const route = routeOf();
  const app = document.getElementById('app');
  app.innerHTML = viewFor(route);
  document.querySelectorAll('header nav a').forEach((link) => {
    link.toggleAttribute('aria-current', link.getAttribute('href') === route.path);
  });
  bind(app, render);
  window.scrollTo(0, 0);
}
