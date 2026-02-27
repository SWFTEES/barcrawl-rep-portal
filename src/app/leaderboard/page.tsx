import Image from 'next/image'
import Link from 'next/link'
import { getSupabase, LeaderboardEntry } from '@/lib/supabase'
import LeaderboardTable from '@/components/LeaderboardTable'

// Force dynamic rendering to avoid build-time data fetching
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getLeaderboardData() {
  try {
    const { data, error } = await getSupabase()
      .from('leaderboard_view')
      .select('*')
      .order('total_points', { ascending: false })

    if (error) {
      console.error('Error fetching leaderboard:', error)
      return []
    }

    return data as LeaderboardEntry[]
  } catch (err) {
    // Return empty array during build time or if Supabase is not configured
    console.error('Failed to fetch leaderboard data:', err)
    return []
  }
}

export default async function LeaderboardPage() {
  const entries = await getLeaderboardData()

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
              href="/"
              className="text-crimson hover:text-crimson/80 font-semibold transition-colors"
            >
              Join Our Team →
            </Link>
          </div>
        </div>
      </header>

      {/* Leaderboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="font-headline text-5xl text-midnight mb-4">
            Sales Leaderboard
          </h1>
          <p className="text-lg text-gray-600">
            Top performers compete for bonuses and glory
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>

        {/* Top 3 Podium */}
        {entries.length >= 3 && (
          <div className="mb-12">
            <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
              {/* 2nd Place */}
              <div className="text-center pt-8">
                <div className="bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg p-6 shadow-lg">
                  <div className="text-3xl mb-2">🥈</div>
                  <div className="font-bold text-lg text-midnight">{entries[1].full_name}</div>
                  <div className="text-sm text-gray-600 mb-2">@{entries[1].ig_handle}</div>
                  <div className="text-2xl font-bold text-crimson">{entries[1].total_points} pts</div>
                  <div className="text-sm text-green-600 font-semibold mt-1">
                    ${entries[1].total_commission}
                  </div>
                </div>
              </div>

              {/* 1st Place */}
              <div className="text-center">
                <div className="bg-gradient-to-b from-yellow-100 to-yellow-200 rounded-lg p-6 shadow-xl transform scale-110">
                  <div className="text-4xl mb-2">🥇</div>
                  <div className="font-bold text-xl text-midnight">{entries[0].full_name}</div>
                  <div className="text-sm text-gray-600 mb-2">@{entries[0].ig_handle}</div>
                  <div className="text-3xl font-bold text-crimson">{entries[0].total_points} pts</div>
                  <div className="text-sm text-green-600 font-semibold mt-1">
                    ${entries[0].total_commission}
                  </div>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="text-center pt-8">
                <div className="bg-gradient-to-b from-orange-100 to-orange-200 rounded-lg p-6 shadow-lg">
                  <div className="text-3xl mb-2">🥉</div>
                  <div className="font-bold text-lg text-midnight">{entries[2].full_name}</div>
                  <div className="text-sm text-gray-600 mb-2">@{entries[2].ig_handle}</div>
                  <div className="text-2xl font-bold text-crimson">{entries[2].total_points} pts</div>
                  <div className="text-sm text-green-600 font-semibold mt-1">
                    ${entries[2].total_commission}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <LeaderboardTable entries={entries} />
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600 mb-4">
            Want to join the competition and earn commissions?
          </p>
          <Link 
            href="/#apply"
            className="inline-block bg-crimson text-white px-8 py-3 rounded-md font-semibold hover:bg-crimson/90 transition-colors"
          >
            Apply to Become a Rep
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-midnight text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-2">Nevada Senior Bar Crawl - Spring 2026</p>
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/" className="hover:text-crimson transition-colors">
              Home
            </Link>
            <a href={process.env.NEXT_PUBLIC_LANDING_PAGE_URL} className="hover:text-crimson transition-colors">
              Main Event Site
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}