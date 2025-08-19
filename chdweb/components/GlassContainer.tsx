"use client"

import type { ReactNode } from "react"

interface GlassContainerProps {
  children: ReactNode
  className?: string
  intensity?: "light" | "medium" | "dark" | "darker"
  bgColor?: string // لون خلفية مخصص
}

export function GlassContainer({ children, className = "", intensity = "medium", bgColor }: GlassContainerProps) {
  const getIntensityClasses = () => {
    switch (intensity) {
      case "light":
        return "backdrop-blur-sm bg-stone-900/10 border-stone-800/20"
      case "medium":
        return "backdrop-blur-md bg-stone-900/20 border-stone-800/30"
      case "dark":
        return "backdrop-blur-lg bg-stone-900/30 border-stone-800/40"
      case "darker":
        return "backdrop-blur-xl bg-stone-900/40 border-stone-800/50"
      default:
        return "backdrop-blur-md bg-stone-900/20 border-stone-800/30"
    }
  }

  // إذا تم تمرير لون مخصص استخدمه بدلاً من لون intensity
  const bgClass = bgColor ? `${bgColor}` : getIntensityClasses()

  return (
    <div className={`${bgClass} border rounded-3xl shadow-2xl shadow-stone-900/20 ${className}`}>
      {children}
    </div>
  )
}
