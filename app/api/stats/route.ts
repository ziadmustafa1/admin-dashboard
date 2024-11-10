import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [
      totalServices,
      totalProducts,
      totalCategories,
      newOrders,
      totalUsers
    ] = await Promise.all([
      prisma.Service.count(),
      prisma.Product.count(),
      prisma.Category.count(),
      prisma.Order.count({ where: { status: 'new' } }),
      prisma.User.count()
    ])

    return NextResponse.json({
      totalServices,
      totalProducts,
      totalCategories,
      newOrders,
      totalUsers
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
