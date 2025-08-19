"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { GlassContainer } from "@/components/GlassContainer"
import {
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  BarChart3,
  Download,
} from "lucide-react"

export default function AnalyticsDashboard() {
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })

      // Fetch products
      const { data: productsData, error: productsError } = await supabase.from("products").select("*")

      if (!ordersError && ordersData) setOrders(ordersData)
      if (!productsError && productsData) setProducts(productsData)

      setLoading(false)
    }
    fetchData()
  }, [])

  // Calculate analytics
  const totalOrders = orders.length
  const totalProducts = products.length
  const confirmedOrders = orders.filter((o) => o.status === "مؤكد").length
  const processingOrders = orders.filter((o) => o.status === "قيد المعالجة").length
  const cancelledOrders = orders.filter((o) => o.status === "ملغى").length
  const totalRevenue = orders
    .filter((o) => o.status === "مؤكد")
    .reduce((sum, o) => sum + (o.total_amount || o.total || 0), 0)

  const averageOrderValue = confirmedOrders > 0 ? totalRevenue / confirmedOrders : 0
  const lowStockProducts = products.filter((p) => (p.stock_quantity || 0) < 10).length
  const outOfStockProducts = products.filter((p) => (p.stock_quantity || 0) === 0).length

  // Recent orders (last 5)
  const recentOrders = orders.slice(0, 5)

  // دالة تحميل التقرير الشامل
  const downloadReport = () => {
    const reportDate = new Date().toLocaleDateString("ar-DZ")
    const reportTime = new Date().toLocaleTimeString("ar-DZ")

    const reportHTML = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تقرير شامل - Cosmétique Beauty</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 20px;
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
                background: white;
                border-radius: 15px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .header h1 {
                font-size: 2.5rem;
                margin-bottom: 10px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            .header p {
                font-size: 1.1rem;
                opacity: 0.9;
            }
            .content {
                padding: 30px;
            }
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 40px;
            }
            .stat-card {
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                padding: 25px;
                border-radius: 12px;
                text-align: center;
                border-left: 5px solid;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            .stat-card.blue { border-left-color: #3b82f6; }
            .stat-card.purple { border-left-color: #8b5cf6; }
            .stat-card.green { border-left-color: #10b981; }
            .stat-card.orange { border-left-color: #f59e0b; }
            .stat-card.emerald { border-left-color: #059669; }
            .stat-card.yellow { border-left-color: #eab308; }
            .stat-card.red { border-left-color: #ef4444; }
            .stat-card.amber { border-left-color: #f59e0b; }
            .stat-card.rose { border-left-color: #f43f5e; }
            
            .stat-number {
                font-size: 2.5rem;
                font-weight: bold;
                margin: 10px 0;
            }
            .stat-label {
                font-size: 1.1rem;
                color: #666;
                font-weight: 600;
            }
            .section {
                margin-bottom: 40px;
            }
            .section-title {
                font-size: 1.8rem;
                color: #333;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 3px solid #667eea;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .table-container {
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }
            th {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px;
                text-align: right;
                font-weight: 600;
            }
            td {
                padding: 12px 15px;
                border-bottom: 1px solid #eee;
            }
            tr:nth-child(even) {
                background-color: #f8f9fa;
            }
            tr:hover {
                background-color: #e3f2fd;
            }
            .status {
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 0.85rem;
                font-weight: 600;
            }
            .status.confirmed { background: #d1fae5; color: #065f46; }
            .status.processing { background: #fef3c7; color: #92400e; }
            .status.cancelled { background: #fee2e2; color: #991b1b; }
            .status.available { background: #d1fae5; color: #065f46; }
            .status.low-stock { background: #fef3c7; color: #92400e; }
            .status.out-of-stock { background: #fee2e2; color: #991b1b; }
            .footer {
                text-align: center;
                padding: 20px;
                background: #f8f9fa;
                color: #666;
                font-size: 0.9rem;
            }
            @media print {
                body { background: white; padding: 0; }
                .container { box-shadow: none; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🌟 تقرير شامل - Cosmétique Beauty</h1>
                <p>تاريخ التقرير: ${reportDate} - الوقت: ${reportTime}</p>
            </div>
            
            <div class="content">
                <!-- الإحصائيات الرئيسية -->
                <div class="section">
                    <h2 class="section-title">📊 الإحصائيات الرئيسية</h2>
                    <div class="stats-grid">
                        <div class="stat-card blue">
                            <div class="stat-label">إجمالي الطلبات</div>
                            <div class="stat-number">${totalOrders}</div>
                        </div>
                        <div class="stat-card purple">
                            <div class="stat-label">إجمالي المنتجات</div>
                            <div class="stat-number">${totalProducts}</div>
                        </div>
                        <div class="stat-card green">
                            <div class="stat-label">إجمالي الإيرادات</div>
                            <div class="stat-number">${totalRevenue.toLocaleString()} دج</div>
                        </div>
                        <div class="stat-card orange">
                            <div class="stat-label">متوسط قيمة الطلب</div>
                            <div class="stat-number">${averageOrderValue.toLocaleString()} دج</div>
                        </div>
                    </div>
                </div>

                <!-- إحصائيات الطلبات -->
                <div class="section">
                    <h2 class="section-title">📋 تفصيل حالات الطلبات</h2>
                    <div class="stats-grid">
                        <div class="stat-card emerald">
                            <div class="stat-label">الطلبات المؤكدة</div>
                            <div class="stat-number">${confirmedOrders}</div>
                        </div>
                        <div class="stat-card yellow">
                            <div class="stat-label">قيد المعالجة</div>
                            <div class="stat-number">${processingOrders}</div>
                        </div>
                        <div class="stat-card red">
                            <div class="stat-label">الطلبات الملغية</div>
                            <div class="stat-number">${cancelledOrders}</div>
                        </div>
                    </div>
                </div>

                <!-- تنبيهات المخزون -->
                <div class="section">
                    <h2 class="section-title">⚠️ تنبيهات المخزون</h2>
                    <div class="stats-grid">
                        <div class="stat-card amber">
                            <div class="stat-label">منتجات قليلة المخزون</div>
                            <div class="stat-number">${lowStockProducts}</div>
                            <div style="font-size: 0.9rem; color: #666; margin-top: 5px;">أقل من 10 قطع</div>
                        </div>
                        <div class="stat-card rose">
                            <div class="stat-label">منتجات نفدت من المخزون</div>
                            <div class="stat-number">${outOfStockProducts}</div>
                            <div style="font-size: 0.9rem; color: #666; margin-top: 5px;">تحتاج إعادة تخزين</div>
                        </div>
                    </div>
                </div>

                <!-- جدول الطلبات -->
                <div class="section">
                    <h2 class="section-title">🛒 تفاصيل جميع الطلبات</h2>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>رقم الطلب</th>
                                    <th>اسم العميل</th>
                                    <th>رقم الهاتف</th>
                                    <th>الولاية</th>
                                    <th>البلدية</th>
                                    <th>المبلغ الإجمالي</th>
                                    <th>الحالة</th>
                                    <th>تاريخ الطلب</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${orders
                                  .map(
                                    (order, index) => `
                                    <tr>
                                        <td>#${order.id || index + 1}</td>
                                        <td>${order.customer_name || "غير محدد"}</td>
                                        <td>${order.customer_phone || "غير محدد"}</td>
                                        <td>${order.wilaya || "غير محدد"}</td>
                                        <td>${order.commune || "غير محدد"}</td>
                                        <td>${(order.total_amount || order.total || 0).toLocaleString()} دج</td>
                                        <td>
                                            <span class="status ${order.status === "مؤكد" ? "confirmed" : order.status === "قيد المعالجة" ? "processing" : "cancelled"}">
                                                ${order.status || "غير محدد"}
                                            </span>
                                        </td>
                                        <td>${order.created_at ? new Date(order.created_at).toLocaleDateString("ar-DZ") : "غير محدد"}</td>
                                    </tr>
                                `,
                                  )
                                  .join("")}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- جدول المنتجات -->
                <div class="section">
                    <h2 class="section-title">📦 تفاصيل جميع المنتجات</h2>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>اسم المنتج</th>
                                    <th>الفئة</th>
                                    <th>السعر</th>
                                    <th>المخزون</th>
                                    <th>حالة المخزون</th>
                                    <th>تاريخ الإضافة</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${products
                                  .map(
                                    (product) => `
                                    <tr>
                                        <td>${product.name || "غير محدد"}</td>
                                        <td>${product.category || "غير محدد"}</td>
                                        <td>${(product.price || 0).toLocaleString()} دج</td>
                                        <td>${product.stock_quantity || 0}</td>
                                        <td>
                                            <span class="status ${(product.stock_quantity || 0) === 0 ? "out-of-stock" : (product.stock_quantity || 0) < 10 ? "low-stock" : "available"}">
                                                ${(product.stock_quantity || 0) === 0 ? "نفد من المخزون" : (product.stock_quantity || 0) < 10 ? "مخزون قليل" : "متوفر"}
                                            </span>
                                        </td>
                                        <td>${product.created_at ? new Date(product.created_at).toLocaleDateString("ar-DZ") : "غير محدد"}</td>
                                    </tr>
                                `,
                                  )
                                  .join("")}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <p>© 2024 Cosmétique Beauty - جميع الحقوق محفوظة</p>
                <p>تم إنشاء هذا التقرير تلقائياً من نظام إدارة المتجر</p>
            </div>
        </div>
    </body>
    </html>
    `

    // إنشاء ملف HTML وتحميله
    const blob = new Blob([reportHTML], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `تقرير-شامل-${new Date().toISOString().split("T")[0]}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full overflow-auto">
      <div className="max-w-7xl mx-auto p-3 md:p-6">
        {/* زر تحميل التقرير */}
        <div className="mb-4 md:mb-6 flex justify-center">
          <button
            onClick={downloadReport}
            className="flex items-center gap-2 md:gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 md:px-8 py-2 md:py-4 rounded-lg md:rounded-xl font-semibold text-sm md:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Download className="w-4 h-4 md:w-6 md:h-6" />
            <span className="hidden sm:inline">تحميل تقرير شامل</span>
            <span className="sm:hidden">تحميل التقرير</span>
          </button>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-4 md:mb-8">
          {/* Total Orders */}
          <GlassContainer className="p-3 md:p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-blue-600 mb-1">إجمالي الطلبات</p>
                <p className="text-xl md:text-3xl font-bold text-blue-800">{totalOrders}</p>
              </div>
              <div className="p-2 md:p-3 bg-blue-500 rounded-full">
                <ShoppingCart className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
            </div>
          </GlassContainer>

          {/* Total Products */}
          <GlassContainer className="p-3 md:p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-purple-600 mb-1">إجمالي المنتجات</p>
                <p className="text-xl md:text-3xl font-bold text-purple-800">{totalProducts}</p>
              </div>
              <div className="p-2 md:p-3 bg-purple-500 rounded-full">
                <Package className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
            </div>
          </GlassContainer>

          {/* Total Revenue */}
          <GlassContainer className="p-3 md:p-6 bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-green-600 mb-1">إجمالي الإيرادات</p>
                <p className="text-lg md:text-3xl font-bold text-green-800">{totalRevenue.toLocaleString()} دج</p>
              </div>
              <div className="p-2 md:p-3 bg-green-500 rounded-full">
                <DollarSign className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
            </div>
          </GlassContainer>

          {/* Average Order Value */}
          <GlassContainer className="p-3 md:p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-orange-600 mb-1">متوسط قيمة الطلب</p>
                <p className="text-lg md:text-3xl font-bold text-orange-800">{averageOrderValue.toLocaleString()} دج</p>
              </div>
              <div className="p-2 md:p-3 bg-orange-500 rounded-full">
                <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
            </div>
          </GlassContainer>
        </div>

        {/* Order Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-8">
          {/* Confirmed Orders */}
          <GlassContainer className="p-3 md:p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-emerald-600 mb-1">الطلبات المؤكدة</p>
                <p className="text-xl md:text-3xl font-bold text-emerald-800">{confirmedOrders}</p>
              </div>
              <div className="p-2 md:p-3 bg-emerald-500 rounded-full">
                <CheckCircle className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
            </div>
          </GlassContainer>

          {/* Processing Orders */}
          <GlassContainer className="p-3 md:p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-yellow-600 mb-1">قيد المعالجة</p>
                <p className="text-xl md:text-3xl font-bold text-yellow-800">{processingOrders}</p>
              </div>
              <div className="p-2 md:p-3 bg-yellow-500 rounded-full">
                <Clock className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
            </div>
          </GlassContainer>

          {/* Cancelled Orders */}
          <GlassContainer className="p-3 md:p-6 bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-red-600 mb-1">الطلبات الملغية</p>
                <p className="text-xl md:text-3xl font-bold text-red-800">{cancelledOrders}</p>
              </div>
              <div className="p-2 md:p-3 bg-red-500 rounded-full">
                <XCircle className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
            </div>
          </GlassContainer>
        </div>

        {/* Stock Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 mb-4 md:mb-8">
          {/* Low Stock */}
          <GlassContainer className="p-3 md:p-6 bg-gradient-to-br from-amber-50 to-amber-100 border-l-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-amber-600 mb-1">منتجات قليلة المخزون</p>
                <p className="text-xl md:text-3xl font-bold text-amber-800">{lowStockProducts}</p>
                <p className="text-xs text-amber-600 mt-1">أقل من 10 قطع</p>
              </div>
              <div className="p-2 md:p-3 bg-amber-500 rounded-full">
                <AlertTriangle className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
            </div>
          </GlassContainer>

          {/* Out of Stock */}
          <GlassContainer className="p-3 md:p-6 bg-gradient-to-br from-rose-50 to-rose-100 border-l-4 border-rose-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-rose-600 mb-1">منتجات نفدت من المخزون</p>
                <p className="text-xl md:text-3xl font-bold text-rose-800">{outOfStockProducts}</p>
                <p className="text-xs text-rose-600 mt-1">تحتاج إعادة تخزين</p>
              </div>
              <div className="p-2 md:p-3 bg-rose-500 rounded-full">
                <Package className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
            </div>
          </GlassContainer>
        </div>

        {/* Recent Orders */}
        <GlassContainer className="p-3 md:p-6 bg-white/70 backdrop-blur-sm">
          <div className="flex items-center mb-3 md:mb-4">
            <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-gray-600 mr-2" />
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">الطلبات الأخيرة</h2>
          </div>

          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-right py-2 px-2 md:px-4 font-medium text-gray-600">رقم الطلب</th>
                    <th className="text-right py-2 px-2 md:px-4 font-medium text-gray-600">العميل</th>
                    <th className="text-right py-2 px-2 md:px-4 font-medium text-gray-600">المبلغ</th>
                    <th className="text-right py-2 px-2 md:px-4 font-medium text-gray-600">الحالة</th>
                    <th className="text-right py-2 px-2 md:px-4 font-medium text-gray-600">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr key={order.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 md:py-3 px-2 md:px-4 font-medium">#{order.id || index + 1}</td>
                      <td className="py-2 md:py-3 px-2 md:px-4">{order.customer_name || "غير محدد"}</td>
                      <td className="py-2 md:py-3 px-2 md:px-4">
                        {(order.total_amount || order.total || 0).toLocaleString()} دج
                      </td>
                      <td className="py-2 md:py-3 px-2 md:px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === "مؤكد"
                              ? "bg-green-100 text-green-800"
                              : order.status === "قيد المعالجة"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "ملغى"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status || "غير محدد"}
                        </span>
                      </td>
                      <td className="py-2 md:py-3 px-2 md:px-4 text-gray-600">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString("ar-DZ") : "غير محدد"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-3 opacity-50" />
              <p>لا توجد طلبات حتى الآن</p>
            </div>
          )}
        </GlassContainer>
      </div>
    </div>
  )
}
