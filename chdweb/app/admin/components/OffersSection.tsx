"use client"
import { useEffect, useState, useMemo } from "react"
import { Plus, Pencil, Trash2, Tag, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import MultiImageUpload from "@/components/MultiImageUpload"
import { toast } from "@/components/ui/use-toast"

interface Offer {
  id: string
  name: string
  description?: string
  price: number
  discount_price?: number
  discount_percentage?: number
  image_url?: string
  stock_quantity: number
  sizes?: string[]
  images?: string[]
  category?: string
  is_active: boolean
}

export default function OffersSection() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discount_price: "",
    stock_quantity: "",
    sizes: [] as string[],
    images: [] as string[],
    is_active: true,
  })
  const [errors, setErrors] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  
  // States for optional fields visibility
  const [showDiscountPrice, setShowDiscountPrice] = useState(false)
  const [showSizes, setShowSizes] = useState(false)
  const [showImages, setShowImages] = useState(false)
  const [showDescription, setShowDescription] = useState(false)

  useEffect(() => {
    fetchOffers()
  }, [])

  // التحديث الفوري عبر SSE
  useEffect(() => {
    const es = new EventSource('/api/realtime')
    es.onmessage = () => fetchOffers()
    return () => es.close()
  }, [])

  async function fetchOffers() {
    setLoading(true)
    try {
      const response = await fetch('/api/offers')
      if (response.ok) {
        const data = await response.json()
        setOffers(data)
      } else {
        console.error('Failed to fetch offers')
      }
    } catch (error) {
      console.error('Error fetching offers:', error)
    }
    setLoading(false)
  }

  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      if (searchTerm && !offer.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
      return true
    })
  }, [offers, searchTerm])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: any = {}
    if (!form.name) errs.name = "الاسم مطلوب"
    if (!form.price) errs.price = "السعر مطلوب"
    if (!form.stock_quantity) errs.stock_quantity = "كمية المخزون مطلوبة"
    if (form.discount_price && Number(form.discount_price) >= Number(form.price)) {
      errs.discount_price = "سعر الخصم يجب أن يكون أقل من السعر الأصلي"
    }
    
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSubmitting(true)
    try {
      const payload = {
        name: form.name,
        description: showDescription ? form.description : undefined,
        price: Number(form.price),
        discount_price: showDiscountPrice && form.discount_price ? Number(form.discount_price) : undefined,
        stock_quantity: Number(form.stock_quantity),
        sizes: showSizes && form.sizes.length > 0 ? form.sizes : undefined,
        images: showImages && form.images.length > 0 ? form.images : undefined,
        is_active: form.is_active,
      }

      const url = editId ? `/api/offers/${editId}` : '/api/offers'
      const method = editId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast({
          title: editId ? "تم تحديث العرض بنجاح" : "تم إضافة العرض بنجاح",
          className: "bg-green-500 text-white",
        })
        setShowForm(false)
        setForm({
          name: "",
          description: "",
          price: "",
          discount_price: "",
          stock_quantity: "",
          sizes: [],
          images: [],
          is_active: true,
        })
        setEditId(null)
        fetchOffers()
      } else {
        throw new Error('Failed to save offer')
      }
    } catch (error) {
      toast({
        title: "خطأ في حفظ العرض",
        description: "يرجى المحاولة مرة أخرى",
        className: "bg-red-500 text-white",
      })
    }
    setSubmitting(false)
  }

  const handleEdit = (offer: Offer) => {
    setEditId(offer.id)
    setForm({
      name: offer.name,
      description: offer.description || "",
      price: offer.price.toString(),
      discount_price: offer.discount_price?.toString() || "",
      stock_quantity: offer.stock_quantity.toString(),
      sizes: offer.sizes || [],
      images: offer.images || [],
      is_active: offer.is_active,
    })
    setShowDiscountPrice(!!offer.discount_price)
    setShowSizes(!!offer.sizes?.length)
    setShowImages(!!offer.images?.length)
    setShowDescription(!!offer.description)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العرض؟')) return

    try {
      const response = await fetch(`/api/offers/${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast({
          title: "تم حذف العرض بنجاح",
          className: "bg-green-500 text-white",
        })
        fetchOffers()
      } else {
        throw new Error('Failed to delete offer')
      }
    } catch (error) {
      toast({
        title: "خطأ في حذف العرض",
        description: "يرجى المحاولة مرة أخرى",
        className: "bg-red-500 text-white",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">إدارة العروض</h2>
          <p className="text-gray-600">أضف، عدّل، أو احذف العروض</p>
        </div>
        <Button 
          onClick={() => {
            setShowForm(true)
            setEditId(null)
            setForm({
              name: "",
              description: "",
              price: "",
              discount_price: "",
              stock_quantity: "",
              sizes: [],
              images: [],
              is_active: true,
            })
            setShowDiscountPrice(false)
            setShowSizes(false)
            setShowImages(false)
            setShowDescription(false)
          }}
          className="bg-green-500 hover:bg-green-600"
        >
          <Plus size={16} className="ml-2" />
          أضف عرض
        </Button>
      </div>

      {/* فلاتر البحث */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            البحث في العروض
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label>البحث في العروض</Label>
            <Input
              placeholder="ابحث بالاسم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* قائمة العروض */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">جاري تحميل العروض...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => (
            <Card key={offer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{offer.name}</CardTitle>
                    {offer.discount_price && (
                      <Badge variant="destructive" className="mt-1">
                        خصم {Math.round(((offer.price - offer.discount_price) / offer.price) * 100)}%
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(offer)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(offer.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">السعر:</span>
                    <span>{offer.price} دج</span>
                  </div>
                  {offer.discount_price && (
                    <div className="flex justify-between text-green-600">
                      <span>سعر الخصم:</span>
                      <span>{offer.discount_price} دج</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>المخزون:</span>
                    <span>{offer.stock_quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الحالة:</span>
                    <Badge variant={offer.is_active ? "default" : "secondary"}>
                      {offer.is_active ? "نشط" : "غير نشط"}
                    </Badge>
                  </div>
                  {offer.description && (
                    <div className="text-sm text-gray-600 mt-2">
                      {offer.description}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* نموذج إضافة/تعديل العرض */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {editId ? "تعديل العرض" : "إضافة عرض جديد"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* الحقول الأساسية */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>اسم العرض *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="أدخل اسم العرض"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                <div>
                  <Label>السعر *</Label>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="أدخل السعر"
                  />
                  {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                </div>

                <div>
                  <Label>كمية المخزون *</Label>
                  <Input
                    type="number"
                    value={form.stock_quantity}
                    onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
                    placeholder="أدخل الكمية"
                  />
                  {errors.stock_quantity && <p className="text-red-500 text-sm">{errors.stock_quantity}</p>}
                </div>

                <div>
                  <Label>الحالة</Label>
                  <select
                    value={form.is_active.toString()}
                    onChange={(e) => setForm({ ...form, is_active: e.target.value === 'true' })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="true">نشط</option>
                    <option value="false">غير نشط</option>
                  </select>
                </div>
              </div>

              {/* الحقول الاختيارية */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant={showDescription ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowDescription(!showDescription)}
                  >
                    {showDescription ? "إزالة الوصف" : "إضافة وصف"}
                  </Button>
                  <Button
                    type="button"
                    variant={showDiscountPrice ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowDiscountPrice(!showDiscountPrice)}
                  >
                    {showDiscountPrice ? "إزالة سعر الخصم" : "إضافة سعر الخصم"}
                  </Button>
                  <Button
                    type="button"
                    variant={showSizes ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowSizes(!showSizes)}
                  >
                    {showSizes ? "إزالة المقاسات" : "إضافة مقاسات"}
                  </Button>
                  <Button
                    type="button"
                    variant={showImages ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowImages(!showImages)}
                  >
                    {showImages ? "إزالة الصور" : "إضافة صور"}
                  </Button>
                </div>

                {showDescription && (
                  <div>
                    <Label>وصف العرض</Label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="أدخل وصف العرض"
                      className="w-full p-2 border border-gray-300 rounded-md h-20"
                    />
                  </div>
                )}

                {showDiscountPrice && (
                  <div>
                    <Label>سعر الخصم</Label>
                    <Input
                      type="number"
                      value={form.discount_price}
                      onChange={(e) => setForm({ ...form, discount_price: e.target.value })}
                      placeholder="أدخل سعر الخصم"
                    />
                    {errors.discount_price && <p className="text-red-500 text-sm">{errors.discount_price}</p>}
                  </div>
                )}

                {showSizes && (
                  <div>
                    <Label>المقاسات (افصل بينها بفاصلة)</Label>
                    <Input
                      value={form.sizes.join(', ')}
                      onChange={(e) => setForm({ ...form, sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      placeholder="مثال: S, M, L, XL"
                    />
                  </div>
                )}

                {showImages && (
                  <div>
                    <Label>صور العرض</Label>
                    <MultiImageUpload
                      onImagesUploaded={(imageUrls) => {
                        setForm((f) => ({ ...f, images: [...f.images, ...imageUrls] }))
                      }}
                      maxImages={10}
                    />
                    {form.images.length > 0 && (
                      <div className="mt-2">
                        <Label>الصور المضافة:</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {form.images.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={image}
                                alt={`صورة ${index + 1}`}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => setForm({ ...form, images: form.images.filter((_, i) => i !== index) })}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-green-500 hover:bg-green-600"
                >
                  {submitting ? "جاري الحفظ..." : (editId ? "تحديث العرض" : "إضافة العرض")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
