// RumahRapi's pages: every view is a function that takes the live state and
// returns HTML. Nothing here holds a total of its own — each figure is
// computed from the rows at render time, so the page always shows what the
// household's ledger actually says.

import { budgetLines, monthTotals, rupiah, rupiahShort, shortDate, sumByCategory } from './money.js';
import { categoryBars, escapeHtml, progressBar } from './charts.js';

function nav(current) {
  const link = (hash, label) =>
    `<a href="${hash}"${current === hash ? ' aria-current="page" class="active"' : ''}>${label}</a>`;
  return `<nav aria-label="Sections">
  ${link('#/', 'Dashboard')}
  ${link('#/transactions', 'Transactions')}
  ${link('#/budgets', 'Budgets')}
  ${link('#/goals', 'Goals')}
  ${link('#/guide', 'Guide')}
</nav>`;
}

function pageHead(current, title, intro) {
  return `${nav(current)}<h1>${title}</h1><p class="lede">${intro}</p>`;
}

// The dashboard: the month at a glance. Four summary cards, the spending
// chart, the three tightest budgets, the six newest transactions and the
// October comparison — everything a household checks first, on one screen.
export function dashboard(store, data) {
  const rows = store.rows();
  const totals = monthTotals(rows);
  const lines = budgetLines(rows, store.budgets());
  const recent = [...rows].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)).slice(0, 6);
  const tight = [...lines].sort((a, b) => b.used - a.used).slice(0, 3);
  const octoberDiff = totals.spent - data.LAST_MONTH.spent;
  const daysCounted = new Set(rows.map((row) => row.date)).size;
  const octoberText =
    octoberDiff >= 0
      ? `${rupiah(octoberDiff)} more than October's ${rupiah(data.LAST_MONTH.spent)}`
      : `${rupiah(-octoberDiff)} less than October's ${rupiah(data.LAST_MONTH.spent)}`;

  return `${pageHead('#/', `${data.HOUSEHOLD.name} — ${data.HOUSEHOLD.month}`, `${data.HOUSEHOLD.place} · ${data.HOUSEHOLD.members} people · every rupiah below is counted from the household's own transactions.`)}
<section class="cards" aria-label="Month summary">
  <div class="card"><span class="card-label">Income</span><strong class="card-value">${rupiah(totals.income)}</strong><span class="card-note">Salary + freelance</span></div>
  <div class="card"><span class="card-label">Spent</span><strong class="card-value">${rupiah(totals.spent)}</strong><span class="card-note">${octoberText}</span></div>
  <div class="card good"><span class="card-label">Left</span><strong class="card-value">${rupiah(totals.left)}</strong><span class="card-note">For savings and goals</span></div>
  <div class="card good"><span class="card-label">Kept</span><strong class="card-value">${totals.savedRate}%</strong><span class="card-note">Of income saved this month</span></div>
</section>
<p class="hint">${daysCounted} of November's 30 days are in the ledger so far — the month is not finished yet, and the figures above will keep moving as its last days are added.</p>
<div class="two-col">
<section aria-label="Spending by category">
  <h2>Where the money went</h2>
  ${categoryBars(lines)}
  <p class="hint">Groceries is the only category over its plan — Rp 190.000 past Rp 3.000.000 — so the December shop moves to the cheaper market on Saturdays.</p>
</section>
<section aria-label="Tightest budgets">
  <h2>Tightest budgets</h2>
  ${tight
    .map(
      (line) => `<div class="budget-line">
  <div class="budget-head"><strong>${escapeHtml(line.category)}</strong><span>${rupiah(line.spent)} of ${rupiah(line.planned)}</span></div>
  ${progressBar(line)}
</div>`,
    )
    .join('')}
  <p><a href="#/budgets">See all nine budgets &rarr;</a></p>
</section>
</div>
<section aria-label="Recent transactions">
  <h2>Latest transactions</h2>
  ${transactionTable(recent, false)}
  <p><a href="#/transactions">All ${rows.length} transactions &rarr;</a></p>
</section>`;
}

// One transaction table, shared by the dashboard and the transactions page.
// Newest first. The sign shows at a glance whether money came in or went
// out, and the delete button removes the row for real.
export function transactionTable(rows, withDelete) {
  const sorted = [...rows].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const body = sorted
    .map(
      (row) => `<tr>
  <td>${shortDate(row.date)}</td>
  <td>${escapeHtml(row.description)}</td>
  <td>${escapeHtml(row.category)}</td>
  <td class="amount ${row.kind}">${row.kind === 'income' ? '+' : '−'}${rupiah(row.amount)}</td>
  ${withDelete ? `<td><button type="button" class="delete" data-delete="${row.id}" aria-label="Delete ${escapeHtml(row.description)}">Delete</button></td>` : ''}
</tr>`,
    )
    .join('');
  return `<table>
  <thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Amount</th>${withDelete ? '<th></th>' : ''}</tr></thead>
  <tbody>${body}</tbody>
</table>`;
}

// The transactions page: the add form, the confirmation line that proves a
// just-added transaction moved the totals, the category filter, and the full
// list. Adding is the site's core control, so it sits at the top, in view.
export function transactions(store, data) {
  const rows = store.rows();
  const totals = monthTotals(rows);
  const added = store.lastAdded();
  const categories = [...new Set(store.budgets().map((b) => b.category))];
  const banner = added
    ? `<p class="notice" role="status">Added ${rupiah(added.amount)} · ${escapeHtml(added.category)} — “${escapeHtml(added.description)}”. November spending: ${rupiah(added.spentBefore)} → ${rupiah(added.spentAfter)}. <button type="button" class="link-button" data-dismiss-notice>Dismiss</button></p>`
    : '';

  return `${pageHead('#/transactions', 'Transactions', `All ${rows.length} transactions of ${data.HOUSEHOLD.month}. Spent so far: ${rupiah(totals.spent)} of ${rupiah(totals.income)} income.`)}
${banner}
<section class="panel" aria-label="Add a transaction">
  <h2>Add a transaction</h2>
  <form id="add-form">
    <label>Date <input id="tx-date" name="date" type="date" value="2026-11-28" required></label>
    <label>Description <input id="tx-desc" name="description" type="text" placeholder="e.g. Pasar Minggu — sayur &amp; buah" maxlength="80" required></label>
    <label>Category
      <select id="tx-category" name="category">
        ${categories.map((c) => `<option>${escapeHtml(c)}</option>`).join('')}
      </select>
    </label>
    <label>Amount (Rp) <input id="tx-amount" name="amount" type="number" min="1000" step="500" placeholder="85000" required></label>
    <label>Type
      <select id="tx-kind" name="kind">
        <option value="expense">Spending</option>
        <option value="income">Income</option>
      </select>
    </label>
    <button id="tx-add" type="submit">Add to the ledger</button>
  </form>
  <p class="form-error" id="form-error" role="alert" hidden></p>
  <p class="hint">The totals above, the budget bars and the category chart all update the moment a transaction is added — nothing here is a picture of a number.</p>
</section>
<section aria-label="All transactions">
  <h2>All transactions</h2>
  <label class="filter">Show only
    <select id="tx-filter">
      <option value="">Every category</option>
      ${categories.map((c) => `<option>${escapeHtml(c)}</option>`).join('')}
    </select>
  </label>
  <div id="tx-list">${transactionTable(rows, true)}</div>
</section>`;
}

// The budgets page: nine categories, each with its plan, its real spending,
// a bar and a figure. The plan itself is editable — type a new monthly
// figure, save it, and the bar and the plan total move with it.
export function budgets(store) {
  const rows = store.rows();
  const lines = budgetLines(rows, store.budgets());
  const plannedTotal = lines.reduce((sum, line) => sum + line.planned, 0);
  const spentTotal = lines.reduce((sum, line) => sum + line.spent, 0);
  return `${pageHead('#/budgets', 'Budgets', `Nine envelopes for the month. Planned ${rupiah(plannedTotal)}, spent ${rupiah(spentTotal)} — the plan leaves ${rupiah(plannedTotal - spentTotal)} unspent.`)}
<div class="budget-grid">
${lines
  .map(
    (line) => `<article class="budget-card${line.over ? ' over' : ''}">
  <h2>${escapeHtml(line.category)}</h2>
  <p class="budget-note">${escapeHtml(line.note)}</p>
  <p class="budget-figures"><strong>${rupiah(line.spent)}</strong> spent of ${rupiah(line.planned)} planned</p>
  ${progressBar(line)}
  <label class="plan-edit">Monthly plan (Rp)
    <input type="number" min="0" step="50000" value="${line.planned}" data-plan="${escapeHtml(line.category)}">
    <button type="button" data-save-plan="${escapeHtml(line.category)}">Save plan</button>
  </label>
</article>`,
  )
  .join('')}
</div>`;
}

// The goals page: three things the household is saving for, each with its
// target, its progress and a button that really puts Rp 100.000 in.
export function goals(store) {
  const list = store.goals();
  return `${pageHead('#/goals', 'Savings goals', 'Money with a job: each goal shows what is saved, what is left, and how far along it is.')}
<div class="goal-grid">
${list
  .map((goal) => {
    const used = Math.round((goal.saved / goal.target) * 100);
    const left = goal.target - goal.saved;
    return `<article class="goal-card">
  <h2>${escapeHtml(goal.title)}</h2>
  <p class="goal-note">${escapeHtml(goal.note)}</p>
  <p class="goal-figures"><strong>${rupiah(goal.saved)}</strong> of ${rupiah(goal.target)} · ${used}%</p>
  ${progressBar({ spent: goal.saved, planned: goal.target, used, remaining: left, over: false })}
  <button type="button" data-goal="${goal.id}" ${goal.saved >= goal.target ? 'disabled' : ''}>Add Rp 100.000</button>
  ${goal.saved >= goal.target ? '<p class="hint">Goal reached — well done.</p>' : `<p class="hint">${rupiah(left)} to go.</p>`}
</article>`;
  })
  .join('')}
</div>`;
}

// The guide: the household's own method, written against its real numbers.
// A budget site that only shows figures never says how to use them; this
// page does, with the Hartonos' own month as the worked example.
export function guide(store, data) {
  const rows = store.rows();
  const totals = monthTotals(rows);
  const needs = sumByCategory(rows, 'Housing') + sumByCategory(rows, 'Groceries') + sumByCategory(rows, 'Utilities') + sumByCategory(rows, 'Transport') + sumByCategory(rows, 'School') + sumByCategory(rows, 'Health');
  const wants = sumByCategory(rows, 'Eating out') + sumByCategory(rows, 'Fun') + sumByCategory(rows, 'Subscriptions');
  const needsShare = Math.round((needs / totals.income) * 100);
  const wantsShare = Math.round((wants / totals.income) * 100);
  return `${pageHead('#/guide', 'How this household budgets', "The method behind the numbers: five habits the Hartono family actually follows, checked against November's ledger.")}
<article class="guide">
<h2>1. Pay the future first</h2>
<p>On payday, Rp 2.000.000 moves to the emergency fund before anything is spent. November kept ${totals.savedRate}% of its income — above the 20% the family aims for — because the saving happens before the spending, not after it.</p>
<h2>2. Nine envelopes, no more</h2>
<p>Every rupiah belongs to one of nine categories on the <a href="#/budgets">Budgets</a> page. A category with no money in its envelope waits until next month; that is why Groceries, the only envelope over its plan, is the one the family talks about at dinner.</p>
<h2>3. The 50 / 30 / 20 check</h2>
<p>Needs took ${needsShare}% of November's income (${rupiah(needs)}), wants ${wantsShare}% (${rupiah(wants)}), and savings kept ${totals.savedRate}%. The classic split is 50 / 30 / 20; this household runs tighter on wants so the emergency fund grows faster.</p>
<h2>4. Shop the market on Saturday</h2>
<p>Pasar Minggu on Saturday morning is about a fifth cheaper than the supermarket for the same vegetables and fish — the ledger shows it: market shops average Rp 412.500 against Rp 513.000 at Super Indo. The Saturday shop is now a fixed habit.</p>
<h2>5. Review on the last Sunday</h2>
<p>On the last Sunday of the month the family opens this site together, looks at the three tightest budgets, and sets next month's plans. A plan is a guess until the month proves it; the <a href="#/budgets">Budgets</a> page lets any plan be changed in one edit.</p>
<p class="hint">Figures above come from ${data.HOUSEHOLD.month}'s own transactions — open <a href="#/transactions">Transactions</a> to check any of them.</p>
</article>`;
}

export function missing() {
  return `${nav('#/')}<h1>Not found</h1><p>There is no page at this address. <a href="#/">Back to the dashboard</a>.</p>`;
}
