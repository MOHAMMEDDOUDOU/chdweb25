"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface User {
  id: string
  username: string
  phone_number: string
  full_name: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        throw new Error("Not authenticated")
      })
      .then((data) => {
        setUser(data.user)
      })
      .catch(() => {
        router.push("/auth/login")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      toast.success("تم تسجيل الخروج بنجاح")
      router.push("/")
    } catch (error) {
      toast.error("حدث خطأ أثناء تسجيل الخروج")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Generate avatar color
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50 p-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <div className={`w-20 h-20 rounded-full ${bgColor} text-white font-bold text-2xl flex items-center justify-center`}>
                {firstLetter}
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">الملف الشخصي</CardTitle>
            <CardDescription className="text-gray-600">معلومات حسابك الشخصي</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
                <p className="text-gray-900 font-medium">{user.full_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المستخدم</label>
                <p className="text-gray-900 font-medium">@{user.username}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                <p className="text-gray-900 font-medium">{user.phone_number}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">معرف الحساب</label>
                <p className="text-gray-500 text-sm font-mono">{user.id}</p>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={() => router.push("/")}
                className="flex-1 bg-pink-600 hover:bg-pink-700"
              >
                العودة للرئيسية
              </Button>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
              >
                تسجيل الخروج
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
