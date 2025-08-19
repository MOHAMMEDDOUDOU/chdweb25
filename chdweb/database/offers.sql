-- إنشاء جدول العروض
CREATE TABLE IF NOT EXISTS offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  discount_price DECIMAL(10,2),
  image_url TEXT,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  sizes JSONB,
  images JSONB,
  category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_offers_category ON offers(category);
CREATE INDEX IF NOT EXISTS idx_offers_price ON offers(price);
CREATE INDEX IF NOT EXISTS idx_offers_created_at ON offers(created_at);

-- trigger لتحديث updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_offers_updated_at
  BEFORE UPDATE ON offers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
