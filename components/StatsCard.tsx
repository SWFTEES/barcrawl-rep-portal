interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  accent?: boolean
}

export default function StatsCard({ title, value, subtitle, accent }: StatsCardProps) {
  return (
    <div className={`rounded-lg border ${accent ? 'border-crimson bg-crimson/5' : 'border-gray-200 bg-white'} p-6`}>
      <div className="text-sm font-medium text-gray-600">{title}</div>
      <div className={`mt-2 text-3xl font-bold ${accent ? 'text-crimson' : 'text-midnight'}`}>
        {value}
      </div>
      {subtitle && (
        <div className="mt-1 text-sm text-gray-500">{subtitle}</div>
      )}
    </div>
  )
}