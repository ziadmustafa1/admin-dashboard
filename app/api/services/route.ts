import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'غير مصرح لك بالوصول' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Validate required fields
    const requiredFields = ['name', 'description', 'price', 'category', 'images']
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `حقل ${field} مطلوب` },
          { status: 400 }
        )
      }
    }

    // Create service
    const service = await prisma.service.create({
      data: {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        category: data.category,
        images: data.images,
        available: data.available,
      }
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إضافة الخدمة' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الخدمات' },
      { status: 500 }
    )
  }
}