# إعداد سريع لـ Neon Database

## 🎯 Project ID: `late-wildflower-66957205`

### الخطوة 1: الحصول على رابط الاتصال

1. اذهب إلى [console.neon.tech](https://console.neon.tech)
2. اختر مشروعك: `late-wildflower-66957205`
3. ابحث عن **"Connection Details"** أو **"Connection String"**
4. انسخ رابط الاتصال الذي يبدو مثل:
   \`\`\`
   postgresql://username:password@ep-late-wildflower-66957205.us-east-1.aws.neon.tech/database?sslmode=require
   \`\`\`

### الخطوة 2: إضافة المتغير البيئي

أنشئ ملف `.env.local` في مجلد المشروع وأضف:

\`\`\`env
NEON_DATABASE_URL=postgresql://username:password@ep-late-wildflower-66957205.us-east-1.aws.neon.tech/database?sslmode=require
\`\`\`

**استبدل** `username:password` بالبيانات الحقيقية من لوحة التحكم.

### الخطوة 3: إنشاء الجدول

1. في لوحة تحكم Neon، اذهب إلى **SQL Editor**
2. انسخ محتوى ملف `database/schema.sql`
3. اضغط **Run** لإنشاء الجدول

### الخطوة 4: اختبار الاتصال

\`\`\`bash
pnpm run test-neon
\`\`\`

### الخطوة 5: نقل البيانات (اختياري)

\`\`\`bash
pnpm run migrate-to-neon
\`\`\`

### الخطوة 6: تشغيل التطبيق

\`\`\`bash
pnpm dev
\`\`\`

ثم اذهب إلى `/admin/products` لاختبار إدارة المنتجات.

## 🔧 استكشاف الأخطاء

إذا واجهت مشاكل:

1. **تأكد من صحة رابط الاتصال**
2. **تأكد من إضافة `sslmode=require`**
3. **تحقق من إنشاء الجدول**
4. **راجع سجلات الخادم للأخطاء**

## 📞 المساعدة

إذا احتجت مساعدة إضافية، راجع ملف `MIGRATION_GUIDE.md` للحصول على دليل مفصل.
