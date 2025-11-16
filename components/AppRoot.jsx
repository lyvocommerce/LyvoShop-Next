'use client'

import React, { useEffect } from 'react'
import CatalogPage from '../pages/CatalogPage'
import { useTelegram } from '../hooks/useTelegram'
import { useTelegramAuth } from '../hooks/useTelegramAuth'

export default function AppRoot() {
  const { expand } = useTelegram()
  const { user, status } = useTelegramAuth()

  useEffect(() => {
    expand()
  }, [expand])

  return (
    <div className="container mx-auto max-w-[720px] px-4 pb-6 relative">

      {status === 'ok' && (
        <div className="sticky safe-top z-30 bg-white border-b border-[var(--border)]">
          <div className="px-4 py-2 flex items-center justify-between">
            <div className="text-[15px] font-semibold">LyvoShop</div>
            
          </div>
        </div>
      )}

      {status === 'loading' && (
        <div className="text-[13px] text-[var(--muted)]">Authorizing…</div>
      )}

      {status === 'guest' && (
        <div className="text-[13px] text-[var(--muted)]">Guest mode</div>
      )}

      {status === 'error' && (
        <div className="text-[13px] text-red-600">Auth error</div>
      )}

      <CatalogPage user={user} />
    </div>
  )
}