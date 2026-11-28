// Money maths for RumahRapi: formatting and every total the site shows.
// Nothing on any page types a total in by hand; each one is summed here from
// the transaction rows, so an added or deleted transaction moves every
// figure that depends on it — the dashboard cards, the budget bars, the
// category chart and the add-transaction confirmation line.

// Rp 13475000 -> "Rp 13.475.000", the way Indonesian households write it.
export function rupiah(amount) {
  const sign = amount < 0 ? '-' : '';
  const digits = String(Math.abs(Math.round(amount))).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${sign}Rp ${digits}`;
}

// Short form for tight spaces: Rp 13,5 jt.
export function rupiahShort(amount) {
  if (Math.abs(amount) >= 1000000) {
    const millions = amount / 1000000;
    const text = Number.isInteger(millions) ? String(millions) : millions.toFixed(1).replace('.', ',');
    return `Rp ${text} jt`;
  }
  return rupiah(amount);
}

export function sumIncome(rows) {
  return rows.filter((r) => r.kind === 'income').reduce((sum, r) => sum + r.amount, 0);
}

export function sumSpent(rows) {
  return rows.filter((r) => r.kind === 'expense').reduce((sum, r) => sum + r.amount, 0);
}

export function sumByCategory(rows, category) {
  return rows
    .filter((r) => r.kind === 'expense' && r.category === category)
    .reduce((sum, r) => sum + r.amount, 0);
}

// The month in one object: income, spent, what is left, and the share of
// income the household kept. November's seed data gives 18.500.000 in,
// 13.475.000 out, 5.025.000 left, a 27% savings rate.
export function monthTotals(rows) {
  const income = sumIncome(rows);
  const spent = sumSpent(rows);
  const left = income - spent;
  const savedRate = income > 0 ? Math.round((left / income) * 100) : 0;
  return { income, spent, left, savedRate };
}

// One line per budget category: planned, spent, what is left, and the share
// of the plan used. Sorted biggest spend first, so the busiest categories
// sit at the top of the dashboard chart.
export function budgetLines(rows, budgets) {
  return budgets
    .map((b) => {
      const spent = sumByCategory(rows, b.category);
      const remaining = b.planned - spent;
      const used = b.planned > 0 ? Math.round((spent / b.planned) * 100) : 0;
      return { ...b, spent, remaining, used, over: spent > b.planned };
    })
    .sort((a, b) => b.spent - a.spent);
}

// "3 Nov 2026" for a 2026-11-03 date. Short month names keep the table
// narrow on a phone.
export function shortDate(iso) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [year, month, day] = iso.split('-').map(Number);
  return `${day} ${months[month - 1]} ${year}`;
}
