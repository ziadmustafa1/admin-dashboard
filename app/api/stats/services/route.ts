import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const totalServices = await prisma.service.count()
    return NextResponse.json({ count: totalServices })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch total services' }, { status: 500 })
  }
}
