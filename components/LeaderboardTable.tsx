import { LeaderboardEntry } from '@/lib/supabase'

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
}

export default function LeaderboardTable({ entries }: LeaderboardTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-gray-200">
          <tr>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Rep</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700">Shirts</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700">Tickets</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700">Points</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-700">Commission</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => {
            const rank = index + 1
            const isTopThree = rank <= 3
            
            return (
              <tr 
                key={entry.ig_handle}
                className={`border-b border-gray-100 ${
                  isTopThree ? 'bg-gradient-to-r from-crimson/5 to-transparent' : ''
                }`}
              >
                <td className="py-3 px-4">
                  <span className={`${
                    rank === 1 ? 'text-2xl font-bold text-yellow-600' :
                    rank === 2 ? 'text-xl font-bold text-gray-500' :
                    rank === 3 ? 'text-lg font-bold text-orange-600' :
                    'text-gray-600'
                  }`}>
                    {rank === 1 && '🥇 '}
                    {rank === 2 && '🥈 '}
                    {rank === 3 && '🥉 '}
                    #{rank}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium text-midnight">{entry.full_name}</div>
                    <div className="text-sm text-gray-500">@{entry.ig_handle}</div>
                  </div>
                </td>
                <td className="text-center py-3 px-4 text-gray-700">{entry.shirts_sold}</td>
                <td className="text-center py-3 px-4 text-gray-700">{entry.tickets_sold}</td>
                <td className="text-center py-3 px-4">
                  <span className="font-semibold text-crimson">{entry.total_points}</span>
                </td>
                <td className="text-right py-3 px-4">
                  <span className="font-semibold text-green-600">${entry.total_commission}</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      
      {entries.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No sales yet. Be the first to make a sale!
        </div>
      )}
    </div>
  )
}