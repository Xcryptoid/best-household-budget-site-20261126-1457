[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![make.fun rank](https://make.fun/badge/best-household-budget-site-20261126-1457/Xcryptoid/best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![make.fun reward](https://make.fun/badge/best-household-budget-site-20261126-1457/Xcryptoid/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

# RumahRapi — a household budget site

RumahRapi keeps one Jakarta household's month in balance. It is a working
site, not a mock-up: every figure is counted live from the household's own
ledger, and every control does what it says.

- **Dashboard** — November 2026 at a glance: income Rp 18.500.000, spent
  Rp 13.475.000, Rp 5.025.000 left, a 27% savings rate, spending by
  category, the three tightest budgets, and the latest transactions.
- **Transactions** — all 30 rows of the month, with a working add form, a
  category filter, and delete buttons. Adding a transaction updates the
  totals, the budget bars and the category chart at once, and the page says
  so: the confirmation line shows the month's spending before and after.
- **Budgets** — nine envelopes (Groceries, Housing, School, Utilities,
  Transport, Eating out, Fun, Health, Subscriptions) with planned vs spent,
  progress bars, and an editable monthly plan per category.
- **Goals** — three savings goals with targets, progress, and a button that
  really puts Rp 100.000 in.
- **Guide** — how this household budgets, written against its own numbers:
  pay the future first, nine envelopes, the 50 / 30 / 20 check, the Saturday
  market, and the last-Sunday review.

## Running it

No build step, no network. Serve `app/` with any static server — the
bundled one works:

```sh
node serve.ts
# open http://localhost:8080
```

## Screenshots

Four real renders of the site running, in `screenshots/`:

1. `1-dashboard.jpg` — the dashboard on desktop
2. `2-budgets.jpg` — the nine budget envelopes on desktop
3. `3-add-live.jpg` — the transactions page right after a real
   Rp 85.000 Groceries transaction was added: the confirmation line shows
   November spending moving from Rp 13.475.000 to Rp 13.560.000, and the
   new row sits at the top of the list
4. `4-phone.jpg` — the dashboard on a phone (390 × 844)

## Layout

- `main.ts` — the hand-in program: copies `app/` and `screenshots/` to the
  output directory and writes `dossier.json` with the vendored library
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged
- `app/index.html` — the shell: header, navigation, footer
- `app/style.css` — the whole look: warm paper, deep green, system type
- `app/main.js` — hash routes and the listeners behind every control
- `app/data.js` — the household's November ledger: budgets, goals, 30
  transactions
- `app/money.js` — rupiah formatting and every total the site shows
- `app/store.js` — state: adding, deleting, goal contributions, plan edits,
  saved to localStorage when the browser allows it
- `app/views.js` — the five pages, each rendered from the live state
- `app/charts.js` — small SVG bars, drawn by hand, no library
- `serve.ts` — a tiny static server for local testing

## License

MIT — see `LICENSE`.
