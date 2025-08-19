import Link from "next/link"
import { FaCheckCircle } from "react-icons/fa"

export default function OrderSuccess() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#fff6fa] via-[#fbeee6] to-[#f7e7f0] px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-6 border-4 border-[#C29B87]/30">
        <FaCheckCircle size={64} className="text-green-500 mb-2" />
        <h1 className="text-3xl font-extrabold text-[#C29B87] mb-2">تم إرسال طلبك بنجاح!</h1>
        <p className="text-lg text-gray-700 mb-4 text-center">
          شكراً لثقتك بنا.<br/>
          سيتم التواصل معك قريباً.<br/>
          التوصيل خلال 2 إلى 5 أيام.
        </p>
        <Link href="/" className="px-6 py-3 rounded-lg bg-[#C29B87] text-white font-bold shadow hover:bg-[#a67c52] transition text-lg">العودة للرئيسية</Link>
      </div>
    </div>
  )
}
