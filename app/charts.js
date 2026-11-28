// Small charts for RumahRapi, drawn as plain SVG strings — no library, no
// network, nothing to load. A bar chart is a row per category: the bar's
// length is the share of the biggest spend, the figure sits at its end, and
// a bar that has passed its plan turns rust red instead of green.

import { rupiahShort } from './money.js';

const GREEN = '#1d5c3f';
const RUST = '#b3401f';
const TRACK = '#e9e2d3';

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

// Horizontal bars: one row per line, with the category name, a track, a
// filled bar and the amount. Widths are percentages of the largest value,
// so the longest bar always fills the row.
export function categoryBars(lines) {
  const biggest = Math.max(1, ...lines.map((line) => line.spent));
  const rows = lines
    .map((line) => {
      const width = Math.max(2, Math.round((line.spent / biggest) * 100));
      const colour = line.over ? RUST : GREEN;
      return `<div class="bar-row">
  <span class="bar-label">${escapeHtml(line.category)}</span>
  <span class="bar-track"><span class="bar-fill" style="width:${width}%;background:${colour}"></span></span>
  <span class="bar-value">${rupiahShort(line.spent)}</span>
</div>`;
    })
    .join('');
  return `<div class="bars" role="img" aria-label="Spending by category">${rows}</div>`;
}

// A single progress bar: spent against planned, with the percentage and the
// remaining amount written out beside it, so the bar never stands alone
// without its numbers.
export function progressBar({ spent, planned, used, remaining, over }) {
  const width = Math.min(100, used);
  const colour = over ? RUST : GREEN;
  const status = over
    ? `Over by ${rupiahShort(Math.abs(remaining))}`
    : `${rupiahShort(remaining)} left`;
  return `<div class="progress" role="img" aria-label="${used}% of plan used">
  <span class="progress-track"><span class="progress-fill" style="width:${width}%;background:${colour}"></span></span>
  <span class="progress-text">${used}% · ${status}</span>
</div>`;
}
