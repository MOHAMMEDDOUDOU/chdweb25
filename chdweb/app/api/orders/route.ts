import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/database';
import { emitRealtimeEvent } from '@/lib/events';
import { verifySession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.item_type || !body.item_id || !body.item_name || !body.quantity || !body.unit_price || !body.subtotal || !body.total_amount || !body.customer_name || !body.phone_number || !body.wilaya || !body.delivery_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // التحقق من المستخدم المسجل دخول
    let resellerUser = null;
    let resellerName = body.reseller_name;
    let resellerPhone = body.reseller_phone;
    let resellerUserId = null;

    try {
      const token = request.cookies.get("auth-token")?.value;
      if (token) {
        resellerUser = await verifySession(token);
        if (resellerUser) {
          // إذا كان المستخدم مسجل دخول، استخدم بياناته
          resellerName = resellerUser.full_name;
          resellerPhone = resellerUser.phone_number;
          resellerUserId = resellerUser.id;
        }
      }
    } catch (error) {
      // إذا لم يكن هناك مستخدم مسجل دخول، استخدم البيانات المرسلة
      console.log('No authenticated user, using provided reseller data');
    }

    const order = await createOrder({
      item_type: body.item_type,
      item_id: body.item_id,
      item_name: body.item_name,
      quantity: Number(body.quantity),
      unit_price: Number(body.unit_price),
      subtotal: Number(body.subtotal),
      shipping_cost: Number(body.shipping_cost || 0),
      total_amount: Number(body.total_amount),
      customer_name: body.customer_name,
      phone_number: body.phone_number,
      wilaya: body.wilaya,
      commune: body.commune,
      delivery_type: body.delivery_type,
      status: body.status,
      reseller_price: body.reseller_price ? Number(body.reseller_price) : undefined,
      reseller_name: resellerName,
      reseller_phone: resellerPhone,
      reseller_user_id: resellerUserId,
    });
    
    emitRealtimeEvent({ entity: body.item_type === 'offer' ? 'offer' : 'product', action: 'update', id: body.item_id, timestamp: Date.now() });
    return NextResponse.json(order, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
