"use client"
import { useEffect, useMemo, useState } from "react"
import { Plus, Pencil, Trash2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import MultiImageUpload from "@/components/MultiImageUpload"

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ 
    name: "", 
    price: "", 
    discount_price: "", 
    stock: "", 
    sizes: [] as string[], 
    images: [] as string[], 
    description: "" 
  })
  const [errors, setErrors] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  
  // States for optional fields visibility
  const [showDiscountPrice, setShowDiscountPrice] = useState(false)
  const [showSizes, setShowSizes] = useState(false)
  const [showImages, setShowImages] = useState(false)
  const [showDescription, setShowDescription] = useState(false)

  useEffect(() => {
    fetchOffers()
    const es = new EventSource('/api/realtime')
    es.onmessage = () => fetchOffers()
    return () => es.close()
  }, [])

  async function fetchOffers() {
    setLoading(true)
    try {
      const res = await fetch('/api/offers')
      if (res.ok) {
        const data = await res.json()
        setOffers(data)
      }
    } finally {
      setLoading(false)
    }
  }

  const categories = useMemo(() => Array.from(new Set(offers.map((p) => p.category).filter(Boolean))), [offers])

  return (
    <div className="w-full h-full overflow-auto">
      <div className="flex flex-col items-center w-full py-6 md:py-12 px-2 md:px-4 max-w-7xl mx-auto">
        <div className="w-full max-w-5xl flex items-center justify-center mb-6">
          <div className="flex items-center gap-3">
            <Package className="w-10 h-10 text-white" />
            <h1 className="font-extrabold text-3xl text-white">إدارة العروض</h1>
          </div>
        </div>

        <div className="w-full flex justify-center mb-6">
          <Button 
            onClick={() => { 
              setShowForm(true); 
              setEditId(null); 
              setForm({ 
                name: "", 
                price: "", 
                discount_price: "", 
                stock: "", 
                sizes: [], 
                images: [], 
                description: "" 
              })
              // Reset optional fields visibility
              setShowDiscountPrice(false)
              setShowSizes(false)
              setShowImages(false)
              setShowDescription(false)
            }} 
            className="bg-emerald-600 text-white"
          >
            <Plus size={16} /> أضف عرض
          </Button>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setShowForm(false)} className="absolute left-3 top-3 text-gray-400 hover:text-red-500 text-2xl font-bold">×</button>
              <h2 className="text-2xl font-extrabold text-center mb-4 text-emerald-700">{editId ? "تعديل العرض" : "إضافة عرض"}</h2>
              <form onSubmit={async (e) => {
                e.preventDefault()
                const errs: any = {}
                if (!form.name) errs.name = "الاسم مطلوب"
                if (!form.price) errs.price = "السعر مطلوب"
                if (!form.stock) errs.stock = "كمية المخزون مطلوبة"
                if (form.discount_price && Number(form.discount_price) >= Number(form.price)) errs.discount_price = "سعر الخصم يجب أن يكون أقل من السعر الأصلي"
                setErrors(errs)
                if (Object.keys(errs).length > 0) return
                setSubmitting(true)
                const payload = {
                  name: form.name,
                  price: Number(form.price),
                  discount_price: form.discount_price ? Number(form.discount_price) : null,
                  stock_quantity: Number(form.stock),
                  description: form.description || null,
                  sizes: form.sizes.length ? form.sizes : null,
                  images: form.images.length ? form.images : null,
                }
                let ok = true
                if (editId) {
                  const res = await fetch(`/api/offers/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
                  ok = res.ok
                } else {
                  const res = await fetch('/api/offers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
                  ok = res.ok
                }
                setSubmitting(false)
                if (ok) {
                  setShowForm(false)
                  setForm({ name: "", price: "", discount_price: "", stock: "", sizes: [], images: [], description: "" })
                  setErrors({})
                  setEditId(null)
                  fetchOffers()
                } else {
                  setErrors({ submit: "حدث خطأ أثناء الحفظ" })
                }
              }} className="flex flex-col gap-3">
                <div>
                  <label className="block font-bold mb-1">اسم العرض *</label>
                  <input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border rounded-lg px-3 py-2" />
                  {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                </div>
                <div>
                  <label className="block font-bold mb-1">السعر *</label>
                  <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))} className="w-full border rounded-lg px-3 py-2" />
                  {errors.price && <div className="text-red-500 text-sm mt-1">{errors.price}</div>}
                </div>

                {/* سعر الخصم - اختياري */}
                {!showDiscountPrice ? (
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowDiscountPrice(true)}
                      className="text-sm text-gray-600 border-dashed border-2 border-gray-300 hover:border-gray-400"
                    >
                      + إضافة سعر الخصم
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold">سعر الخصم</label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowDiscountPrice(false)
                          setForm((f) => ({ ...f, discount_price: "" }))
                        }}
                        className="text-red-500 text-sm hover:text-red-700"
                      >
                        إزالة
                      </button>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.discount_price}
                      onChange={(e) => setForm(f => ({ ...f, discount_price: e.target.value }))}
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="أدخل سعر الخصم"
                    />
                    {errors.discount_price && <div className="text-red-500 text-sm mt-1">{errors.discount_price}</div>}
                  </div>
                )}

                <div>
                  <label className="block font-bold mb-1">كمية المخزون *</label>
                  <input type="number" min="0" value={form.stock} onChange={(e) => setForm(f => ({ ...f, stock: e.target.value }))} className="w-full border rounded-lg px-3 py-2" />
                  {errors.stock && <div className="text-red-500 text-sm mt-1">{errors.stock}</div>}
                </div>

                {/* الوصف - اختياري */}
                {!showDescription ? (
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowDescription(true)}
                      className="text-sm text-gray-600 border-dashed border-2 border-gray-300 hover:border-gray-400"
                    >
                      + إضافة وصف
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold">الوصف</label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowDescription(false)
                          setForm((f) => ({ ...f, description: "" }))
                        }}
                        className="text-red-500 text-sm hover:text-red-700"
                      >
                        إزالة
                      </button>
                    </div>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                      className="w-full border rounded-lg px-3 py-2"
                      rows={3}
                      placeholder="أدخل وصف العرض"
                    />
                  </div>
                )}

                {/* المقاسات - اختياري */}
                {!showSizes ? (
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowSizes(true)}
                      className="text-sm text-gray-600 border-dashed border-2 border-gray-300 hover:border-gray-400"
                    >
                      + إضافة المقاسات
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold">المقاسات</label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowSizes(false)
                          setForm((f) => ({ ...f, sizes: [] }))
                        }}
                        className="text-red-500 text-sm hover:text-red-700"
                      >
                        إزالة
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-gray-50">
                      {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                        <label key={size} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={form.sizes.includes(size)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setForm((f) => ({ ...f, sizes: [...f.sizes, size] }))
                              } else {
                                setForm((f) => ({ ...f, sizes: f.sizes.filter(s => s !== size) }))
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{size}</span>
                        </label>
                      ))}
                    </div>
                    {form.sizes.length > 0 && (
                      <div className="mt-2 text-sm text-gray-600">
                        المقاسات المختارة: {form.sizes.join(", ")}
                      </div>
                    )}
                  </div>
                )}

                {/* صور العرض - اختياري */}
                {!showImages ? (
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowImages(true)}
                      className="text-sm text-gray-600 border-dashed border-2 border-gray-300 hover:border-gray-400"
                    >
                      + إضافة صور العرض
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold">صور العرض</label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowImages(false)
                          setForm((f) => ({ ...f, images: [] }))
                        }}
                        className="text-red-500 text-sm hover:text-red-700"
                      >
                        إزالة
                      </button>
                    </div>
                    <MultiImageUpload
                      onImagesUploaded={(imageUrls) => setForm((f) => ({ ...f, images: imageUrls }))}
                      currentImages={form.images}
                      maxImages={10}
                    />
                  </div>
                )}

                {errors.submit && <div className="text-red-500 text-center font-bold text-sm">{errors.submit}</div>}
                <Button type="submit" disabled={submitting} className="bg-emerald-600 text-white">{submitting ? "جاري الحفظ..." : (editId ? "تحديث العرض" : "حفظ العرض")}</Button>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-gray-400 text-lg py-20">جاري التحميل...</div>
        ) : offers.length === 0 ? (
          <div className="text-gray-400 text-lg py-20">لا توجد عروض</div>
        ) : (
          <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {offers.map((offer) => (
              <div key={offer.id} className="bg-[#f7f7fa] rounded-2xl shadow-lg overflow-hidden flex flex-col">
                <div className="relative w-full h-40 bg-gray-200">
                  <img src={offer.image_url || "/placeholder.jpg"} alt={offer.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex-1">
                  <div className="font-bold text-black mb-1">{offer.name}</div>
                  <div className="text-orange-600 font-extrabold text-xl mb-2">{offer.price} دج</div>
                </div>
                <div className="flex items-center gap-2 px-4 pb-4">
                  <button className="flex-1 bg-white border rounded-lg py-2 text-sm" onClick={() => { 
                    setShowForm(true); 
                    setEditId(offer.id); 
                    setForm({ 
                      name: offer.name, 
                      price: String(offer.price), 
                      discount_price: offer.discount_price ? String(offer.discount_price) : "", 
                      stock: String(offer.stock_quantity), 
                      sizes: offer.sizes || [], 
                      images: offer.images || [], 
                      description: offer.description || "" 
                    })
                    // Set optional fields visibility based on existing data
                    setShowDiscountPrice(!!offer.discount_price)
                    setShowSizes(!!offer.sizes && offer.sizes.length > 0)
                    setShowImages(!!offer.images && offer.images.length > 0)
                    setShowDescription(!!offer.description)
                  }}>
                    <Pencil size={14} /> تعديل
                  </button>
                  <button className="bg-red-500 text-white rounded-lg p-2" onClick={async () => { if (confirm('حذف العرض؟')) { await fetch(`/api/offers/${offer.id}`, { method: 'DELETE' }); fetchOffers() }}}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
