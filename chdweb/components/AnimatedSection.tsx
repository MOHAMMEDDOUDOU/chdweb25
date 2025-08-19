"use client"

import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import type { ReactNode } from "react"

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "fade"
}

export function AnimatedSection({ children, className = "", delay = 0, direction = "up" }: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation()

  const getTransformClass = () => {
    if (!isVisible) {
      switch (direction) {
        case "up":
          return "translate-y-20 opacity-0"
        case "down":
          return "-translate-y-20 opacity-0"
        case "left":
          return "translate-x-20 opacity-0"
        case "right":
          return "-translate-x-20 opacity-0"
        case "fade":
          return "opacity-0"
        default:
          return "translate-y-20 opacity-0"
      }
    }
    return "translate-y-0 translate-x-0 opacity-100"
  }

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${getTransformClass()} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
