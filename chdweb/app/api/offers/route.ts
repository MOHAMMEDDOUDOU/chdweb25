import { NextRequest, NextResponse } from 'next/server';
import { getOffers, createOffer, searchOffers } from '@/lib/database';
import { emitRealtimeEvent } from '@/lib/events';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const name = searchParams.get('name');

    if (category || priceMin || priceMax || name) {
      const offers = await searchOffers({
        category: category || undefined,
        priceMin: priceMin ? Number(priceMin) : undefined,
        priceMax: priceMax ? Number(priceMax) : undefined,
        name: name || undefined,
      });
      return NextResponse.json(offers);
    }

    const offers = await getOffers();
    return NextResponse.json(offers);
  } catch (e) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.price || body.stock_quantity === undefined) {
      return NextResponse.json({ error: 'Name, price, stock_quantity are required' }, { status: 400 });
    }
    const created = await createOffer({
      name: body.name,
      description: body.description,
      price: Number(body.price),
      discount_price: body.discount_price ? Number(body.discount_price) : undefined,
      image_url: body.image_url,
      stock_quantity: Number(body.stock_quantity),
      sizes: body.sizes,
      images: body.images,
      category: body.category,
    });
    emitRealtimeEvent({ entity: 'offer', action: 'create', id: created.id, timestamp: Date.now() });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
