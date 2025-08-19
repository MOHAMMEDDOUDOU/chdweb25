"use client"
import { useEffect, useState, useMemo } from "react"
import { Plus, Pencil, Trash2, Package, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import MultiImageUpload from "@/components/MultiImageUpload"
import { toast } from "@/components/ui/use-toast"

interface Product {
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

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discount_price: "",
    stock_quantity: "",
    sizes: [] as string[],
    images: [] as string[],
    category: "",
    is_active: true,
  })
  const [errors, setErrors] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("الكل")
  
  // States for optional fields visibility
  const [showDiscountPrice, setShowDiscountPrice] = useState(false)
  const [showSizes, setShowSizes] = useState(false)
  const [showImages, setShowImages] = useState(false)
  const [showDescription, setShowDescription] = useState(false)
  const [showCategory, setShowCategory] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  // التحديث الفوري عبر SSE
  useEffect(() => {
    const es = new EventSource('/api/realtime')
    es.onmessage = () => fetchProducts()
    return () => es.close()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      } else {
        console.error('Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
    setLoading(false)
  }

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category).filter(Boolean)))
    return cats
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (filterCategory !== "الكل" && p.category !== filterCategory) return false
      if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
      return true
    })
  }, [products, filterCategory, searchTerm])

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
        category: showCategory && form.category ? form.category : undefined,
        is_active: form.is_active,
      }

      const url = editId ? `/api/products/${editId}` : '/api/products'
      const method = editId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast({
          title: editId ? "تم تحديث المنتج بنجاح" : "تم إضافة المنتج بنجاح",
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
          category: "",
          is_active: true,
        })
        setEditId(null)
        fetchProducts()
      } else {
        throw new Error('Failed to save product')
      }
    } catch (error) {
      toast({
        title: "خطأ في حفظ المنتج",
        description: "يرجى المحاولة مرة أخرى",
        className: "bg-red-500 text-white",
      })
    }
    setSubmitting(false)
  }

  const handleEdit = (product: Product) => {
    setEditId(product.id)
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      discount_price: product.discount_price?.toString() || "",
      stock_quantity: product.stock_quantity.toString(),
      sizes: product.sizes || [],
      images: product.images || [],
      category: product.category || "",
      is_active: product.is_active,
    })
    setShowDiscountPrice(!!product.discount_price)
    setShowSizes(!!product.sizes?.length)
    setShowImages(!!product.images?.length)
    setShowDescription(!!product.description)
    setShowCategory(!!product.category)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return

    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast({
          title: "تم حذف المنتج بنجاح",
          className: "bg-green-500 text-white",
        })
        fetchProducts()
      } else {
        throw new Error('Failed to delete product')
      }
    } catch (error) {
      toast({
        title: "خطأ في حذف المنتج",
        description: "يرجى المحاولة مرة أخرى",
        className: "bg-red-500 text-white",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">إدارة المنتجات</h2>
          <p className="text-gray-600">أضف، عدّل، أو احذف المنتجات</p>
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
              category: "",
              is_active: true,
            })
            setShowDiscountPrice(false)
            setShowSizes(false)
            setShowImages(false)
            setShowDescription(false)
            setShowCategory(false)
          }}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus size={16} className="ml-2" />
          أضف منتج
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>البحث في المنتجات</Label>
              <Input
                placeholder="ابحث بالاسم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label>تصنيف المنتج</Label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="الكل">جميع التصنيفات</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* قائمة المنتجات */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">جاري تحميل المنتجات...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    {product.category && (
                      <Badge variant="secondary" className="mt-1">
                        {product.category}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(product.id)}
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
                    <span>{product.price} دج</span>
                  </div>
                  {product.discount_price && (
                    <div className="flex justify-between text-green-600">
                      <span>سعر الخصم:</span>
                      <span>{product.discount_price} دج</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>المخزون:</span>
                    <span>{product.stock_quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الحالة:</span>
                    <Badge variant={product.is_active ? "default" : "secondary"}>
                      {product.is_active ? "نشط" : "غير نشط"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* نموذج إضافة/تعديل المنتج */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {editId ? "تعديل المنتج" : "إضافة منتج جديد"}
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
                  <Label>اسم المنتج *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="أدخل اسم المنتج"
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
                  <Button
                    type="button"
                    variant={showCategory ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowCategory(!showCategory)}
                  >
                    {showCategory ? "إزالة التصنيف" : "إضافة تصنيف"}
                  </Button>
                </div>

                {showDescription && (
                  <div>
                    <Label>وصف المنتج</Label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="أدخل وصف المنتج"
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
                    <Label>صور المنتج</Label>
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

                {showCategory && (
                  <div>
                    <Label>تصنيف المنتج</Label>
                    <Input
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      placeholder="أدخل تصنيف المنتج"
                    />
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
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {submitting ? "جاري الحفظ..." : (editId ? "تحديث المنتج" : "إضافة المنتج")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
