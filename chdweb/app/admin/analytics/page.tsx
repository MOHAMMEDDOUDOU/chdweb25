"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, Users, ShoppingCart, DollarSign, Package, Eye, MousePointer, Calendar } from "lucide-react"

// Mock data for analytics
const mockAnalytics = {
  overview: {
    totalRevenue: 125000,
    totalOrders: 1250,
    totalCustomers: 850,
    totalProducts: 120,
    conversionRate: 3.2,
    averageOrderValue: 100,
  },
  monthlyRevenue: [
    { month: "يناير", revenue: 15000, orders: 150 },
    { month: "فبراير", revenue: 18000, orders: 180 },
    { month: "مارس", revenue: 22000, orders: 220 },
    { month: "أبريل", revenue: 19000, orders: 190 },
    { month: "مايو", revenue: 25000, orders: 250 },
    { month: "يونيو", revenue: 26000, orders: 260 },
  ],
  topProducts: [
    { name: "كريم الوجه المرطب", sales: 450, revenue: 22500 },
    { name: "شامبو الشعر الطبيعي", sales: 380, revenue: 19000 },
    { name: "عطر الورد الفاخر", sales: 320, revenue: 32000 },
    { name: "مكياج العيون", sales: 290, revenue: 14500 },
    { name: "كريم الجسم", sales: 250, revenue: 12500 },
  ],
  categoryDistribution: [
    { name: "مكياج", value: 35, color: "#FF6B6B" },
    { name: "عناية بالبشرة", value: 28, color: "#4ECDC4" },
    { name: "عطور", value: 20, color: "#45B7D1" },
    { name: "شعر", value: 12, color: "#96CEB4" },
    { name: "أخرى", value: 5, color: "#FFEAA7" },
  ],
  trafficSources: [
    { source: "البحث المباشر", visitors: 2500, percentage: 40 },
    { source: "وسائل التواصل", visitors: 1875, percentage: 30 },
    { source: "الإعلانات المدفوعة", visitors: 1250, percentage: 20 },
    { source: "المراجع", visitors: 625, percentage: 10 },
  ],
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(mockAnalytics)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("6months")

  useEffect(() => {
    // Simulate loading analytics data
    const loadAnalytics = async () => {
      try {
        setIsLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setAnalytics(mockAnalytics)
      } catch (error) {
        console.error("Error loading analytics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAnalytics()
  }, [selectedPeriod])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">التحليلات والإحصائيات</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">التحليلات والإحصائيات</h1>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs">
            <Calendar className="w-3 h-3 mr-1" />
            آخر 6 أشهر
          </Badge>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">إجمالي الإيرادات</p>
                <p className="text-2xl md:text-3xl font-bold">${analytics.overview.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">إجمالي الطلبات</p>
                <p className="text-2xl md:text-3xl font-bold">{analytics.overview.totalOrders.toLocaleString()}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">إجمالي العملاء</p>
                <p className="text-2xl md:text-3xl font-bold">{analytics.overview.totalCustomers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">إجمالي المنتجات</p>
                <p className="text-2xl md:text-3xl font-bold">{analytics.overview.totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              الإيرادات الشهرية
            </CardTitle>
            <CardDescription>تطور الإيرادات والطلبات خلال الأشهر الماضية</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} name="الإيرادات" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>توزيع الفئات</CardTitle>
            <CardDescription>توزيع المبيعات حسب فئات المنتجات</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.categoryDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {analytics.categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products and Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>أفضل المنتجات مبيعاً</CardTitle>
            <CardDescription>المنتجات الأكثر مبيعاً هذا الشهر</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} مبيعة</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${product.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              مصادر الزيارات
            </CardTitle>
            <CardDescription>من أين يأتي زوار موقعك</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.trafficSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MousePointer className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{source.source}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{source.visitors.toLocaleString()}</span>
                    <Badge variant="secondary">{source.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>معدل التحويل</CardTitle>
            <CardDescription>نسبة الزوار الذين يقومون بالشراء</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{analytics.overview.conversionRate}%</div>
              <p className="text-gray-500">من إجمالي الزوار</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>متوسط قيمة الطلب</CardTitle>
            <CardDescription>متوسط المبلغ المنفق في كل طلب</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">${analytics.overview.averageOrderValue}</div>
              <p className="text-gray-500">لكل طلب</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
