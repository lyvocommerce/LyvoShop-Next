'use client'

export function useTelegram() {
  const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : null

  function expand() {
    try {
      tg?.expand()
    } catch (e) {
      console.log('expand error', e)
    }
  }

  return { tg, expand }
}