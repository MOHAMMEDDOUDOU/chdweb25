"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Tag, TrendingUp, Users, DollarSign } from "lucide-react"

export default function DashboardSection() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOffers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    activeProducts: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // جلب إحصائيات المنتجات
      const productsRes = await fetch('/api/products')
      const products = await productsRes.json()
      
      // جلب إحصائيات العروض
      const offersRes = await fetch('/api/offers')
      const offers = await offersRes.json()
      
      // جلب إحصائيات الطلبات
      const ordersRes = await fetch('/api/orders')
      const orders = await ordersRes.json()
      
      // حساب الإحصائيات
      const totalRevenue = orders.reduce((sum: number, order: any) => {
        return sum + (order.total_amount || 0)
      }, 0)
      
      const today = new Date().toISOString().split('T')[0]
      const todayOrders = orders.filter((order: any) => {
        return order.created_at?.startsWith(today)
      }).length
      
      const activeProducts = products.filter((product: any) => product.is_active).length
      
      setStats({
        totalProducts: products.length,
        totalOffers: offers.length,
        totalOrders: orders.length,
        totalRevenue,
        todayOrders,
        activeProducts
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">لوحة المعلومات</h2>
        <p className="text-gray-600">نظرة عامة على أداء المتجر</p>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المنتجات</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeProducts} منتج نشط
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي العروض</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOffers}</div>
            <p className="text-xs text-muted-foreground">
              عروض متاحة حالياً
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {stats.todayOrders} طلب اليوم
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} دج</div>
            <p className="text-xs text-muted-foreground">
              من جميع الطلبات
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">طلبات اليوم</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayOrders}</div>
            <p className="text-xs text-muted-foreground">
              طلبات جديدة اليوم
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المنتجات النشطة</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProducts}</div>
            <p className="text-xs text-muted-foreground">
              من أصل {stats.totalProducts} منتج
            </p>
          </CardContent>
        </Card>
      </div>

      {/* رسالة ترحيب */}
      <Card>
        <CardHeader>
          <CardTitle>مرحباً بك في لوحة التحكم</CardTitle>
          <CardDescription>
            يمكنك إدارة المنتجات والعروض والطلبات من خلال التبويبات أعلاه
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Package className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold text-orange-800">إدارة المنتجات</h3>
              <p className="text-sm text-orange-600">أضف، عدّل، أو احذف المنتجات</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Tag className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-800">إدارة العروض</h3>
              <p className="text-sm text-green-600">أنشئ عروض خاصة وجذابة</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <ShoppingCart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-800">إدارة الطلبات</h3>
              <p className="text-sm text-blue-600">تتبع وتدير طلبات العملاء</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
