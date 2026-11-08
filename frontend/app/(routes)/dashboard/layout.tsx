"use client"
import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, Stethoscope } from 'lucide-react'
import Sidebar from './_components/Sidebar'
import OnboardingGuard from './_components/OnboardingGuard'
import { Toaster } from 'sonner'

const COLLAPSE_KEY = 'medsage.sidebar.collapsed'

function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    try { setCollapsed(localStorage.getItem(COLLAPSE_KEY) === '1') } catch {}
  }, [])

  const toggleCollapsed = useCallback(() => {
    setCollapsed((c) => {
      try { localStorage.setItem(COLLAPSE_KEY, c ? '0' : '1') } catch {}
      return !c
    })
  }, [])
  const closeMobile = useCallback(() => setMobileOpen(false), [])

  return (
    <OnboardingGuard>
      <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#0a0a0a]">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-gray-200/70 bg-white/85 px-4 backdrop-blur-md dark:border-white/10 dark:bg-[#0a0a0a]/85 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
            aria-controls="dashboard-sidebar"
            aria-expanded={mobileOpen}
            className="-ml-2 grid size-10 place-items-center rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10"
          >
            <Menu className="size-5" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2 font-medium tracking-tight text-gray-900 dark:text-gray-100">
            <Stethoscope className="size-5" aria-hidden />
            MedSage
          </Link>
        </header>

        <Sidebar
          collapsed={collapsed}
          onToggleCollapsed={toggleCollapsed}
          mobileOpen={mobileOpen}
          onMobileClose={closeMobile}
        />
        <main className={`transition-[margin] duration-300 ${collapsed ? 'lg:ml-[104px]' : 'lg:ml-[272px]'}`}>
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
        <Toaster richColors position="top-right" />
      </div>
    </OnboardingGuard>
  )
}

export default DashboardLayout
