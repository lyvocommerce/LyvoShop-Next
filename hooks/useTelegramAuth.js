'use client'

import { useState, useEffect } from 'react'
import { authTelegram } from '../services/auth'

export function useTelegramAuth() {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    const initData = tg?.initData

    if (!initData) {
      setStatus('guest')
      return
    }

    let stop = false

    async function run() {
      try {
        setStatus('loading')
        const r = await authTelegram(initData)

        if (!stop) {
          if (r.ok) {
            setUser(r.user)
            setStatus('ok')
          } else {
            setStatus('error')
          }
        }
      } catch (err) {
        if (!stop) setStatus('error')
      }
    }

    run()
    return () => { stop = true }
  }, [])

  return { user, status }
}