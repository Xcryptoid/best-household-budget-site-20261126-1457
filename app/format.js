// Formatting helpers: rupiah amounts and Indonesian short dates.
// Pure functions, no DOM, no state — used by every view.

export function formatRupiah(amount) {
  return 'Rp ' + Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Short form for tight spaces, e.g. 1.986.500 -> "Rp 1,99 jt".
export function formatRupiahShort(amount) {
  if (amount >= 1000000) {
    const jt = amount / 1000000;
    return 'Rp ' + (Number.isInteger(jt) ? jt : jt.toFixed(2).replace('.', ',')) + ' jt';
  }
  if (amount >= 1000) return 'Rp ' + Math.round(amount / 1000) + ' rb';
  return formatRupiah(amount);
}

export function formatPercent(value) {
  return (Math.round(value * 10) / 10).toString().replace('.', ',') + '%';
}

const MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export function formatDateShort(iso) {
  const parts = iso.split('-');
  return Number(parts[2]) + ' ' + MONTHS_ID[Number(parts[1]) - 1];
}
