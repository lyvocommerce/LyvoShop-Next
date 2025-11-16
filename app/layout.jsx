/* import Script from 'next/script'
import './globals.css'
import { use } from 'react'

export const metadata = {
  title: 'LyvoShop',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <link rel="stylesheet" href="/css/styles.css" />
        <link rel="stylesheet" href="/css/custom.css" />
      </head>
      <body>
        <Script src="/js/bottomsheet-lock.js" strategy="afterInteractive" />
        {children}
      </body>
    </html>
  )
} */


import TelegramInit from "../components/TelegramInit";
import './globals.css'  

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/css/styles.css" />
        <link rel="stylesheet" href="/css/custom.css" />
      </head>
      <body>
        <TelegramInit />
        {children}
      </body>
    </html>
  );
}