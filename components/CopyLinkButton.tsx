'use client'

import { useState } from 'react'

interface CopyLinkButtonProps {
  link: string
  className?: string
}

export default function CopyLinkButton({ link, className = '' }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={link}
        readOnly
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
      />
      <button
        onClick={handleCopy}
        className={`px-4 py-2 rounded-md font-medium transition-colors ${
          copied 
            ? 'bg-green-600 text-white' 
            : 'bg-crimson text-white hover:bg-crimson/90'
        } ${className}`}
      >
        {copied ? 'Copied!' : 'Copy Link'}
      </button>
    </div>
  )
}