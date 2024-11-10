'use client'

import { useState, useCallback } from 'react'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface MultiImageUploadProps {
  onChange: (value: string[]) => void
  value: string[]
  label?: string
}

export function MultiImageUpload({ onChange, value, label = "الصور" }: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setError(null)

    const uploadedUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      if (!file.type.startsWith('image/')) {
        setError('الرجاء اختيار ملفات صور صالحة فقط')
        setIsUploading(false)
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('حجم كل ملف يجب أن يكون أقل من 5 ميجابايت')
        setIsUploading(false)
        return
      }

      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'فشل تحميل الصورة')
        }

        const data = await response.json()
        uploadedUrls.push(data.url)
      } catch (error) {
        console.error('Upload error:', error)
        setError('حدث خطأ أثناء تحميل الصور')
        setIsUploading(false)
        return
      }
    }

    onChange([...value, ...uploadedUrls])
    setIsUploading(false)
  }, [onChange, value])

  const handleRemove = useCallback((index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }, [onChange, value])

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      <div className="grid grid-cols-3 gap-4">
        {value.map((url, index) => (
          <div key={index} className="relative w-full pt-[100%]">
            <Image
              src={url}
              alt={`Uploaded ${index + 1}`}
              fill
              className="object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={() => handleRemove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <div className="relative w-full pt-[100%] border-2 border-dashed border-gray-300 rounded-lg">
          <Label
            htmlFor="image-upload"
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
          >
            <Upload className="h-8 w-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-600 text-center">
              اضغط لإضافة صور
            </span>
          </Label>
        </div>
      </div>
      <Input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={isUploading}
        className="hidden"
        multiple
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {isUploading && (
        <p className="text-sm text-blue-500">جاري تحميل الصور...</p>
      )}
    </div>
  )
}