import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }) {
  const { id } = params
  try {
    const report = await prisma.report.findUnique({
      where: { id }
    })
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }
    return NextResponse.json(report)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch report' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }) {
  const { id } = params
  try {
    await prisma.report.delete({
      where: { id }
    })
    return NextResponse.json({}, { status: 204 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 })
  }
}
