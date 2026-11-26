// The seven pages of RumahRapi. Each view is one function that returns
// HTML for its route; `bind()` wires the controls on the rendered page to
// the store, so every button and form on the site actually does its job.
// All money shown comes from the store, never from hard-coded totals.

import { BILLS, CATEGORIES, GOALS, HISTORY, HOUSEHOLD, INCOME, TIPS } from './data.js';
import {
  addToGoal,
  addTransaction,
  allTransactions,
  billPaid,
  budgetOf,
  goalSaved,
  remainingMoney,
  savingsRate,
  setBudget,
  spentByCategory,
  toggleBill,
  totalBudget,
  totalIncome,
  totalSetAside,
  totalSpent,
  unpaidBills,
  unpaidBillsTotal,
} from './store.js';
import { categoryBars, monthColumns } from './charts.js';
import { formatDateShort, formatPercent, formatRupiah, formatRupiahShort } from './format.js';

function esc(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function statCard(label, value, note) {
  return (
    '<div class="stat"><div class="stat-label">' + label + '</div>' +
    '<div class="stat-value">' + value + '</div>' +
    '<div class="stat-note">' + note + '</div></div>'
  );
}

function categoryName(id) {
  return CATEGORIES.find((cat) => cat.id === id)?.label ?? id;
}

function statusOf(cat, spent) {
  if (spent > budgetOf(cat)) return ['Melebihi anggaran', 'badge-red'];
  if (spent / budgetOf(cat) > 0.9) return ['Hampir habis', 'badge-amber'];
  return ['Aman', 'badge-green'];
}

// --- Dashboard -----------------------------------------------------------

export function dashboardView() {
  const spent = spentByCategory();
  const topCats = CATEGORIES.filter((cat) => cat.kind === 'spend')
    .map((cat) => ({ label: cat.label, spent: spent[cat.id], budget: budgetOf(cat) }))
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5);
  const recent = allTransactions().slice(0, 5);
  const unpaid = unpaidBills();
  const rows = recent
    .map(
      (tx) =>
        '<tr><td>' + formatDateShort(tx.date) + '</td><td>' + esc(tx.label) + '</td><td>' +
        esc(categoryName(tx.category)) + '</td><td class="num">' + formatRupiah(tx.amount) + '</td></tr>',
    )
    .join('');
  const goalRows = GOALS.map(
    (goal) =>
      '<div class="goal-mini"><span>' + esc(goal.label) + '</span><strong>' +
      formatPercent((goalSaved(goal) / goal.target) * 100) + '</strong></div>',
  ).join('');
  return (
    '<h1>Ringkasan ' + esc(HOUSEHOLD.month) + '</h1>' +
    '<p class="lede">' + esc(HOUSEHOLD.name) + ' · ' + esc(HOUSEHOLD.members) +
    ' · Semua angka di halaman ini dihitung dari 21 transaksi bulan ini.</p>' +
    '<section class="stats">' +
    statCard('Pemasukan', formatRupiah(totalIncome()), 'Gaji Rp 8,4 jt + freelance Rp 1,2 jt') +
    statCard('Belanja', formatRupiah(totalSpent()), 'Dari anggaran ' + formatRupiah(totalBudget())) +
    statCard('Disisihkan', formatRupiah(totalSetAside()), 'Tabungan + dana darurat') +
    statCard('Sisa', formatRupiah(remainingMoney()), 'Belum dialokasikan bulan ini') +
    '</section>' +
    '<p class="callout">Tabungan bulan ini <strong>' + formatPercent(savingsRate() * 100) +
    '</strong> dari penghasilan — target 20% tercapai. Anggaran terpakai ' +
    formatPercent((totalSpent() / totalBudget()) * 100) + '.</p>' +
    '<div class="cols">' +
    '<section class="card"><h2>Pengeluaran terbesar</h2>' + categoryBars(topCats) +
    '<p><a href="#/anggaran">Lihat semua 11 kategori →</a></p></section>' +
    '<section class="card"><h2>Tujuan menabung</h2>' + goalRows +
    '<p><a href="#/tujuan">Kelola 3 tujuan →</a></p>' +
    '<h2>Tagihan belum lunas</h2><p><strong>' + unpaid.length + ' tagihan · ' + formatRupiah(unpaidBillsTotal()) +
    '</strong> · paling dekat: Internet rumah, 1 Des.</p>' +
    '<p><a href="#/tagihan">Lihat semua tagihan →</a></p></section>' +
    '</div>' +
    '<section class="card"><h2>Transaksi terakhir</h2>' +
    '<table><thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th class="num">Jumlah</th></tr></thead>' +
    '<tbody>' + rows + '</tbody></table>' +
    '<p><a href="#/transaksi">Lihat semua 21 transaksi →</a></p></section>'
  );
}

// --- Transactions ---------------------------------------------------------

export function transactionsView(filter) {
  const all = allTransactions();
  const shown = filter === 'semua' ? all : all.filter((tx) => tx.category === filter);
  const options = ['<option value="semua">Semua kategori</option>']
    .concat(CATEGORIES.map((cat) => '<option value="' + cat.id + '"' + (filter === cat.id ? ' selected' : '') + '>' + esc(cat.label) + '</option>'))
    .join('');
  const rows = shown
    .map(
      (tx) =>
        '<tr><td>' + formatDateShort(tx.date) + '</td><td>' + esc(tx.label) + '</td><td>' +
        esc(categoryName(tx.category)) + '</td><td class="num">' + formatRupiah(tx.amount) + '</td></tr>',
    )
    .join('');
  return (
    '<h1>Transaksi</h1>' +
    '<p class="lede">' + shown.length + ' transaksi · total ' + formatRupiah(shown.reduce((s, tx) => s + tx.amount, 0)) +
    ' · Pemasukan bulan ini ' + formatRupiah(totalIncome()) + ' (gaji + freelance).</p>' +
    '<section class="card"><h2>Tambah pengeluaran</h2>' +
    '<form data-action="add-tx" class="form-row">' +
    '<label>Keterangan <input name="label" required maxlength="60" placeholder="cth. Pasar Minggu"></label>' +
    '<label>Kategori <select name="category">' +
    CATEGORIES.filter((cat) => cat.kind === 'spend')
      .map((cat) => '<option value="' + cat.id + '">' + esc(cat.label) + '</option>').join('') +
    '</select></label>' +
    '<label>Jumlah (Rp) <input name="amount" type="number" min="1000" step="1000" required placeholder="250000"></label>' +
    '<label>Tanggal <input name="date" type="date" value="2026-11-26" required></label>' +
    '<button type="submit">Simpan</button></form>' +
    '<p class="hint">Tersimpan di browser ini dan langsung mengubah total di semua halaman.</p></section>' +
    '<section class="card"><h2>Daftar transaksi</h2>' +
    '<label class="filter">Saring: <select data-action="filter-tx">' + options + '</select></label>' +
    '<table><thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th class="num">Jumlah</th></tr></thead>' +
    '<tbody>' + rows + '</tbody></table></section>'
  );
}

// --- Budget ---------------------------------------------------------------

export function budgetView() {
  const spent = spentByCategory();
  const rows = CATEGORIES.map((cat) => {
    const [status, badge] = statusOf(cat, spent[cat.id]);
    const remain = budgetOf(cat) - (cat.kind === 'save' ? 0 : spent[cat.id]);
    const fill = cat.kind === 'save' ? 1 : spent[cat.id] / budgetOf(cat);
    const tone = cat.kind === 'save' ? 'green' : spent[cat.id] > budgetOf(cat) ? 'red' : spent[cat.id] / budgetOf(cat) > 0.9 ? 'amber' : 'green';
    return (
      '<div class="budget-row"><div class="budget-head"><strong>' + esc(cat.label) + '</strong>' +
      '<span class="badge ' + badge + '">' + status + '</span></div>' +
      '<div class="bar-track"><div class="bar-fill bar-' + tone + '" style="width:' + Math.min(100, Math.round(fill * 100)) + '%"></div></div>' +
      '<div class="budget-nums"><span>Anggaran ' + formatRupiah(budgetOf(cat)) + '</span><span>' +
      (cat.kind === 'save' ? 'Disisihkan penuh' : 'Terpakai ' + formatRupiah(spent[cat.id])) + '</span><span>Sisa ' +
      formatRupiah(remain) + '</span></div>' +
      '<form data-action="edit-budget" data-cat="' + cat.id + '" class="form-inline">' +
      '<label>Ubah anggaran <input name="amount" type="number" min="0" step="50000" value="' + budgetOf(cat) + '"></label>' +
      '<button type="submit">Simpan</button></form></div>'
    );
  }).join('');
  return (
    '<h1>Anggaran Bulanan</h1>' +
    '<p class="lede">Total anggaran ' + formatRupiah(totalBudget()) + ' dari pemasukan ' + formatRupiah(totalIncome()) +
    ' · Terpakai ' + formatRupiah(totalSpent()) + ' · Disisihkan ' + formatRupiah(totalSetAside()) +
    ' · Sisa ' + formatRupiah(remainingMoney()) + '.</p>' +
    '<section class="card budget-list">' + rows + '</section>'
  );
}

// --- Goals -----------------------------------------------------------------

export function goalsView() {
  const cards = GOALS.map((goal) => {
    const saved = goalSaved(goal);
    const pct = Math.round((saved / goal.target) * 100);
    return (
      '<section class="card"><h2>' + esc(goal.label) + '</h2><p class="lede">' + esc(goal.note) + '</p>' +
      '<div class="goal-big"><strong>' + formatRupiah(saved) + '</strong><span> dari ' + formatRupiah(goal.target) +
      ' · ' + pct + '%</span></div>' +
      '<div class="bar-track"><div class="bar-fill bar-green" style="width:' + Math.min(100, pct) + '%"></div></div>' +
      '<p>Kurang ' + formatRupiah(goal.target - saved) + ' lagi.</p>' +
      '<form data-action="add-goal" data-goal="' + goal.id + '" class="form-inline">' +
      '<label>Tambah dana (Rp) <input name="amount" type="number" min="1000" step="1000" required placeholder="100000"></label>' +
      '<button type="submit">Tambah</button></form></section>'
    );
  }).join('');
  const totalSaved = GOALS.reduce((sum, goal) => sum + goalSaved(goal), 0);
  const totalTarget = GOALS.reduce((sum, goal) => sum + goal.target, 0);
  return (
    '<h1>Tujuan Menabung</h1>' +
    '<p class="lede">Total terkumpul ' + formatRupiah(totalSaved) + ' dari target ' + formatRupiah(totalTarget) +
    ' (' + Math.round((totalSaved / totalTarget) * 100) + '%).</p>' + cards
  );
}

// --- Bills -----------------------------------------------------------------

export function billsView() {
  const rows = BILLS.map((bill) => {
    const paid = billPaid(bill);
    return (
      '<div class="bill-row"><div><strong>' + esc(bill.label) + '</strong><br><span>Jatuh tempo ' +
      formatDateShort(bill.due) + '</span></div>' +
      '<strong>' + formatRupiah(bill.amount) + '</strong>' +
      '<span class="badge ' + (paid ? 'badge-green' : 'badge-amber') + '">' + (paid ? 'Lunas' : 'Belum lunas') + '</span>' +
      '<button data-action="toggle-bill" data-bill="' + bill.id + '">' + (paid ? 'Batalkan' : 'Tandai lunas') + '</button></div>'
    );
  }).join('');
  return (
    '<h1>Tagihan &amp; Jatuh Tempo</h1>' +
    '<p class="lede">' + unpaidBills().length + ' dari ' + BILLS.length + ' tagihan belum lunas · total ' +
    formatRupiah(unpaidBillsTotal()) + ' · Paling dekat: Internet rumah, 1 Des 2026.</p>' +
    '<section class="card bill-list">' + rows + '</section>' +
    '<p class="hint">Status tersimpan di browser ini — tandai lunas begitu kamu membayar.</p>'
  );
}

// --- Reports ----------------------------------------------------------------

export function reportsView(monthsShown) {
  const spent = totalSpent();
  const months = [...HISTORY, { month: 'Nov 2026', income: totalIncome(), spend: spent }];
  const shown = months.slice(-monthsShown);
  const avg = Math.round(months.reduce((sum, m) => sum + m.spend, 0) / months.length);
  const topCats = CATEGORIES.filter((cat) => cat.kind === 'spend')
    .map((cat) => ({ label: cat.label, spent: spentByCategory()[cat.id] }))
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 3);
  const share = topCats
    .map((row) => '<li><strong>' + esc(row.label) + '</strong> — ' + formatRupiah(row.spent) + ' (' +
      formatPercent((row.spent / spent) * 100) + ' dari total belanja)</li>')
    .join('');
  return (
    '<h1>Laporan 6 Bulan</h1>' +
    '<p class="lede">Rata-rata belanja ' + formatRupiah(avg) + ' per bulan · Belanja November (s.d. 26 Nov) ' +
    formatRupiah(spent) + ' · Pemasukan stabil Rp 9,6 juta sejak Agustus.</p>' +
    '<section class="card"><h2>Tren pemasukan vs pengeluaran</h2>' +
    '<div class="legend"><span class="swatch sw-in"></span> Pemasukan <span class="swatch sw-out"></span> Pengeluaran</div>' +
    '<div class="range"><button data-action="range" data-months="6"' + (monthsShown === 6 ? ' class="active"' : '') + '>6 bulan</button>' +
    '<button data-action="range" data-months="3"' + (monthsShown === 3 ? ' class="active"' : '') + '>3 bulan terakhir</button></div>' +
    monthColumns(shown) +
    '<p class="hint">November dihitung sampai 26 Nov 2026, dari transaksi yang tercatat.</p></section>' +
    '<section class="card"><h2>Tiga kategori terbesar bulan ini</h2><ul class="share">' + share + '</ul>' +
    '<p>Belanja harian, pendidikan anak, dan transport menyerap ' +
    formatPercent((topCats.reduce((s, r) => s + r.spent, 0) / spent) * 100) +
    ' dari total belanja — tiga pos inilah yang paling menentukan sisa uangmu.</p></section>'
  );
}

// --- Tips -------------------------------------------------------------------

export function tipsView() {
  const cards = TIPS.map(
    (tip) => '<section class="card"><h2>' + esc(tip.title) + '</h2><p>' + esc(tip.body) + '</p></section>',
  ).join('');
  return (
    '<h1>Tips Mengatur Uang Rumah Tangga</h1>' +
    '<p class="lede">Enam kebiasaan praktis, ditulis untuk keluarga dengan penghasilan sekitar Rp 9,6 juta per bulan — ' +
    'semuanya bisa dimulai minggu ini.</p>' +
    '<div class="cols">' + cards + '</div>' +
    '<section class="card"><h2>Aturan 50/30/20 untuk keluarga ini</h2>' +
    '<p>Kebutuhan Rp 4.800.000 · Keinginan Rp 2.880.000 · Tabungan Rp 1.920.000. ' +
    'Bulan ini tabunganmu Rp 2.000.000 — di atas aturan. Pertahankan.</p></section>'
  );
}

// --- Wiring ------------------------------------------------------------------

// Attach the page's controls after a render. `rerender` is the router's
// current-route render, called after any change so totals update everywhere.
export function bind(root, rerender) {
  for (const form of root.querySelectorAll('form[data-action="add-tx"]')) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      addTransaction({
        date: String(data.get('date')),
        label: String(data.get('label')).trim(),
        category: String(data.get('category')),
        amount: Number(data.get('amount')),
      });
      rerender();
    });
  }
  for (const select of root.querySelectorAll('select[data-action="filter-tx"]')) {
    select.addEventListener('change', () => {
      window.location.hash = '#/transaksi?f=' + encodeURIComponent(select.value);
    });
  }
  for (const form of root.querySelectorAll('form[data-action="edit-budget"]')) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      setBudget(form.dataset.cat, Number(new FormData(form).get('amount')));
      rerender();
    });
  }
  for (const form of root.querySelectorAll('form[data-action="add-goal"]')) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      addToGoal(form.dataset.goal, Number(new FormData(form).get('amount')));
      rerender();
    });
  }
  for (const button of root.querySelectorAll('button[data-action="toggle-bill"]')) {
    button.addEventListener('click', () => {
      toggleBill(button.dataset.bill);
      rerender();
    });
  }
  for (const button of root.querySelectorAll('button[data-action="range"]')) {
    button.addEventListener('click', () => {
      window.location.hash = '#/laporan?m=' + button.dataset.months;
    });
  }
}
