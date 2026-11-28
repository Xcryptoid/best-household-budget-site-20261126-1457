// RumahRapi's screenshot run: four real renders of the site, taken with the
// Playwright Chromium on this box. The site is served over plain HTTP from
// app/ (ES modules do not run from file://), and every shot waits for
// window.__shotReady so the page is fully rendered before the capture.
//
// Shot 3 is the live proof: the script really fills the add-transaction form
// and submits it, then checks the page before capturing — the confirmation
// line must show November spending moving from Rp 13.475.000 to
// Rp 13.560.000, and the new row must sit at the top of the list. If either
// check fails the run stops without writing that shot.
//
// Usage: node serve.ts --port 8123 in one shell, then:
//   node tools/shots.mjs
import { chromium } from '/home/hatch/workspace/bug-bounty/make-fun/shot-tools/node_modules/playwright-core/index.mjs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const exe = join(homedir(), '.cache/ms-playwright/chromium-1255/chrome-linux64/chrome');
const out = new URL('../screenshots/', import.meta.url).pathname;
const base = 'http://127.0.0.1:8123/';

const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox', '--hide-scrollbars'] });
const context = await browser.newContext();
const page = await context.newPage();
page.on('pageerror', (error) => console.log('PAGE ERROR:', String(error)));
page.on('console', (message) => {
  if (message.type() === 'error') console.log('CONSOLE ERROR:', message.text());
});
page.on('request', (request) => {
  if (!request.url().startsWith('http://127.0.0.1:8123')) console.log('EXTERNAL REQUEST:', request.url());
});

await page.goto(base, { waitUntil: 'load' });
await page.evaluate(() => window.localStorage.clear());
await page.reload({ waitUntil: 'load' });

async function capture(file, hash, width, height) {
  const view = await browser.newPage({ viewport: { width, height } });
  view.on('pageerror', (error) => console.log('PAGE ERROR:', String(error)));
  await view.goto(`${base}${hash}`, { waitUntil: 'load' });
  await view.waitForFunction(() => window.__shotReady === true, null, { timeout: 10000 });
  await view.waitForTimeout(250);
  const heading = await view.evaluate(() => document.querySelector('h1')?.textContent ?? '(no h1)');
  console.log(file, '|', heading);
  await view.screenshot({ path: join(out, file), type: 'jpeg', quality: 82 });
  await view.close();
}

// The three static shots first, while the ledger still holds its seed rows.
await capture('1-dashboard.jpg', '#/', 1280, 800);
await capture('2-budgets.jpg', '#/budgets', 1280, 800);
await capture('4-phone.jpg', '#/', 390, 844);

// The live proof, last: fill the form and submit it for real.
await page.setViewportSize({ width: 1280, height: 800 });
await page.goto(`${base}#/transactions`, { waitUntil: 'load' });
await page.waitForFunction(() => window.__shotReady === true, null, { timeout: 10000 });
await page.fill('#tx-date', '2026-11-28');
await page.fill('#tx-desc', 'Pasar Minggu — sayur & buah');
await page.selectOption('#tx-category', 'Groceries');
await page.fill('#tx-amount', '85000');
await page.selectOption('#tx-kind', 'expense');
await page.click('#tx-add');
await page.waitForFunction(() => window.__shotReady === true, null, { timeout: 10000 });
await page.waitForTimeout(250);

const proof = await page.evaluate(() => {
  const notice = document.querySelector('.notice')?.textContent ?? '';
  const firstRow = document.querySelector('#tx-list tbody tr')?.textContent ?? '';
  const lede = document.querySelector('.lede')?.textContent ?? '';
  return { notice, firstRow, lede };
});
console.log('notice:', proof.notice);
console.log('first row:', proof.firstRow);
console.log('lede:', proof.lede);
if (!proof.notice.includes('Rp 13.475.000') || !proof.notice.includes('Rp 13.560.000')) {
  throw new Error('LIVE PROOF FAILED: the confirmation line does not show the totals moving 13.475.000 -> 13.560.000');
}
if (!proof.firstRow.includes('Pasar Minggu') || !proof.firstRow.includes('85.000')) {
  throw new Error('LIVE PROOF FAILED: the new transaction is not at the top of the list');
}
if (!proof.lede.includes('Rp 13.560.000')) {
  throw new Error('LIVE PROOF FAILED: the page totals did not update to 13.560.000');
}
console.log('3-add-live.jpg | live proof verified: totals moved, new row on top');
await page.screenshot({ path: join(out, '3-add-live.jpg'), type: 'jpeg', quality: 82 });

await browser.close();
console.log('done');
