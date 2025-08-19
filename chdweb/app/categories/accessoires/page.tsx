"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { GlassContainer } from "@/components/GlassContainer"
import { AnimatedSection } from "@/components/AnimatedSection"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"

export default function AccessoiresPage() {
  const glassCardClasses = "bg-white/8 backdrop-blur-lg border-[#C29B87]/20 rounded-2xl shadow-2xl shadow-black/40"
  const headingTextColor = "text-[#E0C199]"
  const bodyTextColor = "text-stone-300"
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      const { data, error } = await supabase.from("products").select("*").eq("category", "Accessoires")
      if (!error && data) setProducts(data)
      setLoading(false)
    }
    fetchProducts()
  }, [])

  function addToCart(product: any) {
    // التحقق من وجود كمية في المخزون
    if (!product.stock_quantity || product.stock_quantity <= 0) {
      alert("عذراً، هذا المنتج غير متوفر في المخزون حالياً")
      return
    }

    const stored = typeof window !== "undefined" ? localStorage.getItem("cart") : null
    let cart = stored ? JSON.parse(stored) : []
    const existing = cart.find((item: any) => item.id === product.id)

    if (existing) {
      // التحقق من أن الكمية الجديدة لا تتجاوز المخزون
      if (existing.quantity >= product.stock_quantity) {
        alert(`عذراً، الكمية المتاحة من ${product.name} هي ${product.stock_quantity} فقط`)
        return
      }
      cart = cart.map((item: any) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
    } else {
      cart.push({ ...product, quantity: 1 })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    alert("تم إضافة المنتج إلى السلة!")
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <section className="relative z-10 py-16">
        <div className="container mx-auto px-4">
          <AnimatedSection direction="up" delay={100}>
            <div className="text-center mb-12">
              <h1 className="text-3xl font-extrabold text-[#b89b6a] mb-2">Accessoires</h1>
              <p className="text-base text-gray-500 mb-6">
                Bijoux, accessoires variés, et parures pour sublimer votre look au quotidien.
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-rose-500 to-pink-600 mx-auto rounded-full"></div>
            </div>
          </AnimatedSection>
          {loading ? (
            <div className="text-center text-white py-20">جاري التحميل...</div>
          ) : products.length === 0 ? (
            <div className="text-center text-white py-20">لا توجد منتجات في هذه الفئة حالياً.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <AnimatedSection key={product.id} direction="up" delay={index * 100}>
                  <GlassContainer
                    className={`${glassCardClasses} p-6 hover:scale-105 transition-transform duration-300`}
                  >
                    <div className="relative mb-4">
                      <Image
                        src={product.image_url || "/placeholder.jpg"}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="w-full h-64 object-cover rounded-xl"
                        quality={90}
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-green-500 text-white">
                          {product.stock_quantity > 0 ? "متوفر" : "غير متوفر"}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-bold text-black text-lg">{product.name}</h3>
                      <p className="text-sm text-[#a89b8a] line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#E0C199] text-lg">{product.price} دج</span>
                      </div>
                      <div className="flex gap-2 mt-4 w-full">
                        <Button
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-full shadow-lg text-lg py-3 transition-transform duration-200 hover:scale-105"
                          onClick={() => router.push(`/order/${product.id}`)}
                        >
                          اطلب الآن
                        </Button>
                      </div>
                    </div>
                  </GlassContainer>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
