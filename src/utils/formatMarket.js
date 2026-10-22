export function formatCurrency(value, { whole = false } = {}) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 'N/A'

  const smallValue = value !== 0 && Math.abs(value) < 0.01
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    ...(whole
      ? { maximumFractionDigits: 0 }
      : smallValue
        ? { maximumSignificantDigits: 3 }
        : { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  }).format(value)
}
