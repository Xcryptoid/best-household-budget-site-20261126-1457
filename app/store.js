// RumahRapi's state: the ledger the household actually edits.
// The seed rows come from data.js; every change after that — an added
// transaction, a deleted row, a goal contribution, a changed budget plan —
// lives here, is saved to localStorage when the browser allows it, and is
// read back on the next visit. If storage is refused (a private window, a
// locked-down host) the site still works for the visit, in memory only.

import { BUDGETS, GOALS, TRANSACTIONS } from './data.js';

const STORAGE_KEY = 'rumahrapi-november-2026';

// A plain copy of the seed, so the module's own edits never touch data.js.
function freshState() {
  return {
    transactions: TRANSACTIONS.map((row) => ({ ...row })),
    budgets: BUDGETS.map((row) => ({ ...row })),
    goals: GOALS.map((row) => ({ ...row })),
    lastAdded: null,
  };
}

function loadSaved() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (!Array.isArray(saved.transactions) || !Array.isArray(saved.budgets) || !Array.isArray(saved.goals)) return null;
    return saved;
  } catch {
    return null;
  }
}

function persist(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage refused: the visit keeps working in memory, nothing breaks.
  }
}

export const store = {
  state: loadSaved() ?? freshState(),

  rows() {
    return this.state.transactions;
  },

  budgets() {
    return this.state.budgets;
  },

  goals() {
    return this.state.goals;
  },

  lastAdded() {
    return this.state.lastAdded;
  },

  // Add one transaction and remember what the month's spending was before
  // it, so the confirmation line can show the old total and the new one
  // side by side: the proof that the totals really moved.
  addTransaction({ date, description, category, amount, kind }) {
    const before = this.state.transactions
      .filter((r) => r.kind === 'expense')
      .reduce((sum, r) => sum + r.amount, 0);
    const row = {
      id: `u${Date.now().toString(36)}`,
      date,
      kind,
      category,
      description: description.trim(),
      amount,
    };
    this.state.transactions.push(row);
    const after = before + (kind === 'expense' ? amount : 0);
    this.state.lastAdded = { ...row, spentBefore: before, spentAfter: after };
    persist(this.state);
    return row;
  },

  deleteTransaction(id) {
    this.state.transactions = this.state.transactions.filter((r) => r.id !== id);
    if (this.state.lastAdded && this.state.lastAdded.id === id) this.state.lastAdded = null;
    persist(this.state);
  },

  // Put Rp 100.000 into a savings goal. The goal's bar and percentage move
  // with it, and the button stays honest: it never lets a goal pass its target.
  addToGoal(id, amount) {
    const goal = this.state.goals.find((g) => g.id === id);
    if (!goal) return null;
    goal.saved = Math.min(goal.target, goal.saved + amount);
    persist(this.state);
    return goal;
  },

  // Change what a category is planned to cost this month. The budget bars
  // and the plan total re-compute from the new figure at once.
  setPlan(category, planned) {
    const budget = this.state.budgets.find((b) => b.category === category);
    if (!budget) return null;
    budget.planned = Math.max(0, Math.round(planned));
    persist(this.state);
    return budget;
  },

  clearLastAdded() {
    this.state.lastAdded = null;
    persist(this.state);
  },
};
