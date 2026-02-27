'use client'

import { useState } from 'react'
import Image from 'next/image'
import ApplicationForm, { FormData } from '@/components/ApplicationForm'

export default function LandingPage() {
  const [showForm, setShowForm] = useState(true)
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (data: FormData) => {
    const response = await fetch('/api/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    
    const result = await response.json()
    
    if (result.error === 'duplicate') {
      throw new Error(result.message)
    }
    
    if (!response.ok) {
      throw new Error(result.error || 'Something went wrong')
    }
    
    setShowForm(false)
    setSuccessMessage(result.message)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="text-center">
            <div className="mb-8">
              <Image 
                src="/logo.svg" 
                alt="Nevada Senior Bar Crawl" 
                width={200} 
                height={100} 
                className="mx-auto"
              />
            </div>
            
            <h1 className="font-headline text-5xl sm:text-7xl text-midnight mb-4">
              Get Paid to Party
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Earn commission selling tickets and merch for the biggest senior bar crawl in Nevada
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="bg-crimson text-white px-6 py-3 rounded-full font-semibold">
                $5 per shirt
              </div>
              <div className="bg-crimson text-white px-6 py-3 rounded-full font-semibold">
                $3 per ticket
              </div>
              <div className="bg-midnight text-white px-6 py-3 rounded-full font-semibold">
                Bonuses at 10, 25, 40 units
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-headline text-4xl text-midnight text-center mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {[
              { step: 1, title: "Apply Below", desc: "Takes 30 seconds" },
              { step: 2, title: "Get Your Link", desc: "Unique referral URL" },
              { step: 3, title: "Share & Promote", desc: "Post on socials, tell friends" },
              { step: 4, title: "Get Paid", desc: "Track sales, earn commissions" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-crimson text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 bg-gray-50" id="apply">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {showForm ? (
            <>
              <h2 className="font-headline text-4xl text-midnight text-center mb-8">
                Apply to Join Our Team
              </h2>
              
              <div className="bg-white rounded-lg shadow-lg p-8">
                <ApplicationForm onSubmit={handleSubmit} />
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="font-headline text-3xl text-midnight mb-4">
                Application Received!
              </h2>
              <p className="text-lg text-gray-600">
                {successMessage}
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Save your Instagram handle - you'll need it to access your dashboard once approved.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-midnight text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-2">Nevada Senior Bar Crawl - Spring 2026</p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="/leaderboard" className="hover:text-crimson transition-colors">
              View Leaderboard
            </a>
            <a href={process.env.NEXT_PUBLIC_LANDING_PAGE_URL} className="hover:text-crimson transition-colors">
              Main Event Site
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
