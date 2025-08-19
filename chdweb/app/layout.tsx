import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "cosmibelle",
  description: "Created with v0",
  generator: "v0.dev",
  icons: {
    icon: [
      { url: "https://res.cloudinary.com/dldvpyait/image/upload/cosimbelle_vrcgcw.png", sizes: "64x64" },
      { url: "https://res.cloudinary.com/dldvpyait/image/upload/cosimbelle_vrcgcw.png", sizes: "128x128" },
      { url: "https://res.cloudinary.com/dldvpyait/image/upload/cosimbelle_vrcgcw.png", sizes: "256x256" },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
