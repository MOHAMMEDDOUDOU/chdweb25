"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Lock, User, Package, ShoppingCart, Tag, BarChart3, LogOut } from "lucide-react"
import Image from "next/image"
import MultiImageUpload from "@/components/MultiImageUpload"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "@/components/ui/use-toast"
import * as XLSX from "xlsx"
import { FaWhatsapp } from "react-icons/fa"

// مكونات الأقسام
import ProductsSection from "./components/ProductsSection"
import OffersSection from "./components/OffersSection"
import OrdersSection from "./components/OrdersSection"
import DashboardSection from "./components/DashboardSection"

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("dashboard")
  const router = useRouter()

  // التحقق من تسجيل الدخول عند التحميل
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn")
    if (adminLoggedIn === "true") {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simple authentication - in production, use proper authentication
    if (username === "admin" && password === "tanamirt25") {
      localStorage.setItem("adminLoggedIn", "true")
      setIsLoggedIn(true)
    } else {
      setError("اسم المستخدم أو كلمة المرور غير صحيحة")
    }

    setIsLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    setIsLoggedIn(false)
    setActiveTab("dashboard")
  }

  // إذا لم يتم تسجيل الدخول، عرض صفحة تسجيل الدخول
  if (!isLoggedIn) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 p-4 overflow-hidden">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <Image
                src="https://res.cloudinary.com/dldvpyait/image/upload/cosimbelle_vrcgcw.png"
                alt="Logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">لوحة التحكم</CardTitle>
            <CardDescription className="text-gray-600">قم بتسجيل الدخول للوصول إلى لوحة الإدارة</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-right block text-gray-700">
                  اسم المستخدم
                </Label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pr-10 text-right border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    placeholder="أدخل اسم المستخدم"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-right block text-gray-700">
                  كلمة المرور
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 pl-10 text-right border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    placeholder="أدخل كلمة المرور"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-md">{error}</div>}

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    جاري تسجيل الدخول...
                  </div>
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // لوحة التحكم الرئيسية
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Image
                src="https://res.cloudinary.com/dldvpyait/image/upload/cosimbelle_vrcgcw.png"
                alt="Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <h1 className="text-xl font-bold text-gray-800">لوحة التحكم</h1>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center space-x-2 space-x-reverse"
            >
              <LogOut className="h-4 w-4" />
              <span>تسجيل الخروج</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 space-x-reverse">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "dashboard"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <BarChart3 className="h-4 w-4" />
                <span>لوحة المعلومات</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "products"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <Package className="h-4 w-4" />
                <span>المنتجات</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("offers")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "offers"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <Tag className="h-4 w-4" />
                <span>العروض</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "orders"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <ShoppingCart className="h-4 w-4" />
                <span>الطلبات</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && <DashboardSection />}
        {activeTab === "products" && <ProductsSection />}
        {activeTab === "offers" && <OffersSection />}
        {activeTab === "orders" && <OrdersSection />}
      </div>
    </div>
  )
}
