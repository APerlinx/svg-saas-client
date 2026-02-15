export function StatRow({
  label,
  value,
  color,
}: {
  label: string
  value: string | number
  color?: string
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium ${color || 'text-gray-900'}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
    </div>
  )
}
