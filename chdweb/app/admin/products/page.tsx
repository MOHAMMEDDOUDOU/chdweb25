"use client"
import { useEffect, useState, useMemo } from "react"
import { Plus, Pencil, Trash2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import MultiImageUpload from "@/components/MultiImageUpload"

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

const initialForm = {
  name: "",
  description: "",
  price: "",
  discount_price: "",
  stock_quantity: "",
  sizes: [] as string[],
  images: [] as string[],
  is_active: true,
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
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
  const [filterCategory, setFilterCategory] = useState("الكل")
  const [filterPriceMin, setFilterPriceMin] = useState("")
  const [filterPriceMax, setFilterPriceMax] = useState("")
  const [filterName, setFilterName] = useState("")
  
  // States for optional fields visibility
  const [showDiscountPrice, setShowDiscountPrice] = useState(false)
  const [showSizes, setShowSizes] = useState(false)
  const [showImages, setShowImages] = useState(false)
  const [showDescription, setShowDescription] = useState(false)

  // جلب المنتجات من API عند التحميل
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
      if (filterPriceMin && Number(p.price) < Number(filterPriceMin)) return false
      if (filterPriceMax && Number(p.price) > Number(filterPriceMax)) return false
      if (filterName && !p.name.toLowerCase().includes(filterName.toLowerCase())) return false
      return true
    })
  }, [products, filterCategory, filterPriceMin, filterPriceMax, filterName])

  // قائمة الفئات الثابتة بالعربية
  const FIXED_CATEGORIES = ["العناية بالبشرة", "العناية بالشعر", "الأجهزة الكهرومنزلية", "مكياج", "عطور", "إكسسوارات"]

  // Replace category options with French names
  const categoryOptions = [
    "Soins cheveux",
    "Maquillage",
    "Soins visage",
    "Parfums",
    "Accessoires",
    "Appareils coiffants",
  ]

  return (
    <div className="w-full h-full overflow-auto">
      <div className="flex flex-col items-center w-full py-6 md:py-12 px-2 md:px-4 max-w-7xl mx-auto">
        {/* الهيدر الجديد */}
        <div className="w-full max-w-5xl flex flex-col items-center justify-center mb-6 md:mb-10">
          <div className="flex items-center gap-2 md:gap-4 mb-4 mt-3 md:mt-6">
            <Package className="w-8 h-8 md:w-14 md:h-14 text-white drop-shadow-lg" />
            <h1 className="font-extrabold text-2xl md:text-5xl text-white drop-shadow-lg">إدارة المنتجات</h1>
          </div>
        </div>

        {/* الإحصائيات */}
        <div className="w-full flex flex-wrap gap-2 md:gap-4 justify-center mb-4 md:mb-6">
          <div className="bg-gradient-to-r from-blue-100 to-blue-300 text-blue-900 rounded-xl px-3 md:px-6 py-2 md:py-4 font-bold text-sm md:text-lg shadow flex flex-col items-center min-w-[120px] md:min-w-[160px]">
            <span className="text-xs md:text-base">إجمالي المنتجات</span>
            <span className="text-lg md:text-2xl font-extrabold">{products.length}</span>
          </div>
          <div className="bg-gradient-to-r from-purple-100 to-purple-300 text-purple-900 rounded-xl px-3 md:px-6 py-2 md:py-4 font-bold text-sm md:text-lg shadow flex flex-col items-center min-w-[120px] md:min-w-[160px]">
            <span className="text-xs md:text-base">عدد الفئات</span>
            <span className="text-lg md:text-2xl font-extrabold">{categories.length}</span>
          </div>
        </div>

        {/* شريط شارات الفئات */}
        {categories.length > 0 && (
          <div className="w-full flex flex-wrap gap-1 md:gap-2 justify-center mb-4 md:mb-8">
            {categories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1 md:gap-2 bg-pink-100 text-pink-800 rounded-full px-2 md:px-4 py-1 font-bold text-xs md:text-md shadow border border-pink-300"
              >
                <span>{cat}</span>
                <span className="bg-pink-400 text-white rounded-full px-1 md:px-2 py-0.5 text-xs font-bold">
                  {products.filter((p) => p.category === cat).length}
                </span>
              </span>
            ))}
          </div>
        )}

        {/* شريط التصفية العصري */}
        <div className="w-full flex flex-wrap gap-2 md:gap-4 justify-center items-end mb-4 md:mb-8 bg-white/70 rounded-2xl p-2 md:p-4 shadow">
          <div className="flex flex-col gap-1">
            <label className="font-bold text-xs md:text-sm mb-1">الفئة</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded-lg border px-2 md:px-3 py-1 md:py-2 min-w-[100px] md:min-w-[120px] text-xs md:text-sm"
            >
              <option value="الكل">الكل</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-bold text-xs md:text-sm mb-1">السعر من</label>
            <input
              type="number"
              value={filterPriceMin}
              onChange={(e) => setFilterPriceMin(e.target.value)}
              className="rounded-lg border px-2 md:px-3 py-1 md:py-2 min-w-[70px] md:min-w-[90px] text-xs md:text-sm"
              placeholder="0"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-bold text-xs md:text-sm mb-1">السعر إلى</label>
            <input
              type="number"
              value={filterPriceMax}
              onChange={(e) => setFilterPriceMax(e.target.value)}
              className="rounded-lg border px-2 md:px-3 py-1 md:py-2 min-w-[70px] md:min-w-[90px] text-xs md:text-sm"
              placeholder="..."
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-bold text-xs md:text-sm mb-1">بحث بالاسم</label>
            <input
              type="text"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="rounded-lg border px-2 md:px-3 py-1 md:py-2 min-w-[120px] md:min-w-[140px] text-xs md:text-sm"
              placeholder="اسم المنتج..."
            />
          </div>
        </div>

        {/* زر أضف منتج أسفل الفلاتر */}
        <div className="w-full flex justify-center mb-4 md:mb-8">
          <Button
            className="flex items-center gap-1 md:gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold shadow-lg px-4 md:px-8 py-2 md:py-3 rounded-lg md:rounded-xl text-sm md:text-lg transition-transform duration-200 hover:scale-105"
            onClick={() => {
              setShowForm(true)
              setEditId(null)
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
          >
            <Plus size={16} className="md:w-6 md:h-6" /> أضف منتج
          </Button>
        </div>

        {/* نافذة إضافة منتج */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-8 w-full max-w-md relative animate-fadeIn max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowForm(false)}
                className="absolute left-2 md:left-4 top-2 md:top-4 text-gray-400 hover:text-red-500 text-xl md:text-2xl font-bold"
              >
                ×
              </button>
              <h2 className="text-lg md:text-2xl font-extrabold text-center mb-4 md:mb-6 text-emerald-700">
                {editId ? "تعديل المنتج" : "إضافة منتج جديد"}
              </h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  const errs: any = {}
                  if (!form.name) errs.name = "الاسم مطلوب"
                  if (!form.price) errs.price = "السعر مطلوب"
                  if (!form.stock) errs.stock = "كمية المخزون مطلوبة"
                  if (form.discount_price && Number(form.discount_price) >= Number(form.price)) {
                    errs.discount_price = "سعر الخصم يجب أن يكون أقل من السعر الأصلي"
                  }
                  setErrors(errs)
                  if (Object.keys(errs).length > 0) return
                  setSubmitting(true)
                  let error = null
                  
                  const productData = {
                    name: form.name,
                    price: Number(form.price),
                    discount_price: form.discount_price ? Number(form.discount_price) : null,
                    stock_quantity: Number(form.stock),
                    description: form.description || null,
                    sizes: form.sizes.length > 0 ? form.sizes : null,
                    images: form.images.length > 0 ? form.images : null,
                    is_active: true,
                  }

                  if (editId) {
                    // تعديل المنتج
                    const response = await fetch(`/api/products/${editId}`, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(productData),
                    })
                    if (!response.ok) {
                      error = new Error('Failed to update product')
                    }
                  } else {
                    // إضافة المنتج
                    const response = await fetch('/api/products', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(productData),
                    })
                    if (!response.ok) {
                      error = new Error('Failed to create product')
                    }
                  }
                  setSubmitting(false)
                  if (!error) {
                    setShowForm(false)
                    setForm({ 
                      name: "", 
                      price: "", 
                      discount_price: "", 
                      stock: "", 
                      sizes: [], 
                      images: [], 
                      description: "" 
                    })
                    setErrors({})
                    setEditId(null)
                    fetchProducts()
                  } else {
                    setErrors({ submit: "حدث خطأ أثناء الحفظ" })
                  }
                }}
                className="flex flex-col gap-3 md:gap-4"
              >
                <div>
                  <label className="block font-bold mb-1 text-sm md:text-base">
                    اسم المنتج <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-2 md:px-3 py-1 md:py-2 text-sm md:text-base"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                  />
                  {errors.name && <div className="text-red-500 text-xs md:text-sm mt-1">{errors.name}</div>}
                </div>

                <div>
                  <label className="block font-bold mb-1 text-sm md:text-base">
                    السعر الأصلي <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full border rounded-lg px-2 md:px-3 py-1 md:py-2 text-sm md:text-base"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    required
                    min="0"
                  />
                  {errors.price && <div className="text-red-500 text-xs md:text-sm mt-1">{errors.price}</div>}
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
                      <label className="block font-bold text-sm md:text-base">
                        سعر الخصم
                      </label>
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
                      className="w-full border rounded-lg px-2 md:px-3 py-1 md:py-2 text-sm md:text-base"
                      value={form.discount_price}
                      onChange={(e) => setForm((f) => ({ ...f, discount_price: e.target.value }))}
                      min="0"
                      placeholder="أدخل سعر الخصم"
                    />
                    {errors.discount_price && <div className="text-red-500 text-xs md:text-sm mt-1">{errors.discount_price}</div>}
                  </div>
                )}

                <div>
                  <label className="block font-bold mb-1 text-sm md:text-base">
                    كمية المخزون <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded-lg px-2 md:px-3 py-1 md:py-2 text-sm md:text-base"
                    value={form.stock}
                    onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                    required
                    min="0"
                  />
                  {errors.stock && <div className="text-red-500 text-xs md:text-sm mt-1">{errors.stock}</div>}
                </div>

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
                      <label className="block font-bold text-sm md:text-base">
                        المقاسات
                      </label>
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

                {/* صور المنتج - اختياري */}
                {!showImages ? (
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowImages(true)}
                      className="text-sm text-gray-600 border-dashed border-2 border-gray-300 hover:border-gray-400"
                    >
                      + إضافة صور المنتج
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-sm md:text-base">
                        صور المنتج
                      </label>
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
                      onImagesUploaded={(imageUrls) => setForm((f) => ({ ...f, images: [...f.images, ...imageUrls] }))}
                      maxImages={10}
                    />
                    {form.images.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-2">الصور المضافة:</p>
                        <div className="flex flex-wrap gap-2">
                          {form.images.map((img, index) => (
                            <div key={index} className="relative">
                              <img src={img} alt={`صورة ${index + 1}`} className="w-16 h-16 object-cover rounded" />
                              <button
                                type="button"
                                onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }))}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}



                {/* الوصف - اختياري */}
                {!showDescription ? (
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowDescription(true)}
                      className="text-sm text-gray-600 border-dashed border-2 border-gray-300 hover:border-gray-400"
                    >
                      + إضافة وصف المنتج
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-sm md:text-base">الوصف</label>
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
                      className="w-full border rounded-lg px-2 md:px-3 py-1 md:py-2 text-sm md:text-base"
                      value={form.description || ""}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      rows={3}
                      placeholder="أدخل وصف المنتج..."
                    />
                  </div>
                )}

                {errors.submit && <div className="text-red-500 text-center font-bold text-sm">{errors.submit}</div>}
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-2 rounded-lg mt-2 text-sm md:text-base"
                  disabled={submitting}
                >
                  {submitting ? "جاري الحفظ..." : (editId ? "تحديث المنتج" : "حفظ المنتج")}
                </Button>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center flex-1 min-h-[40vh]">
            <span className="text-gray-400 text-lg md:text-xl mb-6">جاري التحميل...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-gray-400 text-lg md:text-xl py-20">لا توجد منتجات مطابقة للتصفية</div>
        ) : (
          <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {filteredProducts.map((product: any) => {
              // دعم المقاسات الافتراضية إذا لم تكن موجودة
              const sizes = product.sizes || ["M", "L", "XL"]
              const isAvailable = Number(product.stock_quantity) > 0
              return (
                <div
                  key={product.id}
                  className="bg-[#f7f7fa] rounded-2xl shadow-lg overflow-hidden flex flex-col p-0 relative group transition-all duration-200"
                >
                  {/* صورة المنتج مع شارة الحالة */}
                  <div className="relative w-full h-32 md:h-48 bg-gray-200">
                    <img
                      src={product.image_url || "/placeholder.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-t-2xl"
                      onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                    />
                    {/* شارة الحالة */}
                    <span
                      className={`absolute top-2 md:top-3 left-2 md:left-3 px-2 md:px-3 py-1 rounded-full text-xs font-bold ${isAvailable ? "bg-green-500 text-white" : "bg-gray-400 text-white"}`}
                    >
                      {isAvailable ? "متوفر" : "غير متوفر"}
                    </span>
                    {/* المخزون */}
                    <span className="absolute top-2 md:top-3 right-2 md:right-3 text-black text-sm md:text-lg font-bold bg-white/80 rounded-full px-2 md:px-3 py-1">
                      {product.stock_quantity}
                    </span>
                  </div>
                  {/* محتوى البطاقة */}
                  <div className="flex-1 flex flex-col gap-1 md:gap-2 px-3 md:px-5 pt-2 md:pt-4 pb-1 md:pb-2 bg-[#f7f7fa]">
                    <div className="font-bold text-sm md:text-lg text-black mb-1">{product.name}</div>
                    <div className="text-orange-600 font-extrabold text-lg md:text-2xl mb-1 md:mb-2">
                      {product.price} دج
                    </div>
                    <div className="flex items-center gap-1 md:gap-2 mb-1">
                      <span className="text-gray-500 text-xs md:text-sm">الفئة:</span>
                      <span className="bg-gray-100 rounded-lg px-1 md:px-2 py-1 text-xs font-bold text-gray-700">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  {/* أزرار التعديل والحذف */}
                  <div className="flex items-center gap-1 md:gap-2 px-2 md:px-4 pb-2 md:pb-4 pt-1 md:pt-2 mt-auto">
                    {/* زر تعديل المنتج */}
                    <button
                      className="flex-1 flex items-center justify-center gap-1 md:gap-2 bg-white border border-gray-300 rounded-lg py-1 md:py-2 font-bold text-xs md:text-sm text-gray-700 hover:bg-gray-50 transition"
                      onClick={() => {
                        setShowForm(true)
                        setEditId(product.id)
                        setForm({
                          name: product.name,
                          price: String(product.price),
                          discount_price: product.discount_price ? String(product.discount_price) : "",
                          stock: String(product.stock_quantity),
                          sizes: product.sizes || [],
                          images: product.images || [],
                          description: product.description || "",
                        })
                        
                        // Show optional fields if they have data
                        setShowDiscountPrice(!!product.discount_price)
                        setShowSizes(!!product.sizes && product.sizes.length > 0)
                        setShowImages(!!product.images && product.images.length > 0)
                        setShowDescription(!!product.description)
                      }}
                    >
                      <Pencil size={14} className="md:w-4 md:h-4" /> تعديل
                    </button>
                    <button
                      className="flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white rounded-lg p-1 md:p-2 transition"
                      onClick={async () => {
                        if (window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
                          try {
                            const response = await fetch(`/api/products/${product.id}`, {
                              method: 'DELETE',
                            })
                            if (response.ok) {
                              fetchProducts()
                            } else {
                              console.error('Failed to delete product')
                            }
                          } catch (error) {
                            console.error('Error deleting product:', error)
                          }
                        }
                      }}
                    >
                      <Trash2 size={14} className="md:w-4 md:h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
