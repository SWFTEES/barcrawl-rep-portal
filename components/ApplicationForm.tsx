'use client'

import { useState } from 'react'
import Turnstile from './Turnstile'

interface ApplicationFormProps {
  onSubmit: (data: FormData) => Promise<void>
}

export interface FormData {
  fullName: string
  phone: string
  igHandle: string
  university: string
  promoPlan: string
  prevExperience: string
  turnstileToken: string
}

export default function ApplicationForm({ onSubmit }: ApplicationFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    igHandle: '',
    university: '',
    promoPlan: '',
    prevExperience: 'No',
  })
  
  const [turnstileToken, setTurnstileToken] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!turnstileToken) {
      setError('Please complete the verification')
      return
    }
    
    if (formData.promoPlan.length < 50) {
      setError('Please provide more detail about how you plan to promote (at least 2-3 sentences)')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await onSubmit({
        ...formData,
        igHandle: formData.igHandle.replace('@', '').toLowerCase(),
        turnstileToken,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          required
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-crimson focus:border-crimson"
          placeholder="John Smith"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-crimson focus:border-crimson"
          placeholder="(702) 555-1234"
        />
      </div>

      <div>
        <label htmlFor="igHandle" className="block text-sm font-medium text-gray-700 mb-1">
          Instagram Handle
        </label>
        <input
          type="text"
          id="igHandle"
          required
          value={formData.igHandle}
          onChange={(e) => setFormData({ ...formData, igHandle: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-crimson focus:border-crimson"
          placeholder="@yourusername"
        />
      </div>

      <div>
        <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
          University / Greek Affiliation (Optional)
        </label>
        <input
          type="text"
          id="university"
          value={formData.university}
          onChange={(e) => setFormData({ ...formData, university: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-crimson focus:border-crimson"
          placeholder="UNLV, Sigma Chi"
        />
      </div>

      <div>
        <label htmlFor="promoPlan" className="block text-sm font-medium text-gray-700 mb-1">
          How do you plan to promote the bar crawl?
        </label>
        <textarea
          id="promoPlan"
          required
          rows={3}
          value={formData.promoPlan}
          onChange={(e) => setFormData({ ...formData, promoPlan: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-crimson focus:border-crimson"
          placeholder="I'll share on my Instagram story, post in our group chat, and talk to friends at..."
        />
        <p className="mt-1 text-xs text-gray-500">Please provide 2-3 sentences minimum</p>
      </div>

      <div>
        <label htmlFor="prevExperience" className="block text-sm font-medium text-gray-700 mb-1">
          Have you promoted events before?
        </label>
        <select
          id="prevExperience"
          value={formData.prevExperience}
          onChange={(e) => setFormData({ ...formData, prevExperience: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-crimson focus:border-crimson"
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
          <option value="A little">A little</option>
        </select>
      </div>

      <Turnstile
        sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        onSuccess={setTurnstileToken}
        onError={() => setError('Verification failed. Please try again.')}
      />

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 bg-crimson text-white font-semibold rounded-md hover:bg-crimson/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  )
}