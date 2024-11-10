'use client'

import { useState, useCallback } from 'react'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ImageUploadProps {
  onChange: (value: string) => void
  value: string
  label?: string
}

export function ImageUpload({ onChange, value, label = "صورة" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('الرجاء اختيار ملف صورة صالح')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('حجم الملف يجب أن يكون أقل من 5 ميجابايت')
      return
    }

    try {
      setIsUploading(true)
      setError(null)

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
      onChange(data.url)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'حدث خطأ أثناء تحميل الصورة')
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }, [onChange])

  const handleRemove = useCallback(() => {
    onChange('')
  }, [onChange])

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        <div className="relative w-40 h-40 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
          {value ? (
            <>
              <Image
                src={value}
                alt="Uploaded"
                fill
                className="object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center justify-center w-full h-full"
            >
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="mt-2 text-sm text-gray-600 text-center">
                اضغط لاختيار صورة
              </span>
            </Label>
          )}
        </div>
        <Input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={isUploading}
          className="hidden"
        />
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {isUploading && (
        <p className="text-sm text-blue-500">جاري تحميل الصورة...</p>
      )}
    </div>
  )
}