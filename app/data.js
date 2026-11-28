// RumahRapi's household ledger: one family's November 2026, in rupiah.
// Every total the site shows is computed from these rows (see money.js), so
// the figures on the dashboard, the budget bars and the transaction list can
// never disagree with each other. Amounts are whole rupiah, no cents.

export const HOUSEHOLD = {
  name: 'Keluarga Hartono',
  place: 'Jakarta Selatan',
  month: 'November 2026',
  members: 4,
  currency: 'IDR',
};

// What the household planned to spend per category this month. The plan
// totals Rp 14.450.000 against Rp 18.500.000 of income, so the month is
// planned to end Rp 4.050.000 ahead.
export const BUDGETS = [
  { category: 'Groceries', planned: 3000000, note: 'Pasar Minggu + Super Indo, weekly shop' },
  { category: 'Housing', planned: 4000000, note: 'House rent, paid on the 1st' },
  { category: 'School', planned: 2000000, note: 'SPP + books for two children' },
  { category: 'Utilities', planned: 1500000, note: 'Electricity, water, internet' },
  { category: 'Transport', planned: 1200000, note: 'Fuel, tolls, rides to school' },
  { category: 'Eating out', planned: 1000000, note: 'One family meal out a week' },
  { category: 'Fun', planned: 800000, note: 'Cinema, toys, weekend outings' },
  { category: 'Health', planned: 600000, note: 'Pharmacy and check-ups' },
  { category: 'Subscriptions', planned: 350000, note: 'Streaming, music, cloud storage' },
];

// What the household is saving for. "Saved" moves when the +Rp 100.000
// button on the Goals page is pressed; the bar and the percentage follow it.
export const GOALS = [
  { id: 'emergency', title: 'Dana darurat', target: 20000000, saved: 12500000, note: 'Six months of essentials, kept in a separate account' },
  { id: 'holiday', title: 'Liburan keluarga — Yogyakarta', target: 6000000, saved: 4200000, note: 'Train tickets, three nights, Borobudur at sunrise' },
  { id: 'laptop', title: 'Laptop baru — Ayah', target: 12000000, saved: 3800000, note: 'The old one is eight years old and holds on by a fan' },
];

// Last month, for the dashboard's comparison line.
export const LAST_MONTH = { month: 'October 2026', income: 18500000, spent: 12980000 };

// Every transaction of the month, newest last in this file; the site lists
// them newest first. Two rows are income, the rest are spending. The sums
// work out to Rp 18.500.000 in and Rp 13.475.000 out, leaving Rp 5.025.000.
export const TRANSACTIONS = [
  { id: 't01', date: '2026-11-01', kind: 'income', category: 'Income', description: 'Gaji — PT Nusantara Digital', amount: 15000000 },
  { id: 't02', date: '2026-11-01', kind: 'expense', category: 'Housing', description: 'Sewa rumah — November', amount: 4000000 },
  { id: 't03', date: '2026-11-02', kind: 'expense', category: 'Groceries', description: 'Pasar Minggu — sayur, ayam, telur', amount: 420000 },
  { id: 't04', date: '2026-11-02', kind: 'expense', category: 'Transport', description: 'Bensin — Pertamina', amount: 250000 },
  { id: 't05', date: '2026-11-03', kind: 'expense', category: 'Eating out', description: 'Makan siang keluarga — warteg', amount: 145000 },
  { id: 't06', date: '2026-11-04', kind: 'expense', category: 'Utilities', description: 'Listrik PLN', amount: 685000 },
  { id: 't07', date: '2026-11-05', kind: 'expense', category: 'Groceries', description: 'Super Indo — belanja mingguan', amount: 512000 },
  { id: 't08', date: '2026-11-06', kind: 'expense', category: 'School', description: 'SPP anak — November', amount: 1750000 },
  { id: 't09', date: '2026-11-07', kind: 'expense', category: 'Transport', description: 'GoRide — antar anak sekolah', amount: 96000 },
  { id: 't10', date: '2026-11-08', kind: 'expense', category: 'Fun', description: 'Bioskop — keluarga, 4 tiket', amount: 220000 },
  { id: 't11', date: '2026-11-09', kind: 'expense', category: 'Groceries', description: 'Pasar Minggu — buah & ikan', amount: 385000 },
  { id: 't12', date: '2026-11-10', kind: 'expense', category: 'Subscriptions', description: 'Netflix + Spotify', amount: 215000 },
  { id: 't13', date: '2026-11-11', kind: 'expense', category: 'Eating out', description: 'GoFood — ayam geprek', amount: 128000 },
  { id: 't14', date: '2026-11-12', kind: 'expense', category: 'Health', description: 'Apotek — vitamin & obat flu', amount: 185000 },
  { id: 't15', date: '2026-11-13', kind: 'expense', category: 'Transport', description: 'Bensin — Pertamina', amount: 250000 },
  { id: 't16', date: '2026-11-14', kind: 'income', category: 'Income', description: 'Freelance desain — logo kafe', amount: 3500000 },
  { id: 't17', date: '2026-11-14', kind: 'expense', category: 'Groceries', description: 'Super Indo — belanja mingguan', amount: 498000 },
  { id: 't18', date: '2026-11-15', kind: 'expense', category: 'Utilities', description: 'Air PDAM', amount: 320000 },
  { id: 't19', date: '2026-11-16', kind: 'expense', category: 'Eating out', description: 'Makan malam — resto Sunda', amount: 310000 },
  { id: 't20', date: '2026-11-17', kind: 'expense', category: 'School', description: 'Buku & alat tulis', amount: 245000 },
  { id: 't21', date: '2026-11-18', kind: 'expense', category: 'Groceries', description: 'Pasar Minggu — sayur & daging', amount: 455000 },
  { id: 't22', date: '2026-11-19', kind: 'expense', category: 'Transport', description: 'Tol + parkir', amount: 180000 },
  { id: 't23', date: '2026-11-20', kind: 'expense', category: 'Fun', description: 'Mainan anak — toko mainan', amount: 150000 },
  { id: 't24', date: '2026-11-21', kind: 'expense', category: 'Groceries', description: 'Super Indo — belanja mingguan', amount: 530000 },
  { id: 't25', date: '2026-11-22', kind: 'expense', category: 'Health', description: 'Dokter gigi — kontrol', amount: 350000 },
  { id: 't26', date: '2026-11-23', kind: 'expense', category: 'Eating out', description: 'GoFood — soto & es teh', amount: 96000 },
  { id: 't27', date: '2026-11-24', kind: 'expense', category: 'Utilities', description: 'Internet IndiHome', amount: 415000 },
  { id: 't28', date: '2026-11-25', kind: 'expense', category: 'Groceries', description: 'Pasar Minggu — sayur & buah', amount: 390000 },
  { id: 't29', date: '2026-11-26', kind: 'expense', category: 'Transport', description: 'Bensin — Pertamina', amount: 250000 },
  { id: 't30', date: '2026-11-27', kind: 'expense', category: 'Subscriptions', description: 'iCloud 200 GB', amount: 45000 },
];
