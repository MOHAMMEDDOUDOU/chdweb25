"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import type React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import ImageGallery from "@/components/ImageGallery"
import NoSSR from "@/components/NoSSR"

import { useSearchParams } from "next/navigation"

const WILAYAS = [
  { code: 1, name: "أدرار", tarif: 1400, stopDesk: 900 },
  { code: 2, name: "الشلف", tarif: 850, stopDesk: 450 },
  { code: 3, name: "الأغواط", tarif: 950, stopDesk: 550 },
  { code: 4, name: "أم البواقي", tarif: 900, stopDesk: 500 },
  { code: 5, name: "باتنة", tarif: 900, stopDesk: 500 },
  { code: 6, name: "بجاية", tarif: 800, stopDesk: 400 },
  { code: 7, name: "بسكرة", tarif: 950, stopDesk: 550 },
  { code: 8, name: "بشار", tarif: 1200, stopDesk: 800 },
  { code: 9, name: "البليدة", tarif: 600, stopDesk: 350 },
  { code: 10, name: "البويرة", tarif: 750, stopDesk: 400 },
  { code: 11, name: "تمنراست", tarif: 1600, stopDesk: 1200 },
  { code: 12, name: "تبسة", tarif: 1000, stopDesk: 600 },
  { code: 13, name: "تلمسان", tarif: 900, stopDesk: 500 },
  { code: 14, name: "تيارت", tarif: 850, stopDesk: 450 },
  { code: 15, name: "تيزي وزو", tarif: 750, stopDesk: 400 },
  { code: 16, name: "الجزائر", tarif: 500, stopDesk: 300 },
  { code: 17, name: "الجلفة", tarif: 900, stopDesk: 500 },
  { code: 18, name: "جيجل", tarif: 850, stopDesk: 450 },
  { code: 19, name: "سطيف", tarif: 800, stopDesk: 450 },
  { code: 20, name: "سعيدة", tarif: 900, stopDesk: 500 },
  { code: 21, name: "سكيكدة", tarif: 850, stopDesk: 450 },
  { code: 22, name: "سيدي بلعباس", tarif: 900, stopDesk: 500 },
  { code: 23, name: "عنابة", tarif: 900, stopDesk: 500 },
  { code: 24, name: "قالمة", tarif: 900, stopDesk: 500 },
  { code: 25, name: "قسنطينة", tarif: 850, stopDesk: 450 },
  { code: 26, name: "المدية", tarif: 700, stopDesk: 400 },
  { code: 27, name: "مستغانم", tarif: 850, stopDesk: 450 },
  { code: 28, name: "المسيلة", tarif: 850, stopDesk: 450 },
  { code: 29, name: "معسكر", tarif: 850, stopDesk: 450 },
  { code: 30, name: "ورقلة", tarif: 1100, stopDesk: 700 },
  { code: 31, name: "وهران", tarif: 800, stopDesk: 450 },
  { code: 32, name: "البيض", tarif: 1000, stopDesk: 600 },
  { code: 33, name: "إليزي", tarif: 1600, stopDesk: 1200 },
  { code: 34, name: "برج بوعريريج", tarif: 800, stopDesk: 450 },
  { code: 35, name: "بومرداس", tarif: 650, stopDesk: 350 },
  { code: 36, name: "الطارف", tarif: 950, stopDesk: 550 },
  { code: 37, name: "تندوف", tarif: 1500, stopDesk: 1100 },
  { code: 38, name: "تيسمسيلت", tarif: 850, stopDesk: 450 },
  { code: 39, name: "الوادي", tarif: 1000, stopDesk: 600 },
  { code: 40, name: "خنشلة", tarif: 950, stopDesk: 550 },
  { code: 41, name: "سوق أهراس", tarif: 950, stopDesk: 550 },
  { code: 42, name: "تيبازة", tarif: 650, stopDesk: 350 },
  { code: 43, name: "ميلة", tarif: 850, stopDesk: 450 },
  { code: 44, name: "عين الدفلى", tarif: 750, stopDesk: 400 },
  { code: 45, name: "النعامة", tarif: 1100, stopDesk: 700 },
  { code: 46, name: "عين تموشنت", tarif: 850, stopDesk: 450 },
  { code: 47, name: "غرداية", tarif: 1000, stopDesk: 600 },
  { code: 48, name: "غليزان", tarif: 850, stopDesk: 450 },
  { code: 49, name: "تيميمون", tarif: 1400, stopDesk: 900 },
  { code: 50, name: "برج باجي مختار", tarif: 1500, stopDesk: 1100 },
  { code: 51, name: "أولاد جلال", tarif: 1000, stopDesk: 600 },
  { code: 52, name: "بني عباس", tarif: 1300, stopDesk: 900 },
  { code: 53, name: "عين صالح", tarif: 1500, stopDesk: 1100 },
  { code: 54, name: "عين قزام", tarif: 1600, stopDesk: 1200 },
  { code: 55, name: "تقرت", tarif: 1000, stopDesk: 600 },
  { code: 56, name: "جانت", tarif: 1600, stopDesk: 1200 },
  { code: 57, name: "المغير", tarif: 1100, stopDesk: 700 },
  { code: 58, name: "المنيعة", tarif: 1200, stopDesk: 800 },
]

const COMMUNES: { [key: number]: string[] } = {
  1: [
    "أدرار",
    "تامست",
    "شاروين",
    "رقان",
    "إن زغمير",
    "تيت",
    "قصر قدور",
    "تسابيت",
    "فنوغيل",
    "أولاد سعيد",
    "زاوية كنتة",
    "أولف",
    "تامنطيت",
    "فقارة الزوى",
    "تيلوا",
    "سبع",
    "أولاد أحمد تيمي",
    "بودة",
    "أقبلي",
    "أولاد عيسى",
    "تسالت",
    "دلدول",
    "سالي",
    "أكابلي",
    "متارفة",
  ],
  2: [
    "الشلف",
    "تنس",
    "بنايرية",
    "الكريمية",
    "تادجنانت",
    "تاوقريت",
    "بني حواء",
    "صبحة",
    "حرشون",
    "أولاد فارس",
    "بوقادير",
    "بني راشد",
    "تلعصة",
    "الهرانفة",
    "أولاد عباس",
    "سيدي عكاشة",
    "بوزغاية",
    "إبراهيمية",
    "أبو الحسن",
    "المرسى",
    "الظهرة",
    "أولاد بن عبد القادر",
    "بريرة",
    "بني بوعتاب",
    "أم الذروع",
    "العطاف",
    "الأبيض مجاجة",
    "وادي قوسين",
    "الحجاج",
    "سندي عامر",
    "الحرانفة",
    "دوار الماء",
    "الزبوجة",
    "وادي الفضة",
    "بوكادير",
  ],
  3: [
    "الأغواط",
    "قصر الحيران",
    "عين ماضي",
    "تاجموت",
    "قلتة سيدي سعد",
    "عين سيدي علي",
    "أفلو",
    "الحويطة",
    "سيدي مخلوف",
    "حاسي الدلاعة",
    "حاسي الرمل",
    "عين الإبل",
    "الغيشة",
    "بريدة",
    "الحاج المشري",
    "سبقاق",
    "تاويالة",
    "الخنق",
    "وادي مرة",
    "وادي مزي",
    "بن ناصر بن شهرة",
    "سيدي بوزيد",
  ],
  4: [
    "أم البواقي",
    "عين البيضاء",
    "عين كرشة",
    "عين فكرون",
    "الرحية",
    "بئر شهيدة",
    "مسكيانة",
    "عين الذهب",
    "أولاد حملة",
    "سيقوس",
    "بحير الشرقي",
    "فكيرينة",
    "سوق نعمان",
    "ضلعة",
    "عين بابوش",
    "بلالة",
    "أولاد زواي",
    "الحرملية",
    "كسارة",
    "الفجوج بوغرارة سعدي",
    "حنشير توميات",
    "الزرق",
  ],
  5: [
    "باتنة",
    "غسيرة",
    "معافة",
    "مروانة",
    "تكوت",
    "نقاوس",
    "عين التوتة",
    "بيطام",
    "عزيل عبد القادر",
    "أريس",
    "كيمل",
    "تيمقاد",
    "رأس العيون",
    "شير",
    "أولاد سلام",
    "تالخمت",
    "بوزينة",
    "منعة",
    "المعذر",
    "تازولت",
    "جرمة",
    "أولاد عوف",
    "الحاسي",
    "تندوت",
    "عين جاسر",
    "أولاد فاضل",
    "فسديس",
    "بني فضالة الحقانية",
    "سريانة",
    "حيدوسة",
    "إشمول",
    "فوم الطوب",
    "بن فكيرة",
    "أولاد سي سليمان",
    "بوعقال",
    "لازرو",
    "بومقر",
    "رحبات",
    "لمسان",
    "عيون العصافير",
    "جزار",
    "عين ياقوت",
    "سقانة",
    "مدوكال",
    "تكسبت",
    "غوفي",
    "الشعبة",
    "تيلاطو",
    "بولهيلات",
    "إنوغيسن",
  ],
  6: [
    "بجاية",
    "أميزور",
    "فرعون",
    "تيشي",
    "صدوق",
    "شلاطة العذاورة",
    "سوق الاثنين",
    "أمالو",
    "إفري أوزلاقن",
    "تالة حمزة",
    "أوقاس",
    "بني جليل",
    "بربشة",
    "بوحمزة",
    "درقينة",
    "سيدي عيش",
    "العنصر",
    "تيفرا",
    "إغيل علي",
    "فناية الماتن",
    "تاسكريوت",
    "أكبو",
    "خراطة",
    "سيدي أيش",
    "تامريجت",
    "إيفلاسن",
    "أيت رزين",
    "تيمزريت",
    "بوخليفة",
    "أدكار",
    "تامقرة",
    "أوزلاقن",
    "بني معوش",
    "بني كسيلة",
    "تيزي نبربر",
    "أقبو",
    "تاوريرت إيغيل",
    "أيت سماعيل",
    "كنديرة",
    "أولاد عيدون",
    "تامالوس",
    "أكفادو",
    "بوجليل",
    "إغرام",
    "أيت داود",
    "أيت عبد الله",
  ],
  7: [
    "بسكرة",
    "أولاد جلال",
    "سيدي عقبة",
    "سيدي خالد",
    "زريبة الوادي",
    "طولقة",
    "فوغالة",
    "براني",
    "مشونش",
    "أومش",
    "الحوش",
    "عين ناقة",
    "الزيبان",
    "أولاد ساسي",
    "الشعيبة",
    "مليلي",
    "الحاجب",
    "ليوة",
    "شتمة",
    "أولاد عامر",
    "الدوسن",
    "خنقة سيدي ناجي",
    "لوطاية",
    "أورلال",
    "جمورة",
    "منقوضة",
    "الفيض",
    "الغروس",
    "الحوضين",
  ],
  8: [
    "بشار",
    "العبادلة",
    "بني عباس",
    "كرزاز",
    "أولاد خضير",
    "الواتة",
    "تبلبالة",
    "بني ونيف",
    "القنادسة",
    "إقلي",
    "تامتارت",
    "بوكايس",
    "مشرية",
    "موغل",
    "عبادلة",
    "لحمر",
    "تيمودي",
    "بوعلام",
  ],
  9: [
    "البليدة",
    "الشفة",
    "أولاد يعيش",
    "بوعرفة",
    "الأربعطاش",
    "سوحان",
    "شبلي",
    "أولاد سلامة",
    "وادي العلايق",
    "مفتاح",
    "حمام ملوان",
    "بن خليل",
    "بوقرة",
    "أولاد عايش",
    "الشريعة",
    "بني تامو",
    "بوفاريك",
    "لرباطاش",
    "وادي الجمعة",
    "شيفة",
    "الصومعة",
    "بني مراد",
    "بوعينان",
  ],
  10: [
    "البويرة",
    "سور الغزلان",
    "أين بسام",
    "بئر غبالو",
    "برج أوخريص",
    "الهاشمية",
    "معالة",
    "أولاد راشد",
    "بشلول",
    "بني عيسى",
    "الأسنام",
    "أولاد عيدون",
    "رفعة",
    "أجبار",
    "تقديت",
    "حيزر",
    "أين العلوي",
    "أين لحجر",
    "الخبوزية",
    "أين تركي",
    "أين الحديد",
    "أين القصير",
  ],
  11: ["تمنراست", "عين قزام", "عين صالح", "إدلس", "فقارة الزوى", "عين أميناس", "تازروك"],
  12: [
    "تبسة",
    "بئر العاتر",
    "الشريعة",
    "العقلة",
    "نقرين",
    "بير الذهب",
    "الحويجبات",
    "الحمامات",
    "أم علي",
    "ثليجان",
    "العوينات",
    "الكويف",
    "مرسط",
    "أولاد نعمان",
    "بولحاف الدير",
    "بوخضرة",
    "الماء الأبيض",
    "صفصاف الوسرى",
    "بئر مقدم",
    "العقلة البيضاء",
    "أولاد سرغين",
    "فركان",
    "الونزة",
  ],
  13: [
    "تلمسان",
    "المنصورة",
    "صبرة",
    "عين تالوت",
    "الرمشي",
    "الحناية",
    "ندرومة",
    "بني صاف",
    "الغزوات",
    "سوق الاربعاء",
    "سيدي الجيلالي",
    "سبدو",
    "بني سميل",
    "عين فزة",
    "أولاد ميمون",
    "عين يوسف",
    "فلاوسن",
    "عزايل",
    "سيدي عبد الله",
    "بني بوسعيد",
    "بني ورسوس",
    "عين النحالة",
    "هنين",
    "تيانت",
    "أولاد رياح",
    "بوحلو",
    "سوق الثلاثاء",
    "سيدي مجاهد",
    "بني سنوس",
    "بني بحدل",
    "عين كبيرة",
    "مغنية",
    "حمام بوغرارة",
    "عين فتاح",
    "العريشة",
  ],
  14: [
    "تيارت",
    "عين كرمس",
    "عين ذهب",
    "فرندة",
    "قصر الشلالة",
    "سوقر",
    "مهدية",
    "سيدي علي ملال",
    "جعفرة",
    "مدروسة",
    "دحموني",
    "رحوية",
    "ملاكو",
    "عين الحديد",
    "قرطوفة",
    "عين بختي",
    "تاقدمت",
    "سيدي حسني",
    "رشايقة",
    "ندرومة",
    "سيدي عبد الغني",
    "سرغين",
    "زمالة الأمير عبد القادر",
    "عين زارت",
    "تخمارت",
    "سيدي بختي",
    "توسنينة",
    "فايجة",
    "بوقطب",
    "مشرع الصفا",
  ],
  15: [
    "تيزي وزو",
    "عزازقة",
    "أزفون",
    "تيغزيرت",
    "ماكودة",
    "أولاد عيسى",
    "فريحة",
    "سوق الاثنين",
    "مشدالة",
    "أقني قوقن",
    "إفرحونن",
    "عين الحمام",
    "أكبيل",
    "بوجيمة",
    "إيفليسن",
    "بوغني",
    "أيت عيسى ميمون",
    "يطافن",
    "بني عيسى",
    "أيت أقوشة",
    "أيت بوعدو",
    "أيت خليلي",
    "أيت يحيى",
    "أيت محمود",
  ],
  16: [
    "الجزائر الوسطى",
    "باب الزوار",
    "باب الوادي",
    "بئر مراد رايس",
    "بئر توتة",
    "بئر خادم",
    "باش جراح",
    "بلكور",
    "بني مسوس",
    "برج البحري",
    "برج الكيفان",
    "الحراش",
    "حسين داي",
    "المحمدية",
    "القبة",
    "سيدي امحمد",
    "الدار البيضاء",
    "العاشور",
    "بوزريعة",
    "الرويبة",
    "رغاية",
    "الخروبة",
    "الحمامات",
    "سيدي موسى",
    "أولاد فايت",
    "سوق الأحد",
    "زرالدة",
    "الدويرة",
    "تسالة المرجة",
    "أولاد شبل",
    "شراقة",
    "حرازة",
    "المرادية",
  ],
  17: [
    "الجلفة",
    "عين معبد",
    "حاسي بحبح",
    "زكار",
    "عين الإبل",
    "سيدي لعجال",
    "حد الصحاري",
    "الإدريسية",
    "دار الشيوخ",
    "بئر العاتر",
    "القادرية",
    "عمورة",
    "الشارف",
    "فيض البطمة",
    "أين ماعبد",
    "تعظميت",
    "الدويس",
    "حاسي الرمل",
    "سيدي بايزيد",
    "أولاد نايل",
    "بنهار",
    "الحيران",
    "عين الشهداء",
    "الغيشة",
    "أم العسل",
    "تاجروت",
  ],
  18: [
    "جيجل",
    "الطاهير",
    "الأمير عبد القادر",
    "شقفة",
    "سيدي معروف",
    "الميلية",
    "فرجيوة",
    "العوانة",
    "سيدي عبد العزيز",
    "الكنار",
    "برج الطهر",
    "جيملة",
    "بودريعة بن ياجيس",
    "القاوس",
    "غبالة",
    "بوراوي بلهادف",
    "الجمعة بني حبيبي",
    "سلمى بن زيادة",
    "كاوس",
    "زيامة منصورية",
    "أولاد يحيى خدروش",
    "بوسيف أولاد عسكر",
  ],
  19: [
    "سطيف",
    "العلمة",
    "عين أرنات",
    "أولاد تبان",
    "بئر حدادة",
    "قجال",
    "بابور",
    "عين عباسة",
    "حمام السوخنة",
    "مجانة",
    "صالح باي",
    "عين الكبيرة",
    "دراع قبيلة",
    "حمام قرقور",
    "أولاد صابر",
    "بوقاعة",
    "أولاد سيدي أحمد",
    "الرصفة",
    "أولاد عدوان",
    "بني عزيز",
    "بني ورثيلان",
    "عين السبت",
    "تازولت",
    "جميلة",
    "بني فودة",
    "الأولجة",
    "تاجنانت",
    "بني موحلي",
    "مزلوق",
    "بني حبيبي",
    "كركرة",
    "رصفة",
  ],
  20: [
    "سعيدة",
    "دوي ثابت",
    "عين الحديد",
    "أولاد خالد",
    "مولاي العربي",
    "يوب",
    "حاسي الدحو",
    "سيدي أحمد",
    "عين سكهونة",
    "سيدي عامر",
    "عين سلطان",
    "أولاد براهيم",
    "تيرسين",
    "حساسنة",
  ],
  21: [
    "سكيكدة",
    "عزابة",
    "الحدائق",
    "فلفلة",
    "القل",
    "بني ولبان",
    "أولاد عطية",
    "سيدي مزغيش",
    "عين شرشار",
    "الحروش",
    "عين قشرة",
    "بن عزوز",
    "عين بوزيان",
    "أم الطوب",
    "عين كشرة",
    "الزردازة",
    "صالح بوشحمة",
    "رمضان جمال",
    "خناق مايون",
    "أولاد حبابة",
    "تمالوس",
    "كركوب",
    "واد الزهور",
    "عمارة",
  ],
  22: [
    "سيدي بلعباس",
    "تسالة",
    "سيدي علي بوسيدي",
    "بن بادس",
    "سفيزف",
    "مولاي سليسن",
    "تلاغ",
    "مقطع الدوز",
    "سيدي خالد",
    "حاسي زهانة",
    "أولاد ميمون",
    "تنيرة",
    "سيدي علي بن يوب",
    "سيدي يعقوب",
    "رأس العين سيدي يوسف",
    "لمطار",
    "سيدي داهو زكريا",
    "مصطفى بن براهيم",
    "بوجبهة",
    "سيدي لحسن",
    "حساين",
    "عين تيندلت",
    "مرحوم",
    "تافسير",
  ],
  23: [
    "عنابة",
    "الحجار",
    "سرايدي",
    "عين الباردة",
    "الشط",
    "سيدي عمار",
    "البوني",
    "برحال",
    "التريفة",
    "عزابة",
    "الكدرة",
  ],
  24: [
    "قالمة",
    "بوحمدان",
    "بلخير",
    "بوحشانة",
    "هليوبوليس",
    "خميسة",
    "عين العربي",
    "عين الحجر",
    "بوماهر",
    "نشماية",
    "عين بن بيضاء",
    "عين مخلوف",
    "عين لارباع",
    "حمام دباغ",
    "بني مزلين",
    "عين صندل",
    "حمام النبايل",
    "عين حساينة",
  ],
  25: [
    "قسنطينة",
    "حامة بوزيان",
    "عين عبيد",
    "زيغود يوسف",
    "الخروب",
    "عين سمارة",
    "ديدوش مراد",
    "بن بادس",
    "مسعود بوجريو",
    "بني حميدان",
    "أولاد رحمون",
    "ابن زياد",
  ],
  26: [
    "المدية",
    "أولاد عنتر",
    "بوغار",
    "عين بوسيف",
    "شلالة العذاورة",
    "بئر بن عابد",
    "سيدي نعمان",
    "قصر البخاري",
    "عزيز",
    "الحوضين",
    "تابلاط",
    "سيدي زايان",
    "مفتاح",
    "سيدي دامد",
    "الأمين",
    "درعة",
    "أولاد إبراهيم",
    "جواب",
    "خمس جوامع",
    "العمارية",
    "بني سليمان",
    "أولاد دايد",
    "سوقر",
  ],
  27: [
    "مستغانم",
    "حاسي ماماش",
    "فرندة",
    "عين تادلس",
    "خير الدين",
    "عين النويصي",
    "سيدي علي",
    "صيادة",
    "عشعاشة",
    "مزغران",
    "عين بودينار",
    "حجاج",
    "الطواهرية",
    "صور الغزلان",
    "واد الخير",
    "خضرة",
    "منصورة",
    "سيرات",
    "بوقيرات",
  ],
  28: [
    "المسيلة",
    "بوسعادة",
    "سيدي عامر",
    "المعاضيد",
    "أولاد درج",
    "خبانة",
    "المحمل",
    "حمام الضلعة",
    "أولاد عدي قبالة",
    "بئر فضة",
    "تامسة",
    "عين الريش",
    "عين فارس",
    "سليم",
    "بن سرور",
    "محمد بوضياف",
    "أولاد سيدي براهيم",
    "الزرزور",
    "مقرة",
    "برهوم",
    "أولاد مدرج",
    "الحوامد",
  ],
  29: [
    "معسكر",
    "سيق",
    "تيزي",
    "عين فراس",
    "الحشم",
    "عين فكان",
    "سيدي قادة",
    "الغروس",
    "بوحنيفي��",
    "الماموني",
    "عوف",
    "سيدي عبد الجبار",
    "الحلوي",
    "نسمة",
    "فروحة",
    "الكرط",
    "عقاز",
    "الحاكمية",
    "الغومري",
  ],
  30: [
    "ورقلة",
    "حاسي مسعود",
    "تقرت",
    "المقارين",
    "تماسين",
    "الطيبات",
    "انقوسة",
    "الحجيرة",
    "الرويسات",
    "عين البيضاء",
    "سيدي خويلد",
    "حاسي بن عبد الله",
    "نزلة زمول",
    "بليدة عمر",
    "تورت",
  ],
  31: [
    "وهران",
    "السانيا",
    "بئر الجير",
    "حاسي بونيف",
    "عين الترك",
    "العنصر",
    "بوتليليس",
    "حاسي مفسوخ",
    "سيدي الشحمي",
    "مسرغين",
    "بوفاطيس",
    "طفراوي",
    "عين الكرمة",
    "أرزيو",
    "بطيوة",
    "مرسى الحجاج",
    "حاسي بن عقبة",
    "سيدي بن يبقى",
  ],
  32: [
    "البيض",
    "بوقطب",
    "بريزينة",
    "الشلالة",
    "كاف الأحرار",
    "أربوات",
    "بوعلام",
    "الأبيض سيدي الشيخ",
    "رقاصة",
    "ستيتن",
    "بن زيرق",
    "الغاسول",
    "روقيبة",
    "الشقيق",
    "عين الأورك",
    "مطارفة",
  ],
  33: ["إليزي", "جانت", "برج عمر إدريس", "ديبديب", "إن أميناس", "برج الحواس"],
  34: [
    "برج بوعريريج",
    "رأس الوادي",
    "المنصورة",
    "بورداج",
    "الحمادية",
    "المهير",
    "تقلعيت",
    "عين تسرة",
    "برج زمورة",
    "الماين",
    "بن داود",
    "الأشعاشنة",
    "تيكستار",
    "العش",
    "الربعي",
    "حرازة",
    "غيلاسة",
    "أولاد سيدي براهيم",
    "سيدي أمبارك",
    "تسامرت",
    "الحسناوة",
    "أولاد براهيم",
  ],
  35: [
    "بومرداس",
    "نصر الله",
    "الخروبة",
    "برج منايل",
    "بغلية",
    "سيدي داود",
    "إسر",
    "زموري",
    "الثنية",
    "تيجلابين",
    "أفير",
    "بن شود",
    "الناصرية",
    "شعبة العامر",
    "أولاد موسى",
    "سي مصطفى",
    "سوق الحد",
    "بودواو",
    "دلس",
    "لقاطة",
    "أولاد عيسى",
    "حمادي كرومة",
    "خميس الخشنة",
    "الكورسو",
  ],
  36: [
    "الطارف",
    "بوثلجة",
    "عين العسل",
    "القالة",
    "الشافية",
    "بسباس",
    "بحيرة الطيور",
    "شيحاني",
    "عين الكرمة",
    "الذرعان",
    "عصفور",
    "الشط",
    "بن مهيدي",
  ],
  37: ["تندوف", "أم العسل"],
  38: [
    "تيسمسيلت",
    "خميستي",
    "العسافية",
    "بوقايد",
    "لرجام",
    "سيدي العنتري",
    "أولاد بسام",
    "تمالوس",
    "سيدي بوتوشنت",
    "أمجدل",
    "سيدي سليمان",
    "لايون",
    "بردة",
    "لعلايمية",
    "بني شعيب",
    "تنس",
  ],
  39: [
    "الوادي",
    "قمار",
    "الرباح",
    "المقرن",
    "كوينين",
    "الطالب العربي",
    "حاسي خليفة",
    "تريفاوي",
    "سطيل",
    "حساني عبد الكريم",
    "الدبيلة",
    "جامعة",
    "سيدي عون",
  ],
  40: [
    "خنشلة",
    "متوسة",
    "كايس",
    "باغاي",
    "الحامة",
    "بوحمامة",
    "الطوالبة",
    "عين الطويلة",
    "تامزة",
    "انسيقة",
    "الرميلة",
    "شليا",
    "أولاد رشاش",
    "الطوق",
    "المحمل",
    "يابوس",
    "خيران",
  ],
  41: [
    "سوق أهراس",
    "مداوروش",
    "بئر بوحوش",
    "تاورة",
    "دريعة",
    "هدادة",
    "خميسة",
    "أولاد إدريس",
    "أولاد مؤمن",
    "سيدي فردج",
    "الزعرورية",
    "الويلدجة",
    "هنانشة",
    "مشروحة",
  ],
  42: [
    "تيبازة",
    "القليعة",
    "حجوط",
    "شرشال",
    "دلس",
    "بني ميلك",
    "حمدانية",
    "أحمد راشدي",
    "الناصرية",
    "بوركيكة",
    "دوار الدوم",
    "سيدي راشد",
    "فوكة",
    "سيدي غيلاس",
    "الشفة",
  ],
  43: [
    "ميلة",
    "فرجيوة",
    "شلغوم العيد",
    "تاجنانت",
    "قرارم قوقة",
    "بوحاتم",
    "رواشد",
    "حمالة",
    "عين مليلة",
    "عين تين",
    "أولاد خلوف",
    "تسدان حدادة",
    "سيدي مروان",
    "عين البيضاء",
    "الشيقارة",
    "تيبركانت",
    "يحي بني قشة",
    "عين بوزيان",
  ],
  44: [
    "عين الدفلى",
    "خميس مليانة",
    "العطاف",
    "العبادية",
    "بوقيرات",
    "الصبحة",
    "حوش الدلاعة",
    "تاشتة زقاغطة",
    "سيدي شعيب",
    "الماين",
    "بربوشة",
    "أولاد عباس",
    "الحجاج",
    "رويبة",
    "بئر أولاد خليفة",
    "الأبيار",
    "جندل",
    "عين تركي",
    "عين السلطان",
    "بوعيش",
  ],
  45: [
    "النعامة",
    "عين الصفراء",
    "مشرية",
    "أسلة",
    "تيوت",
    "صفيصيفة",
    "مقمن",
    "قصيبة",
    "عين بن خليل",
    "الحوطة",
    "دجن",
    "كساري",
  ],
  46: [
    "عين تموشنت",
    "الحمادنة",
    "عين الكيحل",
    "عين العربي",
    "أولاد بوجمعة",
    "بوزجار",
    "حاسي الغلة",
    "سيدي بن عدة",
    "أولاد كيحل",
    "الأمير عبد القادر",
    "شعبة الليحم",
    "واد الصباح",
    "العامرية",
    "سيدي بوعدة",
  ],
  47: [
    "غرداية",
    "بريان",
    "متليلي",
    "العطف",
    "ضاية بن ضحوة",
    "المنيعة",
    "حاسي الفحل",
    "حاسي القارة",
    "زلفانة",
    "سبسب",
    "بونورة",
  ],
  48: [
    "غليزان",
    "وادي رهيو",
    "بلعسل بوزقزة",
    "حد شكالة",
    "عمي موسى",
    "سيدي محمد بن علي",
    "سوق الحد",
    "الحمادنة",
    "مندس",
    "الرمكة",
    "أولاد يعيش",
    "بني زنطيس",
    "سيدي سعادة",
    "العلايمية",
  ],
  49: [
    "تيميمون",
    "أولاد سعيد",
    "أولاد أحمد تيمي",
    "تسابيت",
    "تالمين",
    "مطارفة",
    "أوقروت",
    "دلدول",
    "شاروين",
    "قصر قدور",
    "أولاد عيسى",
    "تسالت",
    "فنوغيل",
    "تيت",
    "إن زغمير",
    "رقان",
    "تامست",
    "بودة",
    "أقبلي",
    "سبع",
    "تيلوا",
    "فقارة الزوى",
    "تامنطيت",
    "أولف",
    "زاوية كنتة",
  ],
  50: ["برج باجي مختار", "تيمياوين", "فقارة الزوى", "تيمبكتو"],
  51: [
    "أولاد جلال",
    "سيدي خالد",
    "دوسن",
    "الشعيبة",
    "ليشانة",
    "أولاد ساسي",
    "مليلي",
    "الحاجب",
    "شتمة",
    "أولاد عامر",
    "خنقة سيدي ناجي",
    "لوطاية",
    "أورلال",
    "جمورة",
    "منقوضة",
    "الفيض",
    "الغروس",
    "الحوضين",
  ],
  52: [
    "بني عباس",
    "الواتة",
    "تبلبالة",
    "إقلي",
    "كرزاز",
    "تيمودي",
    "أولاد خضير",
    "العبادلة",
    "بوكايس",
    "مشرية",
    "موغل",
    "لحمر",
    "بوعلام",
    "القنادسة",
    "تامتارت",
    "بني ونيف",
  ],
  53: ["عين صالح", "فقارة الزوى", "عين قزام", "إدلس", "تازروك", "عين أميناس"],
  54: ["عين قزام", "برج عمر إدريس", "تين زاوتين"],
  55: [
    "تقرت",
    "المقارين",
    "تماسين",
    "الطيبات",
    "انقوسة",
    "الحجيرة",
    "الرويسات",
    "عين البيضاء",
    "سيدي خويلد",
    "حاسي بن عبد الله",
    "نزلة زمول",
    "بليدة عمر",
  ],
  56: ["جانت", "برج الحواس", "إليزي", "ديبديب", "إن أميناس"],
  57: ["المغير", "سطيل", "جمعة", "سيدي عمران", "أم الطيور", "المرارة", "حاسي خليفة", "الدبيلة"],
  58: ["المنيعة", "حاسي القارة", "حاسي الفحل", "ضاية بن ضحوة"],
}

interface Product {
  id: string
  name: string
  price: number
  image_url?: string
  images?: string[]
  category?: string
  description?: string
  stock_quantity?: number
  discount_price?: number
  sizes?: string[]
}

export default function SingleProductOrderPage() {
  const params = useParams()
  const productId = params.id as string
  const searchParams = useSearchParams()
  const router = useRouter()

  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [wilaya, setWilaya] = useState(16)
  const [commune, setCommune] = useState("")
  const [deliveryType, setDeliveryType] = useState("home")
  const [loading, setLoading] = useState(false)
  const [productLoading, setProductLoading] = useState(true)

  useEffect(() => {
    async function fetchProduct() {
      if (!productId) return
      setProductLoading(true)
      try {
        // جلب البيانات من API العروض أو المنتجات حسب النوع
        const itemType = searchParams.get('type') === 'offer' ? 'offers' : 'products'
        const res = await fetch(`/api/${itemType}/${productId}`)
        if (res.ok) {
          const data = await res.json()
          setProduct(data)
        }
      } finally {
        setProductLoading(false)
      }
    }
    fetchProduct()
  }, [productId, searchParams])

  useEffect(() => {
    if (deliveryType === "stopDesk") setCommune("")
  }, [deliveryType])

  const selectedWilaya = WILAYAS.find((w) => w.code === Number(wilaya))
  const communesList = COMMUNES[wilaya] || []
  const shipping = deliveryType === "home" ? selectedWilaya?.tarif || 0 : selectedWilaya?.stopDesk || 0
  const overridePriceParam = searchParams.get('price')
  const itemTypeParam = searchParams.get('type')
  const resellerNameParam = searchParams.get('reseller_name')
  const resellerPhoneParam = searchParams.get('reseller_phone')
  const unitPrice = product ? Number(overridePriceParam || product.price) : 0
  const subtotal = product ? unitPrice * quantity : 0
  const total = subtotal + shipping

  async function handleOrder(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !phone || !product) return alert("يرجى ملء جميع الحقول المطلوبة")
    if (deliveryType === "home" && !commune) return alert("يرجى اختيار البلدية")

    setLoading(true)

    const payload = {
      item_type: itemTypeParam === 'offer' ? 'offer' : 'product',
      item_id: product.id,
      item_name: `${product.name}`,
      quantity,
      unit_price: unitPrice,
      subtotal,
      shipping_cost: Number(shipping) || 0,
      total_amount: Number(total),
      customer_name: name.trim(),
      phone_number: phone.replace(/\s/g, ""),
      wilaya: selectedWilaya?.name.trim() || "",
      commune: deliveryType === 'home' ? commune?.trim() : 'غير محدد',
      delivery_type: deliveryType || 'home',
      reseller_price: overridePriceParam ? unitPrice : undefined,
      reseller_name: resellerNameParam || undefined,
      reseller_phone: resellerPhoneParam || undefined,
    }

    const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setLoading(false)

    if (res.ok) {
      router.push("/order/success")
      setName("")
      setPhone("")
      setCommune("")
      setDeliveryType("home")
      setQuantity(1)
    } else {
      alert("حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.")
    }
  }

  if (productLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#3B2922] via-[#71594F] to-[#C29B87] py-16 px-2 flex flex-col items-center justify-center">
        <div className="text-white text-2xl">جاري تحميل المنتج...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#3B2922] via-[#71594F] to-[#C29B87] py-16 px-2 flex flex-col items-center justify-center">
        <div className="text-white text-2xl">المنتج غير موجود</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#3B2922] via-[#71594F] to-[#C29B87] py-16 px-2 flex flex-col items-center">
      <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-4xl flex flex-col gap-12 border-4 border-rose-200">
        <h1 className="text-4xl font-extrabold text-center text-[#C29B87] mb-6 tracking-wide drop-shadow-lg">
          {itemTypeParam === 'offer' ? 'طلب عرض' : 'طلب منتج'}
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* معلومات المنتج */}
          <div className="space-y-6">
            {/* معرض الصور */}
            <NoSSR fallback={
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={product.image_url || "/placeholder.svg?height=400&width=400"}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            }>
              {product.images && product.images.length > 0 ? (
                <ImageGallery 
                  images={product.images} 
                  title={product.name}
                  className="w-full"
                />
              ) : (
                <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={product.image_url || "/placeholder.svg?height=400&width=400"}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </NoSSR>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
              {product.description && <p className="text-gray-600">{product.description}</p>}
              
              {/* عرض السعر والخصم */}
              <div className="space-y-2">
                {product.discount_price && product.discount_price > 0 ? (
                  <div className="space-y-1">
                    {/* عرض سعر الخصم كسعر رئيسي */}
                    <div className="text-3xl font-bold text-rose-600">{product.discount_price} دج</div>
                    {/* عرض السعر الأصلي مشطوب */}
                    <div className="text-2xl font-bold text-gray-400 line-through">{product.price} دج</div>
                    {/* عرض نسبة التخفيض */}
                    <div className="text-sm text-green-600 font-bold">
                      خصم {Math.round(((product.price - product.discount_price) / product.price) * 100)}%
                    </div>
                  </div>
                ) : (
                  <div className="text-3xl font-bold text-rose-600">{product.price} دج</div>
                )}
              </div>

              {/* عرض المقاسات إذا وجدت */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-bold text-gray-700">المقاسات المتوفرة:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* نموذج الطلب */}
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-lg">
                <span>المجموع الفرعي:</span>
                <span>{subtotal} دج</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>تكلفة الشحن:</span>
                <span>{shipping} دج</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-extrabold text-xl text-blue-800">
                  <span>الإجمالي:</span>
                  <span>{total} دج</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleOrder} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-2">نوع التوصيل</label>
                  <select
                    value={deliveryType}
                    onChange={(e) => setDeliveryType(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 focus:border-rose-400 focus:outline-none"
                  >
                    <option value="home">توصيل للمنزل</option>
                    <option value="stopDesk">توصيل للمكتب</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-2">الولاية</label>
                  <select
                    value={wilaya}
                    onChange={(e) => setWilaya(Number(e.target.value))}
                    className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 focus:border-rose-400 focus:outline-none"
                  >
                    {WILAYAS.map((w) => (
                      <option key={w.code} value={w.code}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {deliveryType === "home" && (
                <div>
                  <label className="font-bold text-gray-700 block mb-2">البلدية *</label>
                  <select
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 focus:border-rose-400 focus:outline-none"
                    required={deliveryType === "home"}
                  >
                    <option value="">اختر البلدية</option>
                    {communesList.map((c: string) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center gap-4">
                <label className="font-bold text-gray-700">الكمية:</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-rose-500 text-white font-bold hover:bg-rose-600 transition"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full bg-rose-500 text-white font-bold hover:bg-rose-600 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <input
                type="text"
                placeholder="الاسم الكامل *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:border-rose-400 focus:outline-none"
              />

              <input
                type="tel"
                placeholder="رقم الهاتف *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:border-rose-400 focus:outline-none"
              />

              <button
                type="submit"
                disabled={product && product.stock_quantity !== undefined && quantity > product.stock_quantity}
                className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${product && product.stock_quantity !== undefined && quantity > product.stock_quantity ? 'bg-gray-400 cursor-not-allowed' : 'bg-rose-500 hover:bg-rose-600 text-white'}`}
              >
                {product && product.stock_quantity !== undefined && quantity > product.stock_quantity ? 'الكمية المطلوبة غير متوفرة' : loading ? 'جاري الطلب...' : 'اطلب الآن'}
              </button>
              {product && product.stock_quantity !== undefined && quantity > product.stock_quantity && (
                <div className="text-center text-red-600 font-bold mt-2">المخزون غير كافٍ لهذه الكمية المطلوبة.</div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
