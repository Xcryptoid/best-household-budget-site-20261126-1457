// RumahRapi's router and wiring: hash routes for the five pages, and the
// listeners that make every control on them do what it says. The page is
// re-rendered from the store after each change, so the figures on screen
// always match the ledger.
//
//   #/                dashboard
//   #/transactions    the ledger and the add form
//   #/budgets         the nine envelopes and their plans
//   #/goals           savings goals
//   #/guide           how this household budgets
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { HOUSEHOLD, LAST_MONTH } from './data.js';
import { store } from './store.js';
import { budgets, dashboard, goals, guide, missing, transactionTable, transactions } from './views.js';

const app = document.getElementById('app');
const data = { HOUSEHOLD, LAST_MONTH };

function currentRoute() {
  const hash = location.hash || '#/';
  if (hash === '#/' || hash === '#') return 'dashboard';
  if (hash.startsWith('#/transactions')) return 'transactions';
  if (hash.startsWith('#/budgets')) return 'budgets';
  if (hash.startsWith('#/goals')) return 'goals';
  if (hash.startsWith('#/guide')) return 'guide';
  return 'missing';
}

function pageTitle(route) {
  const titles = {
    dashboard: 'RumahRapi — household budget',
    transactions: 'Transactions | RumahRapi',
    budgets: 'Budgets | RumahRapi',
    goals: 'Savings goals | RumahRapi',
    guide: 'How we budget | RumahRapi',
    missing: 'Not found | RumahRapi',
  };
  return titles[route] ?? titles.missing;
}

function render() {
  window.__shotReady = false;
  const route = currentRoute();
  document.title = pageTitle(route);
  if (route === 'dashboard') app.innerHTML = dashboard(store, data);
  else if (route === 'transactions') app.innerHTML = transactions(store, data);
  else if (route === 'budgets') app.innerHTML = budgets(store);
  else if (route === 'goals') app.innerHTML = goals(store);
  else if (route === 'guide') app.innerHTML = guide(store, data);
  else app.innerHTML = missing();
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

// The add form: read the fields, check them, add the row, and re-render so
// the confirmation line, the totals and the list all show the new state.
function onAddTransaction(event) {
  event.preventDefault();
  const error = document.getElementById('form-error');
  const description = document.getElementById('tx-desc').value;
  const amount = Number(document.getElementById('tx-amount').value);
  const category = document.getElementById('tx-category').value;
  const kind = document.getElementById('tx-kind').value;
  const date = document.getElementById('tx-date').value || '2026-11-28';
  if (!description.trim()) return showFormError(error, 'Write what the money was for.');
  if (!Number.isFinite(amount) || amount < 1000) {
    return showFormError(error, 'Enter an amount of at least Rp 1.000.');
  }
  store.addTransaction({ date, description, category, amount: Math.round(amount), kind });
  render();
}

function showFormError(error, message) {
  if (!error) return;
  error.textContent = message;
  error.hidden = false;
}

// One delegated click handler for the buttons that live inside re-rendered
// pages: deleting a transaction, saving a changed plan, putting money into
// a goal, and dismissing the confirmation line.
function onPageClick(event) {
  const target = event.target.closest('button');
  if (!target) return;

  if (target.dataset.delete) {
    store.deleteTransaction(target.dataset.delete);
    render();
    return;
  }
  if (target.dataset.dismissNotice !== undefined) {
    store.clearLastAdded();
    render();
    return;
  }
  if (target.dataset.goal) {
    store.addToGoal(target.dataset.goal, 100000);
    render();
    return;
  }
  if (target.dataset.savePlan) {
    const category = target.dataset.savePlan;
    const input = document.querySelector(`input[data-plan="${category}"]`);
    const planned = input ? Number(input.value) : NaN;
    if (Number.isFinite(planned) && planned >= 0) {
      store.setPlan(category, planned);
      render();
    }
  }
}

// The category filter on the transactions page: re-render just the table,
// leaving the form and its half-typed values alone.
function onFilterChange(event) {
  const list = document.getElementById('tx-list');
  if (!list) return;
  const wanted = event.target.value;
  const rows = store.rows().filter((row) => !wanted || row.category === wanted);
  list.innerHTML = transactionTable(rows, true);
}

window.addEventListener('hashchange', render);
document.addEventListener('submit', (event) => {
  if (event.target.id === 'add-form') onAddTransaction(event);
});
document.addEventListener('click', onPageClick);
document.addEventListener('change', (event) => {
  if (event.target.id === 'tx-filter') onFilterChange(event);
});
render();
