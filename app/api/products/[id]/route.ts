import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: context.params.id }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'المنتج غير موجود' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المنتج' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'غير مصرح به' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const product = await prisma.product.update({
      where: { id: context.params.id },
      data: body
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث المنتج' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'غير مصرح به' },
        { status: 403 }
      )
    }

    await prisma.product.delete({
      where: { id: context.params.id }
    })

    return NextResponse.json({ message: 'تم حذف المنتج بنجاح' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف المنتج' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}