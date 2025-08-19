"use client"
import Link from 'next/link'

export default function AuthPlaceholder() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-100 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-extrabold mb-2 text-gray-800">تسجيل الدخول / إنشاء الحساب</h1>
        <p className="text-gray-600 mb-6">هذه صفحة مؤقتة. سيتم تفعيل التسجيل لاحقاً.</p>
        <Link href="/" className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-2 rounded-full">عودة إلى الرئيسية</Link>
      </div>
    </div>
  )
}
