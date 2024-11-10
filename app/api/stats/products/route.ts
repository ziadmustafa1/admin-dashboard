import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const totalProducts = await prisma.product.count()
    return NextResponse.json({ count: totalProducts })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch total products' }, { status: 500 })
  }
}
