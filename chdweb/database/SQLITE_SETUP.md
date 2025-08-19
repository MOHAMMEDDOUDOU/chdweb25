# إعداد قاعدة بيانات SQLite لموقع Cosmibelle

## 📋 الملفات المتوفرة

1. **`sqlite-complete.sql`** - ملف كامل لإنشاء جميع الجداول
2. **`migrate-to-sqlite.sql`** - سكريبت تحويل البيانات من PostgreSQL
3. **`SQLITE_SETUP.md`** - هذا الملف (دليل الإعداد)

## 🚀 الإعداد السريع

### الخطوة 1: إنشاء قاعدة البيانات

\`\`\`bash
# إنشاء ملف قاعدة البيانات
sqlite3 cosmibelle.db

# أو من سطر الأوامر مباشرة
sqlite3 cosmibelle.db < database/sqlite-complete.sql
\`\`\`

### الخطوة 2: تشغيل ملف SQL

\`\`\`sql
-- في SQLite CLI
.read database/sqlite-complete.sql
\`\`\`

### الخطوة 3: التحقق من الجداول

\`\`\`sql
.tables
-- يجب أن تظهر: categories, login_attempts, offers, orders, products, sessions, users
\`\`\`

## 📊 الجداول المتوفرة

### 1. **users** - المستخدمين
\`\`\`sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  phone_number TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
\`\`\`

### 2. **sessions** - الجلسات
\`\`\`sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  last_activity TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
\`\`\`

### 3. **products** - المنتجات
\`\`\`sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  discount_price REAL,
  discount_percentage INTEGER,
  image_url TEXT,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  sizes TEXT, -- JSON كنص
  images TEXT, -- JSON كنص
  category TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
\`\`\`

### 4. **offers** - العروض
\`\`\`sql
CREATE TABLE offers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  discount_price REAL,
  image_url TEXT,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  sizes TEXT,
  images TEXT,
  category TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
\`\`\`

### 5. **orders** - الطلبات
\`\`\`sql
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  item_type TEXT NOT NULL DEFAULT 'product',
  item_id TEXT NOT NULL,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price REAL NOT NULL,
  subtotal REAL NOT NULL,
  shipping_cost REAL NOT NULL DEFAULT 0,
  total_amount REAL NOT NULL,
  customer_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  wilaya TEXT NOT NULL,
  commune TEXT,
  delivery_type TEXT NOT NULL DEFAULT 'home',
  status TEXT NOT NULL DEFAULT 'قيد المعالجة',
  reseller_price REAL,
  created_at TEXT DEFAULT (datetime('now'))
);
\`\`\`

## 🔧 أوامر مفيدة

### عرض جميع الجداول
\`\`\`sql
.tables
\`\`\`

### عرض بنية جدول
\`\`\`sql
.schema users
.schema products
.schema orders
\`\`\`

### عرض البيانات
\`\`\`sql
-- جميع المنتجات
SELECT * FROM products;

-- جميع العروض
SELECT * FROM offers;

-- جميع الطلبات
SELECT * FROM orders;

-- جميع المستخدمين
SELECT id, username, full_name, is_active FROM users;
\`\`\`

### إحصائيات
\`\`\`sql
-- عدد المنتجات
SELECT COUNT(*) as total_products FROM products;

-- عدد العروض
SELECT COUNT(*) as total_offers FROM offers;

-- عدد الطلبات
SELECT COUNT(*) as total_orders FROM orders;

-- عدد المستخدمين
SELECT COUNT(*) as total_users FROM users;
\`\`\`

## 🔄 تحويل البيانات من PostgreSQL

### الخطوة 1: تصدير من PostgreSQL
\`\`\`sql
-- في PostgreSQL
COPY (SELECT * FROM products) TO '/tmp/products.csv' WITH CSV HEADER;
COPY (SELECT * FROM offers) TO '/tmp/offers.csv' WITH CSV HEADER;
COPY (SELECT * FROM orders) TO '/tmp/orders.csv' WITH CSV HEADER;
COPY (SELECT * FROM users) TO '/tmp/users.csv' WITH CSV HEADER;
\`\`\`

### الخطوة 2: استيراد إلى SQLite
\`\`\`sql
-- في SQLite
.mode csv
.headers on
.import /tmp/products.csv products
.import /tmp/offers.csv offers
.import /tmp/orders.csv orders
.import /tmp/users.csv users
\`\`\`

## 🛠️ إدارة قاعدة البيانات

### نسخ احتياطي
\`\`\`bash
# نسخ احتياطي كامل
sqlite3 cosmibelle.db ".backup backup_$(date +%Y%m%d_%H%M%S).db"

# تصدير إلى SQL
sqlite3 cosmibelle.db ".dump" > backup_$(date +%Y%m%d_%H%M%S).sql
\`\`\`

### استعادة من النسخة الاحتياطية
\`\`\`bash
# استعادة من ملف SQL
sqlite3 cosmibelle.db < backup_20241201_143022.sql

# استعادة من ملف DB
cp backup_20241201_143022.db cosmibelle.db
\`\`\`

### تنظيف البيانات
\`\`\`sql
-- حذف الجلسات المنتهية
DELETE FROM sessions WHERE expires_at < datetime('now');

-- حذف محاولات تسجيل الدخول القديمة
DELETE FROM login_attempts WHERE attempted_at < datetime('now', '-30 days');

-- حذف المنتجات غير النشطة
DELETE FROM products WHERE is_active = 0;
\`\`\`

## 🔍 استعلامات مفيدة

### البحث عن المنتجات
\`\`\`sql
-- البحث بالاسم
SELECT * FROM products WHERE name LIKE '%شامبو%';

-- البحث بالفئة
SELECT * FROM products WHERE category = 'Soins cheveux';

-- المنتجات النشطة فقط
SELECT * FROM products WHERE is_active = 1;
\`\`\`

### إحصائيات المبيعات
\`\`\`sql
-- إجمالي المبيعات
SELECT SUM(total_amount) as total_sales FROM orders;

-- عدد الطلبات حسب الحالة
SELECT status, COUNT(*) as count FROM orders GROUP BY status;

-- أفضل المنتجات مبيعاً
SELECT 
  item_name, 
  COUNT(*) as order_count,
  SUM(quantity) as total_quantity
FROM orders 
WHERE item_type = 'product'
GROUP BY item_id, item_name
ORDER BY total_quantity DESC;
\`\`\`

### إحصائيات المستخدمين
\`\`\`sql
-- المستخدمين النشطين
SELECT COUNT(*) as active_users FROM users WHERE is_active = 1;

-- الجلسات النشطة
SELECT COUNT(*) as active_sessions FROM sessions WHERE expires_at > datetime('now');
\`\`\`

## ⚠️ ملاحظات مهمة

1. **أنواع البيانات:**
   - استخدم `TEXT` بدل `VARCHAR`
   - استخدم `REAL` بدل `DECIMAL` للأسعار
   - استخدم `INTEGER` بدل `BOOLEAN` (0=false, 1=true)

2. **التواريخ:**
   - استخدم `datetime('now')` بدل `NOW()`
   - التواريخ تُخزن كنص في SQLite

3. **UUID:**
   - تُخزن كنص في SQLite
   - يمكن توليدها في التطبيق

4. **JSON:**
   - تُخزن كنص في SQLite
   - يمكن استخدام `json_extract()` للاستعلام

## 🚀 التكامل مع التطبيق

لتغيير التطبيق لاستخدام SQLite بدل PostgreSQL:

1. **تثبيت مكتبة SQLite:**
\`\`\`bash
pnpm add sqlite3 better-sqlite3
\`\`\`

2. **تحديث ملف الاتصال:**
\`\`\`typescript
// lib/sqliteClient.ts
import Database from 'better-sqlite3';

const db = new Database('cosmibelle.db');
export default db;
\`\`\`

3. **تحديث الاستعلامات:**
\`\`\`typescript
// مثال: جلب المنتجات
const products = db.prepare('SELECT * FROM products WHERE is_active = 1').all();
\`\`\`

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من وجود ملف قاعدة البيانات
2. تأكد من صلاحيات الكتابة
3. راجع سجلات الأخطاء
4. استخدم `.help` في SQLite CLI للمساعدة
