import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase, Rep, Sale, LeaderboardEntry } from '@/lib/supabase'
import StatsCard from '@/components/StatsCard'
import BonusTracker from '@/components/BonusTracker'
import CopyLinkButton from '@/components/CopyLinkButton'

interface DashboardPageProps {
  params: Promise<{ handle: string }>
}

async function getRepData(handle: string) {
  const { data: rep, error } = await supabase
    .from('reps')
    .select('*')
    .eq('ig_handle', handle.toLowerCase())
    .eq('status', 'approved')
    .single()

  if (error || !rep) {
    return null
  }

  return rep as Rep
}

async function getSalesData(handle: string) {
  const { data: sales, error } = await supabase
    .from('sales')
    .select('*')
    .eq('rep_ig_handle', handle.toLowerCase())
    .order('recorded_at', { ascending: false })

  return (sales || []) as Sale[]
}

async function getLeaderboardPosition(handle: string) {
  const { data: leaderboard, error } = await supabase
    .from('leaderboard_view')
    .select('*')
    .order('total_points', { ascending: false })

  if (!leaderboard) return { position: 0, total: 0 }

  const position = leaderboard.findIndex(entry => entry.ig_handle === handle.toLowerCase()) + 1
  return { position, total: leaderboard.length }
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { handle } = await params
  const rep = await getRepData(handle)

  if (!rep) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-midnight mb-4">Dashboard Not Found</h1>
          <p className="text-gray-600 mb-8">
            This dashboard doesn't exist or your application is still pending approval.
          </p>
          <Link 
            href="/" 
            className="inline-block bg-crimson text-white px-6 py-3 rounded-md hover:bg-crimson/90 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    )
  }

  const sales = await getSalesData(handle)
  const { position, total } = await getLeaderboardPosition(handle)

  const shirtsSold = sales.filter(s => s.sale_type === 'shirt').reduce((sum, s) => sum + s.quantity, 0)
  const ticketsSold = sales.filter(s => s.sale_type === 'ticket').reduce((sum, s) => sum + s.quantity, 0)
  const totalUnits = shirtsSold + ticketsSold
  const totalPoints = (shirtsSold * 2) + ticketsSold
  const totalCommission = (shirtsSold * 5) + (ticketsSold * 3)

  const bonusTiers = [
    { units: 10, reward: 'Free Shirt' },
    { units: 25, reward: '$50 Bonus' },
    { units: 40, reward: '$50 Bonus' }
  ]

  const referralLink = `${process.env.NEXT_PUBLIC_LANDING_PAGE_URL}/?utm_source=${handle.toLowerCase()}`

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Image 
                src="/logo.svg" 
                alt="Nevada Senior Bar Crawl" 
                width={150} 
                height={75} 
                className="cursor-pointer"
              />
            </Link>
            <Link 
              href="/leaderboard"
              className="text-crimson hover:text-crimson/80 font-semibold transition-colors"
            >
              View Leaderboard →
            </Link>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-midnight mb-2">
            Welcome back, {rep.full_name}!
          </h1>
          <p className="text-gray-600">@{rep.ig_handle}</p>
        </div>

        {/* Referral Link */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-midnight mb-4">Your Referral Link</h2>
          <CopyLinkButton link={referralLink} />
          <p className="mt-2 text-sm text-gray-600">
            Share this link with friends to track your sales automatically
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard title="Shirts Sold" value={shirtsSold} subtitle="$5 each" />
          <StatsCard title="Tickets Sold" value={ticketsSold} subtitle="$3 each" />
          <StatsCard title="Total Points" value={totalPoints} accent />
          <StatsCard title="Commission Earned" value={`$${totalCommission}`} accent />
        </div>

        {/* Bonus Tracker */}
        <div className="mb-8">
          <BonusTracker totalUnits={totalUnits} tiers={bonusTiers} />
        </div>

        {/* Leaderboard Position */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-midnight mb-2">Leaderboard Position</h3>
          <p className="text-3xl font-bold text-crimson">
            #{position} <span className="text-lg text-gray-600 font-normal">out of {total} reps</span>
          </p>
        </div>

        {/* Recent Sales */}
        {sales.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-midnight mb-4">Recent Sales</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-2 px-2 text-sm font-medium text-gray-700">Date</th>
                    <th className="text-left py-2 px-2 text-sm font-medium text-gray-700">Type</th>
                    <th className="text-center py-2 px-2 text-sm font-medium text-gray-700">Qty</th>
                    <th className="text-right py-2 px-2 text-sm font-medium text-gray-700">Commission</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.slice(0, 10).map(sale => {
                    const commission = sale.sale_type === 'shirt' ? sale.quantity * 5 : sale.quantity * 3
                    return (
                      <tr key={sale.id} className="border-b border-gray-100">
                        <td className="py-2 px-2 text-sm text-gray-600">
                          {new Date(sale.recorded_at).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-2 text-sm">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            sale.sale_type === 'shirt' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {sale.sale_type}
                          </span>
                        </td>
                        <td className="text-center py-2 px-2 text-sm text-gray-700">{sale.quantity}</td>
                        <td className="text-right py-2 px-2 text-sm font-medium text-green-600">
                          ${commission}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}