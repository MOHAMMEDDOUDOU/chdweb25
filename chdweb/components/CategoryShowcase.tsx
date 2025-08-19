"use client"

import type React from "react"

import Image from "next/image"
import { GlassContainer } from "@/components/GlassContainer"
import { Sparkles } from "lucide-react"
import { useState, useEffect, useCallback, useRef } from "react"

interface Product {
  name: string
  brand: string
  price: string
  originalPrice?: string
  rating: number
  image: string
}

interface CategoryShowcaseProps {
  categoryTitle: string
  categorySubtitle: string
  categoryImage: string
  categoryCount: string
  products: Product[]
  glassCardClasses: string
  headingTextColor: string
  bodyTextColor: string
  direction?: "left" | "right" // For alternating layout
}

export function CategoryShowcase({
  categoryTitle,
  categorySubtitle,
  categoryImage,
  categoryCount,
  products,
  glassCardClasses,
  headingTextColor,
  bodyTextColor,
  direction = "left",
}: CategoryShowcaseProps) {
  const isLeft = direction === "left"
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)
  const [isImageHovered, setIsImageHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [visibleProducts, setVisibleProducts] = useState<Set<number>>(new Set())

  // Generate animated particles with better performance
  const particlesRef = useRef<Array<{ id: number; x: number; y: number; delay: number; color: string }>>()
  if (!particlesRef.current) {
    particlesRef.current = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: 10 + i * 15, // قيم ثابتة
      y: 20 + i * 10, // قيم ثابتة
      delay: 500 * i, // قيم ثابتة
      color: [
        "text-rose-400/60",
        "text-pink-400/60",
        "text-yellow-400/60",
        "text-purple-400/60",
        "text-blue-400/60",
        "text-green-400/60",
      ][i % 6],
    }))
  }
  const animatedParticles = particlesRef.current || []

  // Mouse tracking for interactive effects
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }, [])

  // Scroll animation effect
  useEffect(() => {
    const handleScroll = () => {
      const productElements = document.querySelectorAll(".product-item")
      const newVisibleProducts = new Set<number>()

      productElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0

        if (isVisible) {
          newVisibleProducts.add(index)
        }
      })

      setVisibleProducts(newVisibleProducts)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check initial state

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <GlassContainer className={`${glassCardClasses} p-8 relative overflow-hidden`}>
      {/* Enhanced animated background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {animatedParticles.map((particle, idx) => (
          <div
            key={particle.id}
            className="absolute animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}ms`,
              animationDuration: `${2000 + particle.delay}ms`,
            }}
          >
            <Sparkles className={`w-${2 + (idx % 3)} h-${2 + (idx % 3)} ${particle.color}`} />
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        {/* Left: Category Image (large) */}
        <div className="flex justify-center items-center">
          <div className="relative">
            <Image
              src={categoryImage || "/placeholder.svg?height=600&width=500"}
              alt={categoryTitle}
              width={500}
              height={600}
              className="rounded-3xl shadow-2xl object-cover"
              quality={95}
              priority={true}
              sizes="(max-width: 768px) 100vw, 500px"
              style={{ width: 500, height: 600, objectFit: "cover" }}
            />
          </div>
        </div>
        {/* Right: Vertical Circles with animated rectangles (large) */}
        <div className="flex flex-col gap-12 items-center justify-center h-[600px]">
          {products.slice(0, 4).map((product, idx) => {
            const isEven = idx % 2 === 0
            const isVisible = visibleProducts.size > 0
            return (
              <div key={product.name} className="relative flex items-center w-full" style={{ minHeight: 180 }}>
                {/* Circle (Product Image, large) */}
                <div
                  className="shadow-xl border-4 border-white bg-white flex-shrink-0 z-20"
                  style={{
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={product.image || "/placeholder.svg?height=150&width=150"}
                    alt={product.name}
                    width={150}
                    height={150}
                    className="object-cover w-full h-full"
                    quality={90}
                  />
                </div>
                {/* Animated Rectangle (Product Name, large and clear) */}
                <div
                  className={`absolute top-1/2 ${isEven ? "left-full" : "right-full"} -translate-y-1/2 transition-all duration-700 z-30 ${isVisible ? (isEven ? "translate-x-8 opacity-100" : "-translate-x-8 opacity-100") : isEven ? "translate-x-0 opacity-0" : "-translate-x-0 opacity-0"}`}
                  style={{
                    minWidth: 260,
                    maxWidth: 400,
                    background: "rgba(255,255,255,0.95)",
                    borderRadius: 20,
                    border: "2px solid #E0C199",
                    boxShadow: "0 8px 32px 0 rgba(0,0,0,0.10)",
                    padding: "28px 48px",
                    color: "#71594F",
                    fontWeight: 700,
                    fontSize: 22,
                    marginLeft: isEven ? 0 : undefined,
                    marginRight: isEven ? undefined : 0,
                    zIndex: 30,
                  }}
                >
                  {product.name}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </GlassContainer>
  )
}
