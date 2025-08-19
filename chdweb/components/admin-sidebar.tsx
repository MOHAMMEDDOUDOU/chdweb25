"use client"
import Link from "next/link"
import { LayoutDashboard, Package, ShoppingCart, LogOut, Menu, X } from "lucide-react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/offers", icon: Package, label: "Offers" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
]

export function AdminSidebar({ className = "", ...props }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    router.push("/admin")
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-black/60 backdrop-blur-md rounded-full p-3 text-white hover:bg-black/80 transition-colors"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle admin menu"
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex fixed top-0 left-0 h-full w-20 flex-col items-center py-6 gap-4 bg-black/60 backdrop-blur-md rounded-r-3xl shadow-2xl z-30 ${className}`}
        {...props}
      >
        <div className="mb-6">
          <Link href="/">
            <Image
              src="https://res.cloudinary.com/dldvpyait/image/upload/cosimbelle_vrcgcw.png"
              alt="Logo"
              width={64}
              height={64}
              className="object-contain"
            />
          </Link>
        </div>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href))
          return (
            <Link
              href={item.href}
              key={item.href}
              className={`group flex items-center justify-center w-12 h-12 rounded-full mb-2 relative transition-colors duration-200 shadow-md
              ${isActive ? "bg-orange-500/90 border-2 border-orange-300 text-white shadow-orange-400/30" : "bg-black/70 hover:bg-orange-500/80 text-gray-200"}`}
              title={item.label}
            >
              <item.icon
                className={`w-6 h-6 transition-colors duration-200 ${isActive ? "text-white" : "group-hover:text-white text-gray-200"}`}
              />
              <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-black/80 text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity duration-200">
                {item.label}
              </span>
            </Link>
          )
        })}

        <button
          onClick={handleLogout}
          className="group flex items-center justify-center w-12 h-12 rounded-full mb-2 relative transition-colors duration-200 shadow-md bg-red-600/70 hover:bg-red-600/90 text-gray-200 mt-auto"
          title="تسجيل الخروج"
        >
          <LogOut className="w-6 h-6 transition-colors duration-200 group-hover:text-white text-gray-200" />
          <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-black/80 text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity duration-200">
            تسجيل الخروج
          </span>
        </button>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`md:hidden fixed top-0 left-0 h-full w-64 flex flex-col bg-black/90 backdrop-blur-md shadow-2xl z-50 transform transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-center py-8 border-b border-orange-500/20">
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>
            <Image
              src="https://res.cloudinary.com/dldvpyait/image/upload/cosimbelle_vrcgcw.png"
              alt="Logo"
              width={64}
              height={64}
              className="object-contain"
            />
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href))
            return (
              <Link
                href={item.href}
                key={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "bg-orange-500/90 text-white shadow-lg"
                    : "text-gray-200 hover:bg-orange-500/20 hover:text-white"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="w-6 h-6" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="px-4 py-6 border-t border-orange-500/20">
          <button
            onClick={() => {
              handleLogout()
              setMobileMenuOpen(false)
            }}
            className="flex items-center gap-4 px-4 py-3 rounded-lg w-full text-gray-200 hover:bg-red-600/20 hover:text-white transition-colors duration-200"
          >
            <LogOut className="w-6 h-6" />
            <span className="font-medium">تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  )
}

// Also export as default for compatibility
export default AdminSidebar
