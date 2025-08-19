"use client"

import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GlassContainer } from "@/components/GlassContainer"

interface Category {
  title: string
  subtitle: string
  image: string
  count: string
}

interface CategorySliderProps {
  categories: Category[]
  glassCardClasses: string
  headingTextColor: string
  bodyTextColor: string
}

export function CategorySlider({ categories, glassCardClasses, headingTextColor, bodyTextColor }: CategorySliderProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Automatic scrolling logic
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % categories.length)
    }, 4000) // Change category every 4 seconds

    return () => clearInterval(interval)
  }, [categories.length])

  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % categories.length)
  }

  const goToPrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + categories.length) % categories.length)
  }

  return (
    <GlassContainer className={`${glassCardClasses} p-8 relative overflow-hidden`}>
      <div className="text-center mb-12">
        <h3 className={`text-3xl font-bold ${headingTextColor} mb-4 drop-shadow-lg`}>تسوقي حسب الفئة</h3>
        <p className={`${bodyTextColor} text-lg`}>اختاري من مجموعتنا المتنوعة</p>
      </div>

      <div className="relative w-full overflow-hidden">
        <div
          ref={containerRef}
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {categories.map((category, index) => (
            <div key={index} className="flex-shrink-0 w-full flex justify-center items-center">
              <GlassContainer
                intensity="darker"
                className="group cursor-pointer hover:bg-stone-900/50 transition-all duration-500 transform hover:scale-105
                           w-[280px] h-[280px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] rounded-full
                           flex flex-col items-center justify-center p-0 relative overflow-hidden"
              >
                {/* Image at the top part of the circle */}
                <div className="relative w-full h-3/5 flex items-center justify-center overflow-hidden rounded-t-full">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.title}
                    width={400}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 to-transparent"></div>
                  <Badge className="absolute top-4 right-4 bg-rose-500/90 text-white backdrop-blur-sm">
                    {category.count}
                  </Badge>
                </div>
                {/* Text content at the bottom part of the circle */}
                <div className="p-4 text-center flex flex-col items-center justify-center flex-grow w-full">
                  <h4 className={`text-xl font-bold ${headingTextColor} mb-1 drop-shadow-md`}>{category.title}</h4>
                  <p className={`${bodyTextColor} text-sm`}>{category.subtitle}</p>
                </div>
              </GlassContainer>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrev}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full z-10 backdrop-blur-sm"
          aria-label="Previous category"
        >
          <ChevronRight className="w-6 h-6" /> {/* Right arrow for previous in RTL */}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNext}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full z-10 backdrop-blur-sm"
          aria-label="Next category"
        >
          <ChevronLeft className="w-6 h-6" /> {/* Left arrow for next in RTL */}
        </Button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {categories.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeIndex === index ? "bg-rose-500 scale-125" : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to category ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </GlassContainer>
  )
}
