"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface UserAvatarProps {
  className?: string
}

export default function UserAvatar({ className = "" }: UserAvatarProps) {
  const [user, setUser] = useState<{ username: string; full_name: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in by trying to fetch user data
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me")
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
    
    // إعادة فحص كل 5 ثوانٍ للتحديثات
    const interval = setInterval(checkAuth, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  if (loading) {
    return (
      <div className={`w-8 h-8 rounded-full bg-gray-200 animate-pulse ${className}`} />
    )
  }

  if (!user) {
    return (
      <Button
        onClick={() => router.push("/auth/login")}
        className="bg-pink-600 hover:bg-pink-700 text-white rounded-full"
      >
        تسجيل الدخول
      </Button>
    )
  }

  // Generate consistent color based on username
  const colors = [
    "bg-red-500",
    "bg-blue-500", 
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500"
  ]
  
  const colorIndex = user.username.charCodeAt(0) % colors.length
  const bgColor = colors[colorIndex]
  const firstLetter = user.username.charAt(0).toUpperCase()

  return (
    <div className="relative group">
      <Button
        variant="ghost"
        className={`w-8 h-8 rounded-full ${bgColor} text-white font-bold text-sm hover:${bgColor} p-0 ${className}`}
        onClick={() => router.push("/profile")}
      >
        {firstLetter}
      </Button>
      
      {/* Dropdown menu */}
      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-3 border-b border-gray-100">
          <div className="font-medium text-gray-900">{user.full_name}</div>
          <div className="text-sm text-gray-500">@{user.username}</div>
        </div>
        <div className="p-1">
          <button
            onClick={() => router.push("/profile")}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
          >
            الملف الشخصي
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
    </div>
  )
}
