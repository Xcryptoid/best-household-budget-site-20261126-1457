// Runtime state for RumahRapi: what the household changes in the browser.
// The static figures in data.js never move; the household's own edits
// (added transactions, paid bills, changed budgets, goal deposits) live in
// localStorage, so they survive a reload and never touch the network.
// Every total the site shows is derived here from data + edits, so no
// page can disagree with another.

import { BILLS, CATEGORIES, GOALS, INCOME, TRANSACTIONS } from './data.js';

const KEY = 'rumahrapi-v1';

function readSaved() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? {};
  } catch {
    return {};
  }
}

function writeSaved(saved) {
  try {
    localStorage.setItem(KEY, JSON.stringify(saved));
  } catch {
    // Private mode or no storage: the site still works in memory.
  }
}

const saved = readSaved();
saved.addedTx = saved.addedTx ?? [];
saved.paidBills = saved.paidBills ?? {};
saved.budgetEdits = saved.budgetEdits ?? {};
saved.goalAdds = saved.goalAdds ?? {};

export function allTransactions() {
  return [...TRANSACTIONS, ...saved.addedTx].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function addTransaction(tx) {
  saved.addedTx.push({ ...tx, id: 'u' + Date.now() });
  writeSaved(saved);
}

export function totalIncome() {
  return INCOME.reduce((sum, row) => sum + row.amount, 0);
}

export function spentByCategory() {
  const spent = {};
  for (const cat of CATEGORIES) spent[cat.id] = 0;
  for (const tx of allTransactions()) {
    if (spent[tx.category] !== undefined) spent[tx.category] += tx.amount;
  }
  return spent;
}

export function totalSpent() {
  return Object.values(spentByCategory()).reduce((sum, n) => sum + n, 0);
}

export function budgetOf(cat) {
  return saved.budgetEdits[cat.id] ?? cat.budget;
}

export function setBudget(categoryId, amount) {
  saved.budgetEdits[categoryId] = amount;
  writeSaved(saved);
}

export function totalBudget() {
  return CATEGORIES.reduce((sum, cat) => sum + budgetOf(cat), 0);
}

// Money set aside this month (the "save" categories), not spent.
export function totalSetAside() {
  return CATEGORIES.filter((cat) => cat.kind === 'save').reduce((sum, cat) => sum + budgetOf(cat), 0);
}

export function remainingMoney() {
  return totalIncome() - totalSpent() - totalSetAside();
}

export function savingsRate() {
  return totalSetAside() / totalIncome();
}

export function goalSaved(goal) {
  const extra = (saved.goalAdds[goal.id] ?? []).reduce((sum, n) => sum + n, 0);
  return goal.saved + extra;
}

export function addToGoal(goalId, amount) {
  saved.goalAdds[goalId] = [...(saved.goalAdds[goalId] ?? []), amount];
  writeSaved(saved);
}

export function billPaid(bill) {
  return saved.paidBills[bill.id] ?? bill.paid;
}

export function toggleBill(billId) {
  const bill = BILLS.find((row) => row.id === billId);
  if (!bill) return;
  saved.paidBills[billId] = !billPaid(bill);
  writeSaved(saved);
}

export function unpaidBills() {
  return BILLS.filter((bill) => !billPaid(bill));
}

export function unpaidBillsTotal() {
  return unpaidBills().reduce((sum, bill) => sum + bill.amount, 0);
}
