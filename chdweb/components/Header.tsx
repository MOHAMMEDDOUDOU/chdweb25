"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Search, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useIsMobile } from "@/hooks/use-mobile"
import { useRouter } from "next/navigation"
import React from "react"

const categories = [
  { name: "إلكترونيات", href: "/categories/electronics" },
  { name: "أزياء", href: "/categories/fashion" },
  { name: "منزل وحديقة", href: "/categories/home" },
  { name: "رياضة", href: "/categories/sports" },
  { name: "كتب", href: "/categories/books" },
  { name: "ألعاب", href: "/categories/toys" },
]

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const isMobile = useIsMobile()
  const router = useRouter()
  let searchTimeout: NodeJS.Timeout

  async function handleSearch(value: string) {
    setSearch(value)
    if (!value.trim()) {
      setResults([])
      setShowResults(false)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/products?name=${encodeURIComponent(value)}`)
      if (res.ok) {
        const data = await res.json()
        setResults(data)
        setShowResults(true)
      } else {
        setResults([])
        setShowResults(false)
      }
    } catch (e) {
      setResults([])
      setShowResults(false)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (!target.closest(".search-dropdown") && !target.closest(".search-input")) {
        setShowResults(false)
      }
    }
    if (showResults) {
      document.addEventListener("mousedown", handleClick)
    }
    return () => document.removeEventListener("mousedown", handleClick)
  }, [showResults])

  React.useEffect(() => {
    if (showResults && isMobile) {
      document.body.classList.add("search-open")
    } else {
      document.body.classList.remove("search-open")
    }

    return () => {
      document.body.classList.remove("search-open")
    }
  }, [showResults, isMobile])

  // Update cart count
  React.useEffect(() => {
    const updateCartCount = () => {
      const stored = localStorage.getItem("cart")
      if (stored) {
        const cart = JSON.parse(stored)
        const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0)
        setCartCount(count)
      } else {
        setCartCount(0)
      }
    }

    updateCartCount()
    window.addEventListener('storage', updateCartCount)
    window.addEventListener('cartUpdated', updateCartCount)

    return () => {
      window.removeEventListener('storage', updateCartCount)
      window.removeEventListener('cartUpdated', updateCartCount)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        {/* Main header */}
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div className="hidden sm:flex items-center">
                <span className="text-xl md:text-2xl font-bold text-blue-600">TANAMIRT</span>
              </div>
            </div>
          </Link>

          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="ابحث عن المنتجات..."
                value={search}
                onChange={(e) => {
                  clearTimeout(searchTimeout)
                  const value = e.target.value
                  setSearch(value)
                  searchTimeout = setTimeout(() => handleSearch(value), 300)
                }}
                onFocus={() => {
                  if (results.length > 0) setShowResults(true)
                }}
                className="w-full pl-12 pr-4 py-3 text-right border-2 border-orange-200 rounded-full bg-gray-50 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all search-input"
                style={{ direction: "rtl" }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white rounded-full w-8 h-8"
                onClick={() => handleSearch(search)}
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>

            {/* Search Results */}
            {showResults && (
              <div className="absolute top-full left-0 right-0 z-[9999] mt-2 search-dropdown">
                <div className="bg-white rounded-lg shadow-2xl border border-gray-200 max-h-80 overflow-y-auto">
                  {loading ? (
                    <div className="text-center py-4 text-gray-400">جاري البحث...</div>
                  ) : results.length === 0 ? (
                    <div className="text-center py-4 text-gray-400">لا توجد نتائج</div>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {results.map((product) => (
                        <li
                          key={product.id}
                          className="flex items-center gap-3 py-3 px-4 hover:bg-gray-50 cursor-pointer transition"
                          onClick={() => {
                            setShowResults(false)
                            setSearch("")
                            setResults([])
                            router.push(`/order/${product.id}`)
                          }}
                        >
                          <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                            <span className="text-gray-500 text-xs">صورة</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-800 truncate">{product.name}</div>
                            <div className="text-sm text-gray-500 truncate">{product.description}</div>
                          </div>
                          <div className="text-lg font-bold text-orange-600 whitespace-nowrap">{product.price} دج</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Login Button - Desktop */}
            <Link href="/auth/login" className="hidden md:flex">
              <Button
                variant="outline"
                size="sm"
                className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-400 bg-transparent"
              >
                <User className="w-4 h-4 mr-2" />
                تسجيل الدخول
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-orange-600">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              <Link href="/auth/login" className="block">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent"
                >
                  <User className="w-4 h-4 mr-2" />
                  تسجيل الدخول
                </Button>
              </Link>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <Link href="/cart" className="flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    السلة
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent"
                >
                  مساعدة
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
