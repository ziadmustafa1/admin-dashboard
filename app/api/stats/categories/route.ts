import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const totalCategories = await prisma.category.count()
    return NextResponse.json({ count: totalCategories })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch total categories' }, { status: 500 })
  }
}
