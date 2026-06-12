import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Chatbot } from '@/components/chatbot'
import { ThemeInitializer } from '@/components/theme-initializer'
import { ThemeProvider } from '@/components/theme-provider'
import { ButterflyBackground } from '@/components/butterfly-background'
import { Toaster } from 'sonner'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Gully XI Premier League - Pakistan Street Cricket',
    template: '%s | Gully XI Premier League',
  },
  description:
    'The ultimate tapeball cricket leaderboard for Pakistan\'s gully cricket champions. Add players, track scores, and crown the mohalla ka champion!',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a3a1a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeInitializer />
      </head>
      <body className={`${spaceGrotesk.variable} font-sans antialiased flex min-h-screen flex-col bg-background`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ButterflyBackground />
          <div className="relative z-10 flex flex-col flex-1">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Chatbot />
          <Toaster richColors position="top-right" />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
