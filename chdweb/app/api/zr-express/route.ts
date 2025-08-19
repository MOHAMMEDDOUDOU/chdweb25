import { type NextRequest, NextResponse } from "next/server"

const ZR_EXPRESS_API_URL = "https://procolis.com/api_v1"
const ZR_EXPRESS_TOKEN = "a16ca0a3cefb4a9c728886f8572cd524d30569b67f3141ec722e600995c07a54"
const ZR_EXPRESS_KEY = "3adcb49b5f0147aaa68d84bfac7b8bb0"

// خريطة الولايات مع أرقامها
const WILAYA_MAP: { [key: string]: string } = {
  أدرار: "01",
  الشلف: "02",
  الأغواط: "03",
  "أم البواقي": "04",
  باتنة: "05",
  بجاية: "06",
  بسكرة: "07",
  بشار: "08",
  البليدة: "09",
  البويرة: "10",
  تمنراست: "11",
  تبسة: "12",
  تلمسان: "13",
  تيارت: "14",
  "تيزي وزو": "15",
  الجزائر: "16",
  الجلفة: "17",
  جيجل: "18",
  سطيف: "19",
  سعيدة: "20",
  سكيكدة: "21",
  "سيدي بلعباس": "22",
  عنابة: "23",
  قالمة: "24",
  قسنطينة: "25",
  المدية: "26",
  مستغانم: "27",
  المسيلة: "28",
  معسكر: "29",
  ورقلة: "30",
  وهران: "31",
  البيض: "32",
  إليزي: "33",
  "برج بوعريريج": "34",
  بومرداس: "35",
  الطارف: "36",
  تندوف: "37",
  تيسمسيلت: "38",
  الوادي: "39",
  خنشلة: "40",
  "سوق أهراس": "41",
  تيبازة: "42",
  ميلة: "43",
  "عين الدفلى": "44",
  النعامة: "45",
  "عين تموشنت": "46",
  غرداية: "47",
  غليزان: "48",
  تيميمون: "49",
  "برج باجي مختار": "50",
  "أولاد جلال": "51",
  "بني عباس": "52",
  "عين صالح": "53",
  "عين قزام": "54",
  تقرت: "55",
  جانت: "56",
  المغير: "57",
  المنيعة: "58",
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerName, customerPhone, wilaya, commune, address, products, deliveryType, totalAmount } = body

    // تحويل نوع التوصيل
    const typelivraison = deliveryType === "office" ? "1" : "0"

    // الحصول على رقم الولاية
    const wilayaId = WILAYA_MAP[wilaya] || "16" // الجزائر كافتراضي

    // إنشاء رقم تتبع فريد
    const tracking = `CB${Date.now()}`

    // تحضير بيانات الطلبية لـ ZR Express
    const zrExpressData = {
      Colis: [
        {
          Tracking: tracking,
          TypeLivraison: typelivraison,
          TypeColis: "0", // عادي
          Confrimee: "", // فارغ للطلبيات الجديدة
          Client: customerName,
          MobileA: customerPhone,
          MobileB: "", // فارغ
          Adresse: address,
          IDWilaya: wilayaId,
          Commune: commune,
          Total: totalAmount.toString(),
          Note: "", // فارغ كما طلب المستخدم
          TProduit: products.map((p: any) => `${p.name} (${p.size}) x${p.quantity}`).join(", "),
          id_Externe: tracking,
          Source: "",
        },
      ],
    }

    // إرسال الطلبية إلى ZR Express
    const response = await fetch(`${ZR_EXPRESS_API_URL}/add_colis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: ZR_EXPRESS_TOKEN,
        key: ZR_EXPRESS_KEY,
      },
      body: JSON.stringify(zrExpressData),
    })

    const result = await response.json()

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: "تم إرسال الطلبية إلى ZR Express بنجاح",
        tracking: tracking,
        zrResponse: result,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "فشل في إرسال الطلبية إلى ZR Express",
          error: result,
        },
        { status: 400 },
      )
    }
  } catch (error: any) {
    console.error("خطأ في API ZR Express:", error)
    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ في الخادم",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
