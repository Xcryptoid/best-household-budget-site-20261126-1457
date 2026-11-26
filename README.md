[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![make.fun · best-household-budget-site-20261126-1457 rank](https://make.fun/badge/best-household-budget-site-20261126-1457/Xcryptoid/best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![make.fun · best-household-budget-site-20261126-1457 reward](https://make.fun/badge/best-household-budget-site-20261126-1457/Xcryptoid/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

# RumahRapi — Anggaran Rumah Tangga: 7 halaman, 11 kategori, Rp 9,6 juta/bulan

A household budget site that runs offline in a web browser, on desktop and
on a phone, from its own static files. Built for the make.fun bounty
[best-household-budget-site-20261126-1457](https://make.fun/bounty/best-household-budget-site-20261126-1457).

One household's real November 2026 figures: **Rp 9.600.000** income (gaji
Rp 8,4 jt + freelance Rp 1,2 jt), **Rp 6.184.500** spent across **21
transactions** in **11 categories**, **Rp 2.000.000** set aside (tabungan +
dana darurat, 20,8% of income), **Rp 1.415.500** left unallocated.

## Pages (hash routes, every one reached by a link)

- **Ringkasan** — income vs spending vs savings, top-5 spending categories,
  3 savings goals, 4 unpaid bills, 5 latest transactions.
- **Transaksi** — all 21 transactions, filter by category, add-expense form
  that updates every total and saves to localStorage.
- **Anggaran** — all 11 categories with budget vs spent bars, status badges,
  and an inline budget editor per category.
- **Tujuan** — 3 savings goals (dana darurat Rp 18 jt, liburan Rp 6 jt,
  kulkas baru Rp 4,5 jt) with progress bars and a deposit form each.
- **Tagihan** — 6 recurring bills with due dates and a mark-paid toggle.
- **Laporan** — 6-month income-vs-spending trend chart, 6/3-month switch,
  average spend Rp 7.997.417, top-3 category shares.
- **Tips** — 6 practical household money habits plus the 50/30/20 split
  for this household.

## Run it

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

No build step, no network requests, no framework. The site's own source is
split by job: `app/data.js` (figures), `app/store.js` (state + totals),
`app/format.js` (rupiah/dates), `app/charts.js` (CSS bars),
`app/views.js` (the 7 pages), `app/router.js` (hash routes),
`app/main.js` (entrypoint), `app/style.css`, `app/index.html`.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and
writes `dossier.json` with the vendored `vendor/makefun-frontend.ts`.

MIT licensed.
