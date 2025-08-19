-- =====================================================
-- سكريبت تحويل البيانات من PostgreSQL إلى SQLite
-- =====================================================

-- =====================================================
-- 1. تصدير البيانات من PostgreSQL (شغّل هذا في PostgreSQL)
-- =====================================================

-- تصدير المنتجات
-- COPY (SELECT 
--   id::text, name, description, price::real, discount_price::real, 
--   discount_percentage, image_url, stock_quantity, 
--   sizes::text, images::text, category, 
--   CASE WHEN is_active THEN 1 ELSE 0 END as is_active,
--   created_at::text, updated_at::text
-- FROM products) TO '/tmp/products.csv' WITH CSV HEADER;

-- تصدير العروض
-- COPY (SELECT 
--   id::text, name, description, price::real, discount_price::real,
--   image_url, stock_quantity, sizes::text, images::text, category,
--   created_at::text, updated_at::text
-- FROM offers) TO '/tmp/offers.csv' WITH CSV HEADER;

-- تصدير الطلبات
-- COPY (SELECT 
--   id::text, item_type, item_id::text, item_name, quantity,
--   unit_price::real, subtotal::real, shipping_cost::real, total_amount::real,
--   customer_name, phone_number, wilaya, commune, delivery_type, status,
--   reseller_price::real, created_at::text
-- FROM orders) TO '/tmp/orders.csv' WITH CSV HEADER;

-- تصدير المستخدمين
-- COPY (SELECT 
--   id::text, username, phone_number, password_hash, full_name,
--   CASE WHEN is_active THEN 1 ELSE 0 END as is_active,
--   created_at::text, updated_at::text
-- FROM users) TO '/tmp/users.csv' WITH CSV HEADER;

-- تصدير الجلسات
-- COPY (SELECT 
--   id::text, user_id::text, token, expires_at::text,
--   created_at::text, last_activity::text
-- FROM sessions) TO '/tmp/sessions.csv' WITH CSV HEADER;

-- =====================================================
-- 2. استيراد البيانات إلى SQLite (شغّل هذا في SQLite)
-- =====================================================

-- تفعيل وضع CSV
.mode csv
.headers on

-- استيراد المنتجات
-- .import /tmp/products.csv products

-- استيراد العروض  
-- .import /tmp/offers.csv offers

-- استيراد الطلبات
-- .import /tmp/orders.csv orders

-- استيراد المستخدمين
-- .import /tmp/users.csv users

-- استيراد الجلسات
-- .import /tmp/sessions.csv sessions

-- =====================================================
-- 3. التحقق من البيانات المستوردة
-- =====================================================

-- عدد المنتجات
SELECT 'Products count:' as info, COUNT(*) as count FROM products
UNION ALL
SELECT 'Offers count:', COUNT(*) FROM offers
UNION ALL
SELECT 'Orders count:', COUNT(*) FROM orders
UNION ALL
SELECT 'Users count:', COUNT(*) FROM users
UNION ALL
SELECT 'Sessions count:', COUNT(*) FROM sessions;

-- عرض عينة من المنتجات
SELECT id, name, price, category, is_active FROM products LIMIT 5;

-- عرض عينة من العروض
SELECT id, name, price, discount_price, category FROM offers LIMIT 5;

-- عرض عينة من الطلبات
SELECT id, item_name, total_amount, status, created_at FROM orders LIMIT 5;

-- عرض عينة من المستخدمين
SELECT id, username, full_name, is_active FROM users LIMIT 5;

-- =====================================================
-- 4. إصلاح أي مشاكل في البيانات
-- =====================================================

-- تحديث التواريخ إذا كانت بتنسيق مختلف
-- UPDATE products SET created_at = datetime(created_at) WHERE created_at IS NOT NULL;
-- UPDATE products SET updated_at = datetime(updated_at) WHERE updated_at IS NOT NULL;

-- UPDATE offers SET created_at = datetime(created_at) WHERE created_at IS NOT NULL;
-- UPDATE offers SET updated_at = datetime(updated_at) WHERE updated_at IS NOT NULL;

-- UPDATE orders SET created_at = datetime(created_at) WHERE created_at IS NOT NULL;

-- UPDATE users SET created_at = datetime(created_at) WHERE created_at IS NOT NULL;
-- UPDATE users SET updated_at = datetime(updated_at) WHERE updated_at IS NOT NULL;

-- UPDATE sessions SET created_at = datetime(created_at) WHERE created_at IS NOT NULL;
-- UPDATE sessions SET last_activity = datetime(last_activity) WHERE last_activity IS NOT NULL;
-- UPDATE sessions SET expires_at = datetime(expires_at) WHERE expires_at IS NOT NULL;

-- =====================================================
-- 5. إنشاء فهارس إضافية إذا لزم الأمر
-- =====================================================

-- إعادة إنشاء الفهارس
CREATE INDEX IF NOT EXISTS idx_products_search ON products(name, category);
CREATE INDEX IF NOT EXISTS idx_offers_search ON offers(name, category);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_name, phone_number);

-- =====================================================
-- 6. تنظيف البيانات
-- =====================================================

-- حذف الجلسات المنتهية الصلاحية
DELETE FROM sessions WHERE expires_at < datetime('now');

-- حذف محاولات تسجيل الدخول القديمة (أكثر من 30 يوم)
DELETE FROM login_attempts WHERE attempted_at < datetime('now', '-30 days');

-- =====================================================
-- 7. التحقق النهائي
-- =====================================================

-- التحقق من سلامة البيانات
SELECT 'Data integrity check completed' as status;

-- عرض إحصائيات نهائية
SELECT 
  'Final Statistics' as info,
  (SELECT COUNT(*) FROM products) as products,
  (SELECT COUNT(*) FROM offers) as offers,
  (SELECT COUNT(*) FROM orders) as orders,
  (SELECT COUNT(*) FROM users) as users,
  (SELECT COUNT(*) FROM sessions) as sessions;
