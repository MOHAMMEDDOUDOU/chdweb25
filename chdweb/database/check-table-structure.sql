-- التحقق من بنية جدول المنتجات

-- عرض جميع الأعمدة في الجدول
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;

-- عرض جميع الفهارس في الجدول
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'products';

-- عرض عدد المنتجات
SELECT COUNT(*) as total_products FROM products;

-- عرض عينة من البيانات
SELECT 
    id,
    name,
    price,
    stock_quantity,
    category,
    created_at
FROM products 
ORDER BY created_at DESC 
LIMIT 5;
