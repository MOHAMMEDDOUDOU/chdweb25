-- حذف حقل is_active من جدول المنتجات
-- ⚠️ تحذير: هذا الإجراء لا يمكن التراجع عنه

-- 1. حذف الفهرس المرتبط بحقل is_active
DROP INDEX IF EXISTS idx_products_is_active;

-- 2. حذف حقل is_active من جدول المنتجات
ALTER TABLE products DROP COLUMN IF EXISTS is_active;

-- 3. إزالة التعليق من الجدول (اختياري)
COMMENT ON COLUMN products.is_active IS NULL;

-- 4. التحقق من بنية الجدول بعد التعديل
-- يمكنك تشغيل هذا الاستعلام للتحقق:
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'products' 
-- ORDER BY ordinal_position;
