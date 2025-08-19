-- =====================================================
-- قاعدة بيانات SQLite كاملة لموقع Cosmibelle
-- =====================================================

-- =====================================================
-- جدول المستخدمين
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, -- UUID كنص
  username TEXT UNIQUE NOT NULL,
  phone_number TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL, -- كلمة المرور كما هي بدون تشفير
  full_name TEXT NOT NULL,
  is_active INTEGER DEFAULT 1, -- 1=true, 0=false
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- =====================================================
-- جدول الجلسات
-- =====================================================
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY, -- UUID كنص
  user_id TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  last_activity TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- جدول المنتجات
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY, -- UUID كنص
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL, -- REAL بدل DECIMAL في SQLite
  discount_price REAL,
  discount_percentage INTEGER,
  image_url TEXT,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  sizes TEXT, -- JSON كنص
  images TEXT, -- JSON كنص
  category TEXT,
  is_active INTEGER DEFAULT 1, -- 1=true, 0=false
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- =====================================================
-- جدول العروض
-- =====================================================
CREATE TABLE IF NOT EXISTS offers (
  id TEXT PRIMARY KEY, -- UUID كنص
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  discount_price REAL,
  image_url TEXT,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  sizes TEXT, -- JSON كنص
  images TEXT, -- JSON كنص
  category TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- =====================================================
-- جدول الطلبات
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY, -- UUID كنص
  item_type TEXT NOT NULL DEFAULT 'product', -- product | offer
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
  delivery_type TEXT NOT NULL DEFAULT 'home', -- home | stopDesk
  status TEXT NOT NULL DEFAULT 'قيد المعالجة',
  reseller_price REAL, -- سعر إعادة البيع
  created_at TEXT DEFAULT (datetime('now'))
);

-- =====================================================
-- جدول الفئات (اختياري)
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY, -- UUID كنص
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- =====================================================
-- جدول محاولات تسجيل الدخول (اختياري)
-- =====================================================
CREATE TABLE IF NOT EXISTS login_attempts (
  id TEXT PRIMARY KEY, -- UUID كنص
  username TEXT NOT NULL,
  ip_address TEXT,
  attempted_at TEXT DEFAULT (datetime('now')),
  success INTEGER DEFAULT 0 -- 0=false, 1=true
);

-- =====================================================
-- الفهارس لتحسين الأداء
-- =====================================================

-- فهارس المستخدمين
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- فهارس الجلسات
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- فهارس المنتجات
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

-- فهارس العروض
CREATE INDEX IF NOT EXISTS idx_offers_category ON offers(category);
CREATE INDEX IF NOT EXISTS idx_offers_price ON offers(price);
CREATE INDEX IF NOT EXISTS idx_offers_created_at ON offers(created_at);

-- فهارس الطلبات
CREATE INDEX IF NOT EXISTS idx_orders_item ON orders(item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- فهارس الفئات
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);

-- فهارس محاولات تسجيل الدخول
CREATE INDEX IF NOT EXISTS idx_login_attempts_username ON login_attempts(username);
CREATE INDEX IF NOT EXISTS idx_login_attempts_time ON login_attempts(attempted_at);

-- =====================================================
-- Triggers لتحديث updated_at
-- =====================================================

-- Trigger لتحديث updated_at للمستخدمين
CREATE TRIGGER IF NOT EXISTS trg_users_updated_at
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
  UPDATE users SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Trigger لتحديث updated_at للمنتجات
CREATE TRIGGER IF NOT EXISTS trg_products_updated_at
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
  UPDATE products SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Trigger لتحديث updated_at للعروض
CREATE TRIGGER IF NOT EXISTS trg_offers_updated_at
AFTER UPDATE ON offers
FOR EACH ROW
BEGIN
  UPDATE offers SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- =====================================================
-- إدخال بيانات افتراضية
-- =====================================================

-- إضافة فئات افتراضية
INSERT OR IGNORE INTO categories (id, name, description) VALUES 
  ('cat-001', 'Soins cheveux', 'منتجات العناية بالشعر'),
  ('cat-002', 'Maquillage', 'منتجات المكياج'),
  ('cat-003', 'Soins visage', 'منتجات العناية بالبشرة'),
  ('cat-004', 'Parfums', 'العطور'),
  ('cat-005', 'Accessoires', 'الإكسسوارات'),
  ('cat-006', 'Appareils coiffants', 'أجهزة التجميل');

-- إضافة منتجات افتراضية (اختياري)
INSERT OR IGNORE INTO products (id, name, description, price, stock_quantity, category, image_url) VALUES 
  ('prod-001', 'شامبو للشعر الجاف', 'شامبو مخصص للشعر الجاف والمتقصف', 1200.00, 50, 'Soins cheveux', 'https://res.cloudinary.com/dldvpyait/image/upload/shamponing_m2ggeu.jpg'),
  ('prod-002', 'كريم ترطيب للوجه', 'كريم ترطيب عميق للبشرة الجافة', 800.00, 30, 'Soins visage', 'https://res.cloudinary.com/dldvpyait/image/upload/gels_gaetea.jpg'),
  ('prod-003', 'عطر نسائي', 'عطر أنيق للنساء', 2500.00, 20, 'Parfums', 'https://res.cloudinary.com/dldvpyait/image/upload/parfum_qke0bp.jpg');

-- إضافة عروض افتراضية (اختياري)
INSERT OR IGNORE INTO offers (id, name, description, price, discount_price, stock_quantity, category, image_url) VALUES 
  ('offer-001', 'عرض خاص على الشامبو', 'خصم 20% على جميع أنواع الشامبو', 1200.00, 960.00, 25, 'Soins cheveux', 'https://res.cloudinary.com/dldvpyait/image/upload/shamponing_m2ggeu.jpg'),
  ('offer-002', 'عرض العطور', 'خصم 15% على جميع العطور', 2500.00, 2125.00, 15, 'Parfums', 'https://res.cloudinary.com/dldvpyait/image/upload/parfum_qke0bp.jpg');

-- =====================================================
-- دالة لتنظيف الجلسات المنتهية الصلاحية
-- =====================================================
-- يمكن إنشاء دالة في التطبيق لتنظيف الجلسات المنتهية
-- DELETE FROM sessions WHERE expires_at < datetime('now');

-- =====================================================
-- تعليقات على الجداول
-- =====================================================
-- يمكن إضافة تعليقات في SQLite باستخدام PRAGMA
PRAGMA table_info(users);
PRAGMA table_info(products);
PRAGMA table_info(offers);
PRAGMA table_info(orders);
PRAGMA table_info(sessions);

-- =====================================================
-- التحقق من إنشاء الجداول
-- =====================================================
SELECT name FROM sqlite_master WHERE type='table';

-- =====================================================
-- ملاحظات مهمة:
-- =====================================================
-- 1. استخدم TEXT بدل VARCHAR في SQLite
-- 2. استخدم REAL بدل DECIMAL للأسعار
-- 3. استخدم INTEGER بدل BOOLEAN (0=false, 1=true)
-- 4. استخدم TEXT بدل UUID (يمكن توليد UUID في التطبيق)
-- 5. استخدم datetime('now') بدل NOW()
-- 6. استخدم INSERT OR IGNORE بدل ON CONFLICT
