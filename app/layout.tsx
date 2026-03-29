import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { Sidebar } from '@/components/sidebar'
import { Topbar } from '@/components/topbar'
import { Toaster } from '@/components/ui/sonner'
import { getSettings } from '@/lib/db'
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = { title: 'Tracker', description: 'Personal dashboard' }

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()

  return (
    <html lang="en" className={cn("dark", GeistSans.variable, GeistMono.variable, "font-sans", geist.variable)}>
      <body className="bg-background text-foreground antialiased">
        <div className="flex min-h-screen">
          <Sidebar settings={settings} />
          <div className="flex flex-1 flex-col" style={{ marginLeft: 'var(--sidebar-w)' }}>
            <Topbar />
            <main className="flex-1 p-7">{children}</main>
          </div>
        </div>
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  )
}
