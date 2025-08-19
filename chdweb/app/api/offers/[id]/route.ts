import { NextRequest, NextResponse } from 'next/server';
import { getOfferById, updateOffer, deleteOffer } from '@/lib/database';
import { emitRealtimeEvent } from '@/lib/events';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const offer = await getOfferById(id);
  if (!offer) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(offer);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const updated = await updateOffer(id, body);
  emitRealtimeEvent({ entity: 'offer', action: 'update', id, timestamp: Date.now() });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = await deleteOffer(id);
  if (ok) emitRealtimeEvent({ entity: 'offer', action: 'delete', id, timestamp: Date.now() });
  return NextResponse.json({ success: ok });
}
