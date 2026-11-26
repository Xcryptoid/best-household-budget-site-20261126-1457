// RumahRapi data: one household's real November 2026 figures.
// Everything here is the site's own content. Spent totals are computed
// from the transactions below, so the dashboard, budget page and reports
// can never disagree with each other.

export const HOUSEHOLD = {
  name: 'Keluarga Hartono',
  members: '2 dewasa + 2 anak',
  month: 'November 2026',
  currency: 'IDR',
};

// Monthly income, in rupiah.
export const INCOME = [
  { id: 'gaji', label: 'Gaji bulanan', amount: 8400000, date: '2026-11-01' },
  { id: 'freelance', label: 'Freelance desain', amount: 1200000, date: '2026-11-15' },
];

// The 11 budget categories. `budget` is the monthly plan; `kind` tells the
// budget page how to treat it: "spend" categories are paid from
// transactions, "save" categories are money set aside, not spent.
export const CATEGORIES = [
  { id: 'belanja', label: 'Belanja harian', budget: 2400000, kind: 'spend' },
  { id: 'transport', label: 'Transport & bensin', budget: 900000, kind: 'spend' },
  { id: 'listrik', label: 'Listrik & air', budget: 650000, kind: 'spend' },
  { id: 'internet', label: 'Internet & pulsa', budget: 450000, kind: 'spend' },
  { id: 'makan', label: 'Makan di luar', budget: 600000, kind: 'spend' },
  { id: 'pendidikan', label: 'Pendidikan anak', budget: 1200000, kind: 'spend' },
  { id: 'kesehatan', label: 'Kesehatan', budget: 400000, kind: 'spend' },
  { id: 'hiburan', label: 'Hiburan & langganan', budget: 350000, kind: 'spend' },
  { id: 'tabungan', label: 'Tabungan', budget: 1500000, kind: 'save' },
  { id: 'darurat', label: 'Dana darurat', budget: 500000, kind: 'save' },
  { id: 'lain', label: 'Lain-lain', budget: 650000, kind: 'spend' },
];

// Every November expense, newest last. Per-category sums:
// belanja 1.986.500, transport 742.000, listrik 597.000, internet 450.000,
// makan 512.000, pendidikan 1.200.000, kesehatan 185.000, hiburan 298.000,
// lain 214.000 — total belanja Rp 6.184.500.
export const TRANSACTIONS = [
  { id: 't01', date: '2026-11-01', label: 'Pasar Minggu — sayur & buah', category: 'belanja', amount: 486500 },
  { id: 't02', date: '2026-11-01', label: 'Internet rumah', category: 'internet', amount: 350000 },
  { id: 't03', date: '2026-11-02', label: 'Bensin motor', category: 'transport', amount: 250000 },
  { id: 't04', date: '2026-11-03', label: 'Token listrik', category: 'listrik', amount: 412000 },
  { id: 't05', date: '2026-11-04', label: 'Langganan streaming', category: 'hiburan', amount: 149000 },
  { id: 't06', date: '2026-11-05', label: 'Supermarket — stok mingguan', category: 'belanja', amount: 612000 },
  { id: 't07', date: '2026-11-05', label: 'SPP anak', category: 'pendidikan', amount: 850000 },
  { id: 't08', date: '2026-11-06', label: 'Makan keluarga di luar', category: 'makan', amount: 287000 },
  { id: 't09', date: '2026-11-07', label: 'Pulsa HP', category: 'internet', amount: 100000 },
  { id: 't10', date: '2026-11-08', label: 'Bensin motor', category: 'transport', amount: 250000 },
  { id: 't11', date: '2026-11-09', label: 'Pasar Minggu — lauk & bumbu', category: 'belanja', amount: 423000 },
  { id: 't12', date: '2026-11-10', label: 'PDAM', category: 'listrik', amount: 185000 },
  { id: 't13', date: '2026-11-11', label: 'Apotek — obat flu', category: 'kesehatan', amount: 185000 },
  { id: 't14', date: '2026-11-12', label: 'Les privat matematika', category: 'pendidikan', amount: 350000 },
  { id: 't15', date: '2026-11-13', label: 'Bioskop akhir pekan', category: 'hiburan', amount: 149000 },
  { id: 't16', date: '2026-11-14', label: 'Tol & parkir', category: 'transport', amount: 142000 },
  { id: 't17', date: '2026-11-15', label: 'Supermarket — stok mingguan', category: 'belanja', amount: 465000 },
  { id: 't18', date: '2026-11-16', label: 'Makan siang kantor', category: 'makan', amount: 125000 },
  { id: 't19', date: '2026-11-18', label: 'Peralatan rumah — lampu & sapu', category: 'lain', amount: 214000 },
  { id: 't20', date: '2026-11-20', label: 'Ojek online', category: 'transport', amount: 100000 },
  { id: 't21', date: '2026-11-21', label: 'Kopi & jajan', category: 'makan', amount: 100000 },
];

// Savings goals, in rupiah.
export const GOALS = [
  { id: 'g1', label: 'Dana darurat', note: 'Target 3× pengeluaran bulanan', target: 18000000, saved: 8400000 },
  { id: 'g2', label: 'Liburan keluarga', note: 'Yogyakarta, libur sekolah', target: 6000000, saved: 2250000 },
  { id: 'g3', label: 'Kulkas baru', note: 'Ganti kulkas lama yang bocor', target: 4500000, saved: 3150000 },
];

// Recurring bills with their due dates and status.
export const BILLS = [
  { id: 'b1', label: 'Listrik PLN', due: '2026-11-20', amount: 412000, paid: true },
  { id: 'b2', label: 'PDAM', due: '2026-11-15', amount: 185000, paid: true },
  { id: 'b3', label: 'Internet rumah', due: '2026-12-01', amount: 350000, paid: false },
  { id: 'b4', label: 'SPP anak', due: '2026-12-05', amount: 850000, paid: false },
  { id: 'b5', label: 'BPJS Kesehatan', due: '2026-12-10', amount: 280000, paid: false },
  { id: 'b6', label: 'Asuransi motor', due: '2026-12-18', amount: 325000, paid: false },
];

// Past months: income and spending (without savings set aside), for the
// trend chart on the reports page. November is computed live from the
// transactions above, so it is never stale.
export const HISTORY = [
  { month: 'Jun 2026', income: 9100000, spend: 7850000 },
  { month: 'Jul 2026', income: 9300000, spend: 8020000 },
  { month: 'Agu 2026', income: 9600000, spend: 7640000 },
  { month: 'Sep 2026', income: 9600000, spend: 8310000 },
  { month: 'Okt 2026', income: 9600000, spend: 7980000 },
];

// Practical tips, written for a household managing its money.
export const TIPS = [
  {
    title: 'Pakai aturan 50/30/20',
    body: 'Dari penghasilan Rp 9,6 juta: kebutuhan Rp 4,8 juta, keinginan Rp 2,88 juta, tabungan Rp 1,92 juta. Kalau kebutuhanmu di atas 50%, potong keinginan dulu — bukan tabungan.',
  },
  {
    title: 'Belanja seminggu sekali',
    body: 'Satu kali belanja mingguan dengan daftar tertulis lebih hemat daripada jajan harian tanpa rencana. Keluarga ini belanja Rp 1.986.500 dari anggaran Rp 2,4 juta bulan ini.',
  },
  {
    title: 'Dana darurat 3–6 bulan pengeluaran',
    body: 'Pengeluaran keluarga ini sekitar Rp 6,2 juta per bulan, jadi dana darurat idealnya Rp 18–36 juta. Target kami Rp 18 juta dan sudah terkumpul Rp 8,4 juta (47%).',
  },
  {
    title: 'Pisahkan rekening tabungan',
    body: 'Begitu gajian masuk, pindahkan tabungan Rp 1,5 juta dan dana darurat Rp 500 ribu ke rekening terpisah — otomatis, sebelum sempat terpakai.',
  },
  {
    title: 'Catat pengeluaran kecil',
    body: 'Kopi, jajan, dan ojek yang masing-masing di bawah Rp 100 ribu bisa bocor Rp 500 ribu sebulan. Catat semuanya di halaman Transaksi — butuh 10 detik saja.',
  },
  {
    title: 'Review 15 menit tiap akhir bulan',
    body: 'Bandingkan anggaran dan realisasi tiap kategori, lalu sesuaikan anggaran bulan depan. Kategori yang jebol dua bulan berturut-turut berarti anggarannya yang salah, bukan kamu.',
  },
];
