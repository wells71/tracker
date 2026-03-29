import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { Sidebar } from '@/components/sidebar'
import { Topbar } from '@/components/topbar'
import { Toaster } from '@/components/ui/sonner'
import { getSettings } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Tracker',
  description: 'Personal dashboard',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()

  return (
    <html lang="en" className={`dark ${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased" suppressHydrationWarning>
        <div className="flex min-h-screen">
          {/* Fixed sidebar — 220px wide */}
          <Sidebar settings={settings} />

          {/* Main — offset by sidebar width */}
          <div className="flex min-h-screen flex-1 flex-col pl-[220px]">
            <Topbar />
            <main className="flex-1 p-7">
              {children}
            </main>
          </div>
        </div>
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  )
}