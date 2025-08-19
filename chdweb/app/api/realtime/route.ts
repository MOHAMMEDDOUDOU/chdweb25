import { NextRequest } from 'next/server'
import { realtimeEmitter } from '@/lib/events'

export const runtime = 'nodejs'

export async function GET(_req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()
      let isClosed = false
      let pingInterval: NodeJS.Timeout | null = null
      
      function send(event: any) {
        if (!isClosed) {
          try {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
          } catch (e) {
            isClosed = true
            if (pingInterval) clearInterval(pingInterval)
          }
        }
      }
      
      const listener = (event: any) => send(event)
      realtimeEmitter.on('event', listener)
      
      // ping
      pingInterval = setInterval(() => {
        if (!isClosed) {
          try {
            controller.enqueue(encoder.encode(`: ping\n\n`))
          } catch (e) {
            isClosed = true
            if (pingInterval) clearInterval(pingInterval)
          }
        } else {
          if (pingInterval) clearInterval(pingInterval)
        }
      }, 30000) // زيادة الفاصل الزمني إلى 30 ثانية
      
      // cleanup
      try {
        controller.enqueue(encoder.encode(`: connected\n\n`))
      } catch (e) {
        isClosed = true
        if (pingInterval) clearInterval(pingInterval)
      }
      
      return () => {
        isClosed = true
        if (pingInterval) clearInterval(pingInterval)
        realtimeEmitter.off('event', listener)
      }
    },
    cancel() {
      // Controller was cancelled
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
