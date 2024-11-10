import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const newOrders = await prisma.order.count({ where: { status: 'NEW' } })
    return NextResponse.json({ count: newOrders })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch new orders' }, { status: 500 })
  }
}
