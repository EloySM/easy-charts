// app/layout.tsx o app/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === 'production' 
      ? 'https://spency.app' 
      : 'http://localhost:3000'
  ),
  title: 'Spency - Simple Expense Tracking | Your Finances, No Noise',
  description: 'Control every cent with Spency. Log expenses in under 2 seconds, visualize spending with clear analytics, and keep your financial data private and secure.',
  keywords: ['expense tracker', 'personal finance', 'budget app', 'spending tracker', 'financial control', 'money management'],
  authors: [{ name: 'Spency Team' }],
  creator: 'Spency',
  publisher: 'Spency',
  openGraph: {
    title: 'Spency - Your Finances, No Noise',
    description: 'Designed for clarity. Control every cent with an interface that breathes.',
    url: 'https://spency.app', // Cambia por tu URL real
    siteName: 'Spency',
    images: [
      {
        url: '/og-image.png', // Crea esta imagen (1200x630px)
        width: 1200,
        height: 675,
        alt: 'Spency Dashboard Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spency - Simple Expense Tracking',
    description: 'Control every cent with Spency. Your finances, no noise.',
    images: ['/twitter-image.png'], // Crea esta imagen (1200x600px)
    creator: '@spency', // Tu handle de Twitter
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Añade cuando tengas
    // yandex: 'yandex-verification-code',
  },
}