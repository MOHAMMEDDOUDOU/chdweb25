import { NextRequest, NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '@/lib/database';
import { emitRealtimeEvent } from '@/lib/events';

// GET - جلب منتج واحد بواسطة ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await getProductById(params.id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error in GET /api/products/[id]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PUT - تحديث منتج
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // التحقق من وجود المنتج
    const existingProduct = await getProductById(params.id);
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const updateData = {
      name: body.name,
      description: body.description,
      price: body.price ? Number(body.price) : undefined,
      discount_price: body.discount_price ? Number(body.discount_price) : undefined,
      discount_percentage: body.discount_percentage,
      image_url: body.image_url,
      stock_quantity: body.stock_quantity ? Number(body.stock_quantity) : undefined,
      sizes: body.sizes,
      images: body.images,
      category: body.category,
      is_active: body.is_active,
    };

    const updatedProduct = await updateProduct(params.id, updateData);
    emitRealtimeEvent({ entity: 'product', action: 'update', id: params.id, timestamp: Date.now() });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error in PUT /api/products/[id]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE - حذف منتج
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteProduct(params.id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    emitRealtimeEvent({ entity: 'product', action: 'delete', id: params.id, timestamp: Date.now() });
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/products/[id]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
