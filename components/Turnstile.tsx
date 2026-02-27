'use client'

import { useEffect, useRef } from 'react'

interface TurnstileProps {
  sitekey: string
  onSuccess: (token: string) => void
  onError?: () => void
  onExpire?: () => void
}

declare global {
  interface Window {
    turnstile: any
  }
}

export default function Turnstile({ sitekey, onSuccess, onError, onExpire }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  useEffect(() => {
    const loadScript = () => {
      if (window.turnstile) {
        renderWidget()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
      script.async = true
      script.defer = true
      script.onload = () => {
        renderWidget()
      }
      document.body.appendChild(script)
    }

    const renderWidget = () => {
      if (!containerRef.current || widgetIdRef.current) return

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey,
        callback: onSuccess,
        'error-callback': onError,
        'expired-callback': onExpire,
        appearance: 'interaction-only',
      })
    }

    loadScript()

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
      }
    }
  }, [sitekey, onSuccess, onError, onExpire])

  return <div ref={containerRef} />
}