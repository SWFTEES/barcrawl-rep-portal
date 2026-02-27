interface BonusTier {
  units: number
  reward: string
}

interface BonusTrackerProps {
  totalUnits: number
  tiers: BonusTier[]
}

export default function BonusTracker({ totalUnits, tiers }: BonusTrackerProps) {
  const maxUnits = Math.max(...tiers.map(t => t.units))
  const progressPercent = Math.min((totalUnits / maxUnits) * 100, 100)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-midnight mb-4">Bonus Progress</h3>
      
      <div className="relative">
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-crimson to-crimson/80 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        
        <div className="mt-6 space-y-3">
          {tiers.map((tier) => {
            const achieved = totalUnits >= tier.units
            return (
              <div key={tier.units} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    achieved ? 'bg-crimson' : 'bg-gray-300'
                  }`}>
                    {achieved && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`${achieved ? 'font-semibold' : ''}`}>
                    {tier.units} units
                  </span>
                </div>
                <span className={`text-sm ${achieved ? 'text-crimson font-semibold' : 'text-gray-500'}`}>
                  {tier.reward}
                </span>
              </div>
            )
          })}
        </div>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        You've sold <span className="font-bold text-midnight">{totalUnits}</span> total units
      </div>
    </div>
  )
}