import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct, searchProducts } from '@/lib/database';
import { emitRealtimeEvent } from '@/lib/events';

// GET - جلب جميع المنتجات أو البحث
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const name = searchParams.get('name');

    // إذا كانت هناك معايير بحث، استخدم دالة البحث
    if (category || priceMin || priceMax || name) {
      const filters = {
        category: category || undefined,
        priceMin: priceMin ? Number(priceMin) : undefined,
        priceMax: priceMax ? Number(priceMax) : undefined,
        name: name || undefined,
      };
      
      const products = await searchProducts(filters);
      return NextResponse.json(products);
    }

    // وإلا جلب جميع المنتجات
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST - إنشاء منتج جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // التحقق من البيانات المطلوبة
    if (!body.name || !body.price || body.stock_quantity === undefined) {
      return NextResponse.json(
        { error: 'Name, price, and stock_quantity are required' },
        { status: 400 }
      );
    }

    const productData = {
      name: body.name,
      description: body.description,
      price: Number(body.price),
      discount_price: body.discount_price ? Number(body.discount_price) : undefined,
      discount_percentage: body.discount_percentage,
      image_url: body.image_url,
      stock_quantity: Number(body.stock_quantity),
      sizes: body.sizes,
      images: body.images,
      category: body.category,
      is_active: body.is_active !== false,
    };

    const newProduct = await createProduct(productData);
    emitRealtimeEvent({ entity: 'product', action: 'create', id: newProduct.id, timestamp: Date.now() });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/products:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
