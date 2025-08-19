"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    phone_number: "",
    password: "",
    confirm_password: "",
    full_name: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirm_password) {
      toast.error("كلمات المرور غير متطابقة")
      return
    }
    if (formData.password.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل")
      return
    }
    setLoading(true)
    try {
      const r = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          phone_number: formData.phone_number,
          password: formData.password,
          full_name: formData.full_name,
        }),
      })
      const data = await r.json()
      if (r.ok) {
        toast.success("تم إنشاء الحساب بنجاح")
        
        // تسجيل الدخول تلقائياً بعد إنشاء الحساب
        try {
          const loginRes = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: formData.username,
              password: formData.password,
            }),
          })
          
          if (loginRes.ok) {
            toast.success("تم تسجيل الدخول تلقائياً")
            router.push("/")
          } else {
            toast.error("تم إنشاء الحساب ولكن يرجى تسجيل الدخول يدوياً")
            router.push("/auth/login")
          }
        } catch (error) {
          toast.error("تم إنشاء الحساب ولكن يرجى تسجيل الدخول يدوياً")
          router.push("/auth/login")
        }
      } else {
        toast.error(data.error || "حدث خطأ أثناء إنشاء الحساب")
      }
    } catch {
      toast.error("حدث خطأ في الاتصال")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">إنشاء حساب جديد</CardTitle>
          <CardDescription className="text-gray-600">انضم إلينا واستمتع بأفضل المنتجات</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">اسم المستخدم *</Label>
              <Input id="username" required value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number">رقم الهاتف *</Label>
              <Input id="phone_number" type="tel" required value={formData.phone_number} onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_name">الاسم الكامل *</Label>
              <Input id="full_name" required value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور *</Label>
              <Input id="password" type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm_password">تأكيد كلمة المرور *</Label>
              <Input id="confirm_password" type="password" required value={formData.confirm_password} onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })} />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700" disabled={loading}>
              {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              لديك حساب بالفعل؟{" "}
              <Link href="/auth/login" className="text-rose-600 hover:text-rose-700 font-medium">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
