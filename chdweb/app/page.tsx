"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Star, Truck, Shield, Headphones, Tag, Heart, ShoppingCart, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([])
  const [offers, setOffers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingOffers, setLoadingOffers] = useState(true)
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        const res = await fetch("/api/products")
        if (res.ok) {
          const data = await res.json()
          setProducts(data)
        }
      } finally {
        setLoading(false)
      }
    }
    async function fetchOffers() {
      setLoadingOffers(true)
      try {
        const res = await fetch("/api/offers")
        if (res.ok) {
          const data = await res.json()
          setOffers(data)
        }
      } finally {
        setLoadingOffers(false)
      }
    }
    fetchProducts()
    fetchOffers()
  }, [])

  // الانتقال التلقائي للعروض (3 عروض في كل مرة)
  useEffect(() => {
    if (offers.length === 0) return
    const interval = setInterval(() => {
      setCurrentOfferIndex((prev) => {
        const nextIndex = prev + 3
        return nextIndex >= offers.length ? 0 : nextIndex
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [offers.length])

  const [showLinkModal, setShowLinkModal] = useState<{ id: string; name: string; type: "product" | "offer" } | null>(
    null,
  )
  const [customPrice, setCustomPrice] = useState("")
  const [resellerName, setResellerName] = useState("")
  const [resellerPhone, setResellerPhone] = useState("")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me")
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
          setResellerName(data.user.full_name)
          setResellerPhone(data.user.phone_number)
        }
      } catch (error) {
        console.log("No authenticated user")
      }
    }
    checkAuth()
  }, [])

  const [resaleLink, setResaleLink] = useState("")

  useEffect(() => {
    if (showLinkModal && customPrice && (user || (resellerName && resellerPhone))) {
      const link = `/order/${showLinkModal.id}?price=${encodeURIComponent(customPrice)}&type=${showLinkModal.type}${!user ? `&reseller_name=${encodeURIComponent(resellerName)}&reseller_phone=${encodeURIComponent(resellerPhone)}` : ""}`
      setResaleLink(link)
    } else {
      setResaleLink("")
    }
  }, [showLinkModal, customPrice, user, resellerName, resellerPhone])

  return (
    <>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Header />

        {/* Hero Section with Sliding Offers */}
        <section className="bg-gradient-to-r from-orange-500 via-orange-600 to-gray-600 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">عروض حصرية</h1>
              <p className="text-xl opacity-90">اكتشف أفضل العروض المتاحة الآن</p>
            </div>

            {loadingOffers ? (
              <div className="text-center py-16 text-white/70 text-lg">جاري تحميل العروض...</div>
            ) : offers.length === 0 ? (
              <div className="text-center py-16 text-white/70 text-lg">لا توجد عروض حالياً</div>
            ) : (
              <div className="relative">
                <div
                  ref={scrollRef}
                  className="flex gap-6 overflow-x-hidden pb-6 justify-center"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {offers.slice(currentOfferIndex, currentOfferIndex + 3).map((offer, index) => (
                      <div
                        key={`${offer.id}-${index}`}
                        className="flex-shrink-0 w-80 bg-white/15 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all flex flex-col"
                      >
                        <div className="w-full h-40 bg-white/20 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                          {offer.images && offer.images.length > 0 ? (
                            <img 
                              src={offer.images[0]} 
                              alt={offer.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white/70">صورة المنتج</span>
                          )}
                        </div>
                        <h3 className="font-bold text-lg mb-3 line-clamp-2">{offer.name}</h3>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            {/* عرض سعر الخصم كسعر رئيسي إذا كان موجود وأكبر من صفر */}
                            <span className="text-2xl font-bold">
                              {offer.discount_price && offer.discount_price > 0 ? offer.discount_price : offer.price} دج
                            </span>
                            {/* عرض السعر الأصلي مشطوب إذا كان هناك خصم */}
                            {offer.discount_price && offer.discount_price > 0 && (
                              <div className="text-sm opacity-70 line-through">{offer.price} دج</div>
                            )}
                          </div>
                          {/* عرض نسبة التخفيض فقط إذا كان هناك خصم */}
                          {offer.discount_price && offer.discount_price > 0 && (
                            <div className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                              -{Math.round(((offer.price - offer.discount_price) / offer.price) * 100)}%
                            </div>
                          )}
                        </div>
                        <div className="mt-auto">
                          <Button 
                            size="lg" 
                            className="w-full bg-white text-orange-600 hover:bg-gray-100 font-bold"
                            onClick={() => setShowLinkModal({ id: offer.id, name: offer.name, type: "offer" })}
                          >
                            أنشئ رابط بيع
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* مؤشرات التنقل */}
                  {offers.length > 3 && (
                    <div className="flex justify-center gap-2 mt-6">
                      {Array.from({ length: Math.ceil(offers.length / 3) }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentOfferIndex(i * 3)}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            Math.floor(currentOfferIndex / 3) === i 
                              ? 'bg-white' 
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
          </div>
        </section>

        {/* All Products Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">جميع المنتجات</h2>
              <p className="text-xl text-gray-600">تصفح مجموعتنا الكاملة من المنتجات عالية الجودة</p>
            </div>

            {loading ? (
              <div className="text-center py-20 text-gray-500 text-lg">جاري تحميل المنتجات...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-gray-500 text-lg">لا توجد منتجات متاحة حالياً</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border group overflow-hidden flex flex-col"
                  >
                    <div className="relative overflow-hidden">
                      <div className="w-full h-56 bg-gray-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : product.image_url ? (
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-500">صورة المنتج</span>
                        )}
                      </div>

                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-gray-800 line-clamp-2 mb-3 text-lg">{product.name}</h3>
                      {product.description && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{product.description}</p>
                      )}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                          {/* عرض سعر الخصم كسعر رئيسي إذا كان موجود وأكبر من صفر */}
                          <span className="text-2xl font-bold text-orange-600">
                            {product.discount_price && product.discount_price > 0 ? product.discount_price : product.price} دج
                          </span>
                          {/* عرض السعر الأصلي مشطوب إذا كان هناك خصم */}
                          {product.discount_price && product.discount_price > 0 && (
                            <span className="text-sm text-gray-400 line-through">{product.price} دج</span>
                          )}
                          {/* عرض نسبة التخفيض إذا كان هناك خصم */}
                          {product.discount_price && product.discount_price > 0 && (
                            <span className="text-xs text-red-500 font-bold">
                              خصم {Math.round(((product.price - product.discount_price) / product.price) * 100)}%
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-600 font-medium">4.8</span>
                        </div>
                      </div>
                      <div className="mt-auto">
                        <Button
                          className="w-full bg-orange-500 hover:bg-orange-600 font-bold"
                          onClick={() => setShowLinkModal({ id: product.id, name: product.name, type: "product" })}
                        >
                          <Tag className="w-4 h-4 mr-2" />
                          أنشئ رابط بيع
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Why Choose TANAMIRT Section */}
        <section className="py-20 bg-gradient-to-br from-orange-50 to-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">لماذا تختار TANAMIRT؟</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                نحن نقدم أفضل تجربة تسوق مع ضمان الجودة والأسعار المناسبة
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-shadow">
                  <Truck className="w-12 h-12 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">شحن سريع ومجاني</h3>
                <p className="text-gray-600">توصيل مجاني لجميع أنحاء الجزائر خلال 24-48 ساعة</p>
              </div>

              <div className="text-center group">
                <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-shadow">
                  <Shield className="w-12 h-12 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">ضمان الجودة</h3>
                <p className="text-gray-600">جميع منتجاتنا أصلية 100% مع ضمان استرداد الأموال</p>
              </div>

              <div className="text-center group">
                <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-shadow">
                  <Headphones className="w-12 h-12 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">دعم 24/7</h3>
                <p className="text-gray-600">فريق خدمة العملاء متاح على مدار الساعة لمساعدتك</p>
              </div>

              <div className="text-center group">
                <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-shadow">
                  <Award className="w-12 h-12 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">أفضل الأسعار</h3>
                <p className="text-gray-600">نضمن لك أفضل الأسعار في السوق مع عروض حصرية</p>
              </div>
            </div>
          </div>
        </section>



        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 pt-20 pb-10">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-10 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">T</span>
                  </div>
                  <span className="text-3xl font-bold text-white">TANAMIRT</span>
                </div>
                <p className="text-gray-400 text-lg mb-6">متجرك الموثوق لأفضل المنتجات بأسعار مناسبة في الجزائر</p>
              </div>

              <div>
                <h3 className="text-white font-bold text-xl mb-6">روابط سريعة</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/about" className="hover:text-orange-400 transition text-lg">
                      من نحن
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-orange-400 transition text-lg">
                      اتصل بنا
                    </Link>
                  </li>
                  <li>
                    <Link href="/shipping" className="hover:text-orange-400 transition text-lg">
                      الشحن والتوصيل
                    </Link>
                  </li>
                  <li>
                    <Link href="/returns" className="hover:text-orange-400 transition text-lg">
                      سياسة الإرجاع
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-bold text-xl mb-6">خدمة العملاء</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/help" className="hover:text-orange-400 transition text-lg">
                      مركز المساعدة
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="hover:text-orange-400 transition text-lg">
                      الأسئلة الشائعة
                    </Link>
                  </li>
                  <li>
                    <Link href="/support" className="hover:text-orange-400 transition text-lg">
                      الدعم الفني
                    </Link>
                  </li>
                  <li>
                    <Link href="/warranty" className="hover:text-orange-400 transition text-lg">
                      الضمان
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-bold text-xl mb-6">معلومات التواصل</h3>
                <div className="space-y-4 text-gray-400 text-lg">
                  <p>الجزائر العاصمة، الجزائر</p>
                  <p>+213 XXX XXX XXX</p>
                  <p>info@tanamirt.com</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-10 text-center">
              <p className="text-gray-400 text-lg">© {new Date().getFullYear()} TANAMIRT. جميع الحقوق محفوظة.</p>
            </div>
          </div>
        </footer>
      </div>

      {showLinkModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-gray-800">إنشاء رابط بيع - {showLinkModal.name}</h3>

            <label className="block text-sm font-bold mb-2 text-gray-700">السعر المخصص</label>
            <input
              type="number"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 mb-4 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
              placeholder="أدخل السعر"
            />

            {!user && (
              <>
                <label className="block text-sm font-bold mb-2 text-gray-700">اسمك</label>
                <input
                  type="text"
                  value={resellerName}
                  onChange={(e) => setResellerName(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 mb-4 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                  placeholder="أدخل اسمك"
                />

                <label className="block text-sm font-bold mb-2 text-gray-700">رقم هاتفك</label>
                <input
                  type="tel"
                  value={resellerPhone}
                  onChange={(e) => setResellerPhone(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 mb-4 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                  placeholder="أدخل رقم هاتفك"
                />
              </>
            )}

            {resaleLink && <div className="mb-4 p-3 bg-gray-50 rounded-lg border text-sm break-all">{resaleLink}</div>}

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowLinkModal(null)
                  setCustomPrice("")
                  if (!user) {
                    setResellerName("")
                    setResellerPhone("")
                  }
                }}
              >
                إلغاء
              </Button>
              <Button
                className="bg-orange-500 hover:bg-orange-600"
                disabled={!customPrice || (!user && (!resellerName || !resellerPhone))}
                onClick={() => {
                  if (!resaleLink) return
                  navigator.clipboard.writeText(resaleLink)
                  setShowLinkModal(null)
                  setCustomPrice("")
                  if (!user) {
                    setResellerName("")
                    setResellerPhone("")
                  }
                }}
              >
                نسخ الرابط
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
