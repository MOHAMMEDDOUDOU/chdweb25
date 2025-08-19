-- إنشاء جدول المنتجات بدون حقل is_active
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    discount_price DECIMAL(10,2),
    discount_percentage INTEGER,
    image_url TEXT,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    sizes JSONB,
    images JSONB,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

-- إنشاء دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- إنشاء trigger لتحديث updated_at
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- إضافة تعليقات على الجدول
COMMENT ON TABLE products IS 'جدول المنتجات في متجر التجميل';
COMMENT ON COLUMN products.id IS 'المعرف الفريد للمنتج';
COMMENT ON COLUMN products.name IS 'اسم المنتج';
COMMENT ON COLUMN products.description IS 'وصف المنتج';
COMMENT ON COLUMN products.price IS 'السعر الأصلي';
COMMENT ON COLUMN products.discount_price IS 'سعر الخصم';
COMMENT ON COLUMN products.discount_percentage IS 'نسبة الخصم';
COMMENT ON COLUMN products.image_url IS 'رابط الصورة الرئيسية';
COMMENT ON COLUMN products.stock_quantity IS 'كمية المخزون';
COMMENT ON COLUMN products.sizes IS 'المقاسات المتوفرة (JSON)';
COMMENT ON COLUMN products.images IS 'صور إضافية للمنتج (JSON)';
COMMENT ON COLUMN products.category IS 'فئة المنتج';
COMMENT ON COLUMN products.created_at IS 'تاريخ الإنشاء';
COMMENT ON COLUMN products.updated_at IS 'تاريخ آخر تحديث';
