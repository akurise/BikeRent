export function formatCurrency(value: number) {
  return new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' }).format(value)
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString()
}

export function formatDurationHours(hours: number | null | undefined) {
  if (hours == null || Number.isNaN(hours)) return '—'
  return `${hours.toFixed(1)} год.`
}
