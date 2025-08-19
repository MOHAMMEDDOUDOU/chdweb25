"use client"
import { useEffect, useState } from "react"
import type React from "react"
import { useRouter } from "next/navigation"

import { supabase } from "@/lib/supabaseClient"

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
    "بوحنيفية",
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
    "خميس الخشن��",
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

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([])
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [wilaya, setWilaya] = useState(16)
  const [commune, setCommune] = useState("")
  const [deliveryType, setDeliveryType] = useState("home")
  const [loading, setLoading] = useState(false)
  const [stockMap, setStockMap] = useState<{ [id: string]: number }>({})
  const [stockError, setStockError] = useState<string | null>(null)
  const router = useRouter()

  // جلب السلة من localStorage عند التحميل
  useEffect(() => {
    const stored = localStorage.getItem("cart")
    if (stored) setCart(JSON.parse(stored))
  }, [])

  // جلب مخزون المنتجات عند كل تغيير في السلة
  useEffect(() => {
    async function fetchStocks() {
      if (cart.length === 0) return setStockMap({})
      const ids = cart.map((item) => item.id).filter(Boolean)
      if (ids.length === 0) return setStockMap({})
      const { data, error } = await supabase.from("products").select("id,stock_quantity").in("id", ids)
      if (!error && data) {
        const map: { [id: string]: number } = {}
        data.forEach((p: any) => { map[p.id] = p.stock_quantity })
        setStockMap(map)
      }
    }
    fetchStocks()
  }, [cart])

  // التحقق من الكميات بعد كل تغيير في السلة أو المخزون
  useEffect(() => {
    if (cart.length === 0 || Object.keys(stockMap).length === 0) {
      setStockError(null)
      return
    }
    const outOfStock = cart.filter((item) => {
      if (!item.id || stockMap[item.id] === undefined) return true
      const stock = stockMap[item.id]
      return item.quantity > stock
    })
    if (outOfStock.length > 0) {
      setStockError(`الكمية المطلوبة غير متوفرة للمنتج: ${outOfStock.map((i) => i.name || 'منتج غير معروف').join(", ")}`)
    } else {
      setStockError(null)
    }
  }, [cart, stockMap])

  // دوال زيادة/نقصان الكمية
  function increaseQuantity(id: string) {
    setCart((prevCart) => {
      const updated = prevCart.map((item: any) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
      localStorage.setItem("cart", JSON.stringify(updated))
      return updated
    })
  }
  function decreaseQuantity(id: string) {
    setCart((prevCart) => {
      const updated = prevCart.map((item: any) =>
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
      localStorage.setItem("cart", JSON.stringify(updated))
      return updated
    })
  }

  useEffect(() => {
    if (deliveryType === "stopDesk") setCommune("")
  }, [deliveryType])

  const selectedWilaya = WILAYAS.find((w) => w.code === Number(wilaya))
  const communesList = COMMUNES[wilaya] || []
  const shipping = deliveryType === "home" ? selectedWilaya?.tarif || 0 : selectedWilaya?.stopDesk || 0
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + shipping

  async function handleOrder(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !phone || cart.length === 0) return alert("يرجى ملء جميع الحقول المطلوبة")
    if (deliveryType === "home" && !commune) return alert("يرجى اختيار البلدية")

    setLoading(true)

    // بناء نص المنتجات والكميات
    const productsText = cart
      .filter((item) => !!item.name)
      .map((item) => `${item.name} (x${item.quantity})`)
      .join(", ")
    const totalQuantity = cart.reduce((sum, item) => sum + (Number.parseInt(item.quantity) || 1), 0)
    const productsTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // إذا كان كل المنتجات من نفس التصنيف، أرسل التصنيف، وإلا أرسل "متنوع"
    const allCategories = cart.map((item) => item.category).filter(Boolean)
    const uniqueCategories = Array.from(new Set(allCategories))
    const category = uniqueCategories.length === 1 ? uniqueCategories[0] : "متنوع"

    const orderToSave = {
      product_name: productsText,
      quantity: totalQuantity,
      price: productsTotal,
      customer_name: name.trim(),
      phone_number: phone.replace(/\s/g, ""),
      wilaya: selectedWilaya?.name.trim() || "",
      commune: deliveryType === "home" ? commune?.trim() : "غير محدد",
      delivery_type: deliveryType || "home",
      shipping_cost: Number.parseFloat(String(shipping)) || 0,
      total_amount: Number.parseFloat(String(total)) || productsTotal + Number.parseFloat(String(shipping) || "0"),
      status: "قيد المعالجة",
      created_at: new Date().toISOString(),
      category,
    }

    // أزل أي حقول undefined
    Object.keys(orderToSave).forEach(
      (key) => (orderToSave as any)[key] === undefined && delete (orderToSave as any)[key],
    )

    const { data, error } = await supabase.from("orders").insert([orderToSave])
    setLoading(false)

    if (!error) {
      router.push("/order/success")
      localStorage.removeItem("cart")
      setCart([])
      setName("")
      setPhone("")
      setCommune("")
      setDeliveryType("home")
    } else {
      alert("حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.")
      console.log(error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#3B2922] via-[#71594F] to-[#C29B87] py-16 px-2 flex flex-col items-center">
      <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-3xl flex flex-col gap-12 border-4 border-rose-200">
        <h1 className="text-4xl font-extrabold text-center text-[#C29B87] mb-6 tracking-wide drop-shadow-lg">
          إتمام الطلب
        </h1>
        {cart.length === 0 ? (
          <div className="text-center text-2xl text-gray-500 py-32">السلة فارغة</div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-rose-700">محتويات السلة:</h2>
              <ul className="space-y-2">
                {cart.map((item) => (
                  <li key={item.id} className="flex justify-between items-center border-b pb-2 gap-4">
                    <span>
                      {item.name}
                      <span className="mx-2">×</span>
                      <button
                        type="button"
                        className="w-8 h-8 rounded-full bg-gray-200 text-xl font-bold mr-1"
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        -
                      </button>
                      <span className="inline-block w-8 text-center font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        className="w-8 h-8 rounded-full bg-gray-200 text-xl font-bold ml-1"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        +
                      </button>
                    </span>
                    <span>{item.price * item.quantity} دج</span>
                  </li>
                ))}
              </ul>
              {/* Debug output for diagnosis */}
              <div className="bg-gray-100 rounded p-2 mt-4 text-xs text-left">
                <div><b>cart:</b> <pre>{JSON.stringify(cart, null, 2)}</pre></div>
                <div><b>stockMap:</b> <pre>{JSON.stringify(stockMap, null, 2)}</pre></div>
                <div><b>stockError:</b> <pre>{JSON.stringify(stockError, null, 2)}</pre></div>
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-lg">
                  <span>المجموع الفرعي:</span>
                  <span>{cart.reduce((sum, item) => sum + item.price * item.quantity, 0)} دج</span>
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
            </div>
            <form onSubmit={handleOrder} className="flex flex-col gap-6">
              <div className="flex gap-4">
                <div className="flex-1">
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
                <div className="flex-1">
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

              {stockError && (
                <div className="text-center text-red-600 font-bold mt-2 text-lg">{stockError}</div>
              )}
              <button
                type="submit"
                disabled={loading || !!stockError}
                className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold py-4 px-12 rounded-2xl text-2xl shadow-xl hover:shadow-2xl transition-all duration-300 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "جاري الإرسال..." : "تأكيد الطلب"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
