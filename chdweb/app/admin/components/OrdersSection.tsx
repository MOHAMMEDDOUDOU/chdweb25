"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Download, Phone, MapPin, Calendar, User } from "lucide-react"
import * as XLSX from "xlsx"
import { toast } from "@/components/ui/use-toast"
import { FaWhatsapp } from "react-icons/fa"

const STATUS_OPTIONS = ["مؤكد", "قيد المعالجة", "ملغى"]

export default function OrdersSection() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date()
    const yyyy = now.getFullYear()
    const mm = String(now.getMonth() + 1).padStart(2, "0")
    const dd = String(now.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
  })
  const [showAll, setShowAll] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredOrders = showAll
    ? orders.filter(order => 
        order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone_number?.includes(searchTerm) ||
        order.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : orders.filter((o) => {
        if (!o.created_at) return false
        const orderDate = o.created_at.slice(0, 10)
        return orderDate === selectedDate
      }).filter(order => 
        order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone_number?.includes(searchTerm) ||
        order.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )

  useEffect(() => {
    fetchOrders()
    // ريال تايم
    const subscription = supabase
      .channel("orders-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        fetchOrders()
      })
      .subscribe()
    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  async function fetchOrders() {
    setLoading(true)
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })
    if (!error && data) setOrders(data)
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    // جلب الطلب الحالي من قاعدة البيانات قبل التحديث
    const { data: oldOrder } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: false })
      .eq("id", id)
      .single()
    const { error } = await supabase.from("orders").update({ status }).eq("id", id)
    if (!error) {
      setOrders((orders) => orders.map((o) => (o.id === id ? { ...o, status } : o)))
      let color = ""
      if (status === "مؤكد") color = "bg-green-500 text-white"
      else if (status === "ملغى") color = "bg-red-500 text-white"
      else color = "bg-blue-500 text-white"
      toast({
        title: `تم تغيير حالة الطلبية`,
        description: `الحالة الجديدة: ${status}`,
        className: color + " font-bold text-center",
        duration: 2500,
      })
      // إذا تم التأكيد، أرسل الطلبية إلى zr express
      if (status === "مؤكد") {
        const order = orders.find((o) => o.id === id)
        if (order) {
          // خصم الكمية من المخزون
          if (order.product_name && order.quantity) {
            const productName = order.product_name.split(" (x")[0]
            const { data: product } = await supabase
              .from("products")
              .select("id,stock_quantity")
              .eq("name", productName)
              .single()
            if (product && product.stock_quantity !== undefined) {
              const newStock = Math.max(0, product.stock_quantity - order.quantity)
              await supabase.from("products").update({ stock_quantity: newStock }).eq("id", product.id)
            }
          }
          try {
            const response = await fetch("/api/zr-express", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                customerName: order.customer_name,
                customerPhone: order.phone_number,
                wilaya: order.wilaya,
                commune: order.commune,
                address: order.address,
                productName: order.product_name,
                quantity: order.quantity,
                totalAmount: order.total_amount,
              }),
            })
            if (response.ok) {
              toast({
                title: "تم إرسال الطلبية إلى ZR Express",
                className: "bg-blue-500 text-white",
              })
            }
          } catch (error) {
            console.error("Error sending to ZR Express:", error)
          }
        }
      }
    } else {
      toast({
        title: "خطأ في تحديث حالة الطلبية",
        className: "bg-red-500 text-white",
      })
    }
  }

  const exportToExcel = () => {
    const dataToExport = filteredOrders.map((order) => ({
      "اسم العميل": order.customer_name,
      "رقم الهاتف": order.phone_number,
      "الولاية": order.wilaya,
      "البلدية": order.commune,
      "العنوان": order.address,
      "اسم المنتج": order.product_name,
      "الكمية": order.quantity,
      "السعر الإجمالي": order.total_amount,
      "الحالة": order.status,
      "تاريخ الطلب": new Date(order.created_at).toLocaleDateString("ar-SA"),
    }))

    const ws = XLSX.utils.json_to_sheet(dataToExport)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "الطلبات")
    XLSX.writeFile(wb, `طلبات_${selectedDate}.xlsx`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "مؤكد":
        return "bg-green-100 text-green-800"
      case "قيد المعالجة":
        return "bg-blue-100 text-blue-800"
      case "ملغى":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">إدارة الطلبات</h2>
          <p className="text-gray-600">تتبع وإدارة طلبات العملاء</p>
        </div>
        <Button onClick={exportToExcel} className="bg-blue-500 hover:bg-blue-600">
          <Download className="h-4 w-4 ml-2" />
          تصدير إلى Excel
        </Button>
      </div>

      {/* فلاتر البحث */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            البحث والفلترة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>البحث في الطلبات</Label>
              <Input
                placeholder="ابحث بالاسم، الهاتف، أو المنتج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label>تاريخ الطلب</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                disabled={showAll}
              />
            </div>
            <div className="flex items-end">
              <Button
                variant={showAll ? "default" : "outline"}
                onClick={() => setShowAll(!showAll)}
                className="w-full"
              >
                {showAll ? "عرض طلبات اليوم" : "عرض جميع الطلبات"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* قائمة الطلبات */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">جاري تحميل الطلبات...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <h3 className="font-semibold text-lg">{order.customer_name}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{order.phone_number}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{order.wilaya} - {order.commune}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(order.created_at).toLocaleDateString("ar-SA")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`https://wa.me/${order.phone_number}?text=مرحباً ${order.customer_name}، نود التواصل معك بخصوص طلبك`, '_blank')}
                    >
                      <FaWhatsapp className="h-4 w-4 text-green-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">المنتج:</span>
                    <span>{order.product_name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">الكمية:</span>
                    <span>{order.quantity}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">السعر الإجمالي:</span>
                    <span className="font-bold text-lg">{order.total_amount} دج</span>
                  </div>
                  {order.address && (
                    <div className="flex justify-between items-start">
                      <span className="font-medium">العنوان:</span>
                      <span className="text-right max-w-xs">{order.address}</span>
                    </div>
                  )}
                  
                  {/* تغيير الحالة */}
                  <div className="flex gap-2 pt-3 border-t">
                    <span className="font-medium">تغيير الحالة:</span>
                    {STATUS_OPTIONS.map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={order.status === status ? "default" : "outline"}
                        onClick={() => updateStatus(order.id, status)}
                        className={order.status === status ? "" : "hover:bg-gray-100"}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">
                {showAll ? "لا توجد طلبات" : `لا توجد طلبات في تاريخ ${selectedDate}`}
              </p>
            </div>
          )}
        </div>
      )}

      {/* إحصائيات سريعة */}
      <Card>
        <CardHeader>
          <CardTitle>إحصائيات الطلبات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.status === "مؤكد").length}
              </div>
              <div className="text-sm text-green-600">طلبات مؤكدة</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {orders.filter(o => o.status === "قيد المعالجة").length}
              </div>
              <div className="text-sm text-blue-600">قيد المعالجة</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {orders.filter(o => o.status === "ملغى").length}
              </div>
              <div className="text-sm text-red-600">طلبات ملغية</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {orders.reduce((sum, o) => sum + (o.total_amount || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-orange-600">إجمالي المبيعات (دج)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
