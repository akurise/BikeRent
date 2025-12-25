interface StatusBadgeProps {
  value: string
}

export function StatusBadge({ value }: StatusBadgeProps) {
  const intent = value.toLowerCase().includes('active')
    ? 'success'
    : value.toLowerCase().includes('available')
      ? 'success'
      : value.toLowerCase().includes('pending')
        ? 'warning'
        : 'muted'

  return <span className={`badge badge-${intent}`}>{value}</span>
}
