"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import * as XLSX from "xlsx"
import { toast } from "@/components/ui/use-toast"
import { ShoppingCart } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"

const STATUS_OPTIONS = ["مؤكد", "قيد المعالجة", "ملغى"]

export default function AdminOrdersPage() {
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

  const filteredOrders = showAll
    ? orders
    : orders.filter((o) => {
        if (!o.created_at) return false
        const orderDate = o.created_at.slice(0, 10)
        return orderDate === selectedDate
      })

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
                commune: order.delivery_type === "stopDesk" ? "" : order.commune,
                address: order.address,
                products: [
                  {
                    name: order.product_name,
                    size: order.size,
                    quantity: order.quantity,
                    price: order.price,
                  },
                ],
                deliveryType: order.delivery_type === "stopDesk" ? "office" : "home",
                totalAmount: order.total_amount,
              }),
            })
            const data = await response.json()
            if (response.ok) {
              toast({
                title: "تم إرسال الطلبية تلقائيًا إلى zr express",
                className: "bg-green-600 text-white font-bold text-center",
                duration: 3000,
              })
            } else {
              toast({
                title: "فشل إرسال الطلبية إلى zr express",
                description: data?.message || JSON.stringify(data),
                className: "bg-red-600 text-white font-bold text-center",
                duration: 5000,
              })
            }
          } catch (e: any) {
            toast({
              title: "فشل إرسال الطلبية إلى zr express",
              description: e.message,
              className: "bg-red-600 text-white font-bold text-center",
              duration: 5000,
            })
          }
        }
      }
      // إذا تم تغيير الحالة من مؤكد إلى غير مؤكد، أعد الكمية للمخزون (اعتمد على الحالة القديمة من قاعدة البيانات)
      if (oldOrder && oldOrder.status === "مؤكد" && status !== "مؤكد") {
        if (oldOrder.product_name && oldOrder.quantity) {
          const productName = oldOrder.product_name.split(" (x")[0]
          const { data: product } = await supabase
            .from("products")
            .select("id,stock_quantity")
            .eq("name", productName)
            .single()
          if (product && product.stock_quantity !== undefined) {
            const newStock = product.stock_quantity + oldOrder.quantity
            await supabase.from("products").update({ stock_quantity: newStock }).eq("id", product.id)
          }
        }
      }
    }
  }

  function exportToExcel() {
    const headers = [
      "العميل",
      "الهاتف",
      "المنتج",
      "الكمية",
      "المقاس",
      "السعر",
      "تكلفة الشحن",
      "الإجمالي",
      "الولاية",
      "البلدية",
      "العنوان",
      "نوع التوصيل",
      "الحالة",
      "تاريخ الإنشاء",
      "الفئة",
    ]
    const rows = orders.map((o) => [
      o.customer_name,
      o.phone_number,
      o.product_name,
      o.quantity,
      o.size,
      o.price,
      o.shipping_cost,
      o.total_amount,
      o.wilaya,
      o.commune,
      o.address,
      o.delivery_type,
      o.status,
      o.created_at,
      o.category,
    ])
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows])
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "الطلبات")
    XLSX.writeFile(workbook, "orders.xlsx")
  }

  return (
    <div className="w-full h-full overflow-auto">
      <main className="flex-1 flex flex-col items-center justify-center p-2 md:p-4 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="flex items-center gap-2 md:gap-4 mb-4 mt-3 md:mt-6 justify-center w-full">
            <ShoppingCart className="w-8 h-8 md:w-14 md:h-14 text-white drop-shadow-lg" />
            <h1 className="font-extrabold text-2xl md:text-5xl text-white drop-shadow-lg">إدارة الطلبات</h1>
          </div>

          <div className="w-full flex flex-col md:flex-row gap-2 md:gap-4 justify-center items-center mb-4 md:mb-6">
            <div className="flex gap-2 items-center justify-center w-full flex-wrap">
              <label className="font-bold text-sm md:text-base">تصفية حسب التاريخ:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value)
                  setShowAll(false)
                }}
                className="border rounded px-2 py-1 text-sm md:text-base"
              />
              <Button onClick={() => setShowAll(true)} variant={showAll ? "default" : "outline"} size="sm">
                عرض كل الطلبيات
              </Button>
              <Button onClick={fetchOrders} variant="outline" size="sm">
                تحديث
              </Button>
            </div>
            <Button
              onClick={exportToExcel}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold shadow px-4 md:px-6 py-2 rounded-lg md:rounded-xl hover:scale-105 transition text-sm md:text-base"
            >
              تحميل Excel
            </Button>
          </div>

          <div className="w-full flex flex-wrap gap-2 md:gap-4 justify-center items-center mb-4 md:mb-8">
            <div className="bg-gradient-to-r from-blue-100 to-blue-300 text-blue-900 rounded-xl px-3 md:px-6 py-2 md:py-4 font-bold text-sm md:text-lg shadow flex flex-col items-center min-w-[120px] md:min-w-[160px]">
              <span className="text-xs md:text-base">إجمالي الطلبات</span>
              <span className="text-lg md:text-2xl font-extrabold">{orders.length}</span>
            </div>
            <div className="bg-gradient-to-r from-green-100 to-green-300 text-green-900 rounded-xl px-3 md:px-6 py-2 md:py-4 font-bold text-sm md:text-lg shadow flex flex-col items-center min-w-[120px] md:min-w-[160px]">
              <span className="text-xs md:text-base">المؤكدة</span>
              <span className="text-lg md:text-2xl font-extrabold">
                {orders.filter((o) => o.status === "مؤكد").length}
              </span>
            </div>
            <div className="bg-gradient-to-r from-yellow-100 to-yellow-300 text-yellow-900 rounded-xl px-3 md:px-6 py-2 md:py-4 font-bold text-sm md:text-lg shadow flex flex-col items-center min-w-[120px] md:min-w-[160px]">
              <span className="text-xs md:text-base">قيد المعالجة</span>
              <span className="text-lg md:text-2xl font-extrabold">
                {orders.filter((o) => o.status === "قيد المعالجة").length}
              </span>
            </div>
            <div className="bg-gradient-to-r from-red-100 to-red-300 text-red-900 rounded-xl px-3 md:px-6 py-2 md:py-4 font-bold text-sm md:text-lg shadow flex flex-col items-center min-w-[120px] md:min-w-[160px]">
              <span className="text-xs md:text-base">الملغية</span>
              <span className="text-lg md:text-2xl font-extrabold">
                {orders.filter((o) => o.status === "ملغى").length}
              </span>
            </div>
          </div>

          <div className="flex-1 flex justify-center items-center w-full">
            {loading ? (
              <div className="text-gray-400 text-lg md:text-xl py-20 text-center">جاري التحميل...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-gray-400 text-lg md:text-xl py-20 text-center">لا توجد طلبات في هذا اليوم</div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="min-w-full border rounded-xl overflow-hidden bg-white text-center border-4 border-red-500 mx-auto text-xs md:text-base">
                  <thead className="bg-gradient-to-r from-purple-100 to-blue-100">
                    <tr>
                      <th className="p-2 md:p-3 text-xs md:text-sm">العميل</th>
                      <th className="p-2 md:p-3 text-xs md:text-sm">الهاتف</th>
                      <th className="p-2 md:p-3 text-xs md:text-sm">المنتج</th>
                      <th className="p-2 md:p-3 text-xs md:text-sm">الكمية</th>
                      <th className="p-2 md:p-3 text-xs md:text-sm">المقاس</th>
                      <th className="p-2 md:p-3 text-xs md:text-sm">السعر</th>
                      <th className="p-2 md:p-3 text-xs md:text-sm">تكلفة الشحن</th>
                      <th className="p-2 md:p-3 text-xs md:text-sm">الإجمالي</th>
                      <th className="p-2 md:p-3 text-xs md:text-sm">الولاية</th>
                      <th className="p-2 md:p-3 text-xs md:text-sm">البلدية</th>
                      <th className="p-2 md:p-3 text-xs md:text-sm">العنوان</th>
                      <th className="p-2 md:p-3 text-xs md:text-sm">نوع التوصيل</th>
                      <th className="p-2 md:p-3 text-xs md:text-sm">الحالة</th>
                      <th className="p-2 md:p-3 text-xs md:text-sm">تاريخ الإنشاء</th>
                      <th className="p-2 md:p-3 text-xs md:text-sm">الفئة</th>
                      <th className="p-2 md:p-3 text-xs md:text-sm">تغيير الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-purple-50 transition text-xs md:text-base">
                        <td className="py-2 md:py-4 px-1 md:px-3">{order.customer_name}</td>
                        <td className="py-2 md:py-4 px-1 md:px-3">
                          <div className="flex items-center gap-1 md:gap-2 justify-center flex-col md:flex-row">
                            <span className="text-xs md:text-sm">{order.phone_number}</span>
                            {order.phone_number && (
                              <a
                                href={`https://wa.me/213${order.phone_number.replace(/^0+/, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="تواصل عبر واتساب"
                                className="whatsapp-btn flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition p-1 md:p-2 shadow text-green-600 hover:text-green-700"
                                style={{ width: 28, height: 28 }}
                              >
                                <FaWhatsapp size={16} className="md:w-6 md:h-6" />
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="py-2 md:py-4 px-1 md:px-3 text-xs md:text-sm">{order.product_name}</td>
                        <td className="py-2 md:py-4 px-1 md:px-3">{order.quantity}</td>
                        <td className="p-1 md:p-2">{order.size}</td>
                        <td className="p-1 md:p-2">{order.price}</td>
                        <td className="p-1 md:p-2">{order.shipping_cost}</td>
                        <td className="p-1 md:p-2">{order.total_amount}</td>
                        <td className="p-1 md:p-2 text-xs md:text-sm">{order.wilaya}</td>
                        <td className="p-1 md:p-2 text-xs md:text-sm">{order.commune}</td>
                        <td className="p-1 md:p-2 text-xs md:text-sm">{order.address}</td>
                        <td className="p-1 md:p-2 text-xs md:text-sm">{order.delivery_type}</td>
                        <td className="p-1 md:p-2 font-bold">
                          <span
                            className={
                              order.status === "مؤكد"
                                ? "text-green-600"
                                : order.status === "ملغى"
                                  ? "text-red-500"
                                  : "text-yellow-600"
                            }
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="p-1 md:p-2 text-xs md:text-sm">
                          {order.created_at?.slice(0, 16).replace("T", " ")}
                        </td>
                        <td className="p-1 md:p-2 text-xs md:text-sm">{order.category}</td>
                        <td className="p-1 md:p-2">
                          <div className="flex gap-1 justify-center flex-col md:flex-row">
                            {STATUS_OPTIONS.map((st) => (
                              <Button
                                key={st}
                                size="sm"
                                className={`rounded-full px-2 md:px-3 py-1 text-xs font-bold transition-all duration-150 mb-1 md:mb-0
                                  ${
                                    order.status === st
                                      ? st === "مؤكد"
                                        ? "bg-green-500 text-white border-green-500"
                                        : st === "ملغى"
                                          ? "bg-red-500 text-white border-red-500"
                                          : "bg-blue-500 text-white border-blue-500"
                                      : st === "مؤكد"
                                        ? "bg-white text-green-600 border border-green-400 hover:bg-green-50"
                                        : st === "ملغى"
                                          ? "bg-white text-red-600 border border-red-400 hover:bg-red-50"
                                          : "bg-white text-blue-600 border border-blue-400 hover:bg-blue-50"
                                  }
                                `}
                                onClick={() => updateStatus(order.id, st)}
                                disabled={order.status === st}
                              >
                                {st}
                              </Button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
