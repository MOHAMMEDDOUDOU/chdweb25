"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { GlassContainer } from "@/components/GlassContainer"

interface Category {
  title: string
  subtitle: string
  image: string
  count: string
}

interface CategoryGridProps {
  categories: Category[]
  glassCardClasses: string
  headingTextColor: string
  bodyTextColor: string
}

export function CategoryGrid({ categories, glassCardClasses, headingTextColor, bodyTextColor }: CategoryGridProps) {
  return (
    <GlassContainer className={`${glassCardClasses} p-8 relative overflow-hidden`}>
      {/* Removed the section heading from here as per user request */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
        {categories.map((category, index) => (
          <div key={index} className="flex justify-center items-center">
            <GlassContainer
              intensity="darker"
              className="group cursor-pointer hover:bg-stone-900/50 transition-all duration-500 transform hover:scale-105
                         w-[250px] h-[250px] md:w-[280px] md:h-[280px] lg:w-[300px] lg:h-[300px] rounded-full
                         flex flex-col items-center justify-start p-0 relative overflow-hidden"
            >
              {/* Image at the top part of the circle */}
              <div className="relative w-full h-3/5 flex items-center justify-center overflow-hidden rounded-t-full">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.title}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 to-transparent"></div>
                <Badge className="absolute top-4 right-4 bg-rose-500/90 text-white backdrop-blur-sm">
                  {category.count}
                </Badge>
              </div>
              {/* Text content at the bottom part of the circle - now includes title */}
              <div className="p-4 text-center flex flex-col items-center justify-center flex-grow w-full">
                <h4 className={`text-xl font-bold ${headingTextColor} mb-1 drop-shadow-md`}>{category.title}</h4>
                <p className={`${bodyTextColor} text-sm`}>{category.subtitle}</p>
              </div>
            </GlassContainer>
          </div>
        ))}
      </div>
    </GlassContainer>
  )
}
