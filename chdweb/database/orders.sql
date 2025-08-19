-- إنشاء جدول الطلبات
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_type VARCHAR(20) NOT NULL DEFAULT 'product', -- product | offer
  item_id UUID NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL, -- سعر القطعة المستخدم (قد يكون سعر إعادة البيع)
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(30) NOT NULL,
  wilaya VARCHAR(100) NOT NULL,
  commune VARCHAR(100),
  delivery_type VARCHAR(20) NOT NULL DEFAULT 'home', -- home | stopDesk
  status VARCHAR(50) NOT NULL DEFAULT 'قيد المعالجة',
  reseller_price DECIMAL(10,2), -- سعر إعادة البيع إن وُجد
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_item ON orders(item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
