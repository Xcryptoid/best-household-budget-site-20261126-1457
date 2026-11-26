// Chart builders for RumahRapi: plain HTML bars, no library, no canvas.
// Bars are divs with a width, so they print and screenshot exactly as the
// browser lays them out — nothing to redraw, nothing that can fail.

import { formatRupiah, formatRupiahShort } from './format.js';

// A horizontal bar row: label, a bar filled to `fraction`, and a value.
// `tone` picks the bar colour: "green" on track, "amber" nearly full,
// "red" over budget.
export function barRow(label, valueText, fraction, tone) {
  const pct = Math.max(0, Math.min(100, Math.round(fraction * 100)));
  return (
    '<div class="bar-row">' +
    '<div class="bar-head"><span>' + label + '</span><strong>' + valueText + '</strong></div>' +
    '<div class="bar-track"><div class="bar-fill bar-' + tone + '" style="width:' + pct + '%"></div></div>' +
    '</div>'
  );
}

// Category spend bars: one row per category, sorted by amount spent.
export function categoryBars(rows) {
  const max = Math.max(1, ...rows.map((row) => row.spent));
  return rows
    .map((row) => {
      const tone = row.spent > row.budget ? 'red' : row.spent / row.budget > 0.9 ? 'amber' : 'green';
      return barRow(
        row.label + ' · ' + formatRupiahShort(row.spent) + ' dari ' + formatRupiahShort(row.budget),
        formatRupiah(row.spent),
        row.spent / max,
        tone,
      );
    })
    .join('');
}

// Monthly trend: paired income/spend columns for each month, with the
// tallest column setting the scale. Pure divs, labelled under each pair.
export function monthColumns(months) {
  const max = Math.max(1, ...months.flatMap((m) => [m.income, m.spend]));
  const cols = months
    .map((m) => {
      const inH = Math.round((m.income / max) * 120);
      const outH = Math.round((m.spend / max) * 120);
      return (
        '<div class="month-col">' +
        '<div class="month-bars">' +
        '<div class="month-bar month-in" style="height:' + inH + 'px" title="Pemasukan ' + formatRupiah(m.income) + '"></div>' +
        '<div class="month-bar month-out" style="height:' + outH + 'px" title="Pengeluaran ' + formatRupiah(m.spend) + '"></div>' +
        '</div>' +
        '<div class="month-label">' + m.month + '</div>' +
        '</div>'
      );
    })
    .join('');
  return '<div class="month-chart">' + cols + '</div>';
}
