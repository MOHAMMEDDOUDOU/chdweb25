"use client"
import { useEffect, useState } from "react"
import type React from "react"

import { useRouter, usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("adminLoggedIn")

      if (!isLoggedIn && pathname !== "/admin") {
        router.push("/admin")
        return
      }

      setIsAuthenticated(!!isLoggedIn)
      setIsLoading(false)
    }

    checkAuth()
  }, [router, pathname])

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-orange-600 font-medium">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated && pathname !== "/admin") {
    return null
  }

  if (pathname === "/admin") {
    return <>{children}</>
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100">
      <AdminSidebar />
      <main className="flex-1 md:ml-20 overflow-auto">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}
