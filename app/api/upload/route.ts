import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/upload-handler'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'لم يتم تحديد ملف' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'يجب أن يكون الملف صورة' },
        { status: 400 }
      )
    }

    // Validate file size (e.g., 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'حجم الملف يجب أن يكون أقل من 5 ميجابايت' },
        { status: 400 }
      )
    }

    const imageUrl = await uploadImage(file)

    return NextResponse.json({ url: imageUrl })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء رفع الصورة' },
      { status: 500 }
    )
  }
}