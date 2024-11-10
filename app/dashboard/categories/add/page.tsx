'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Select from 'react-select'
import { Alert, AlertDescription } from "@/components/ui/alert"

const options = [
  { value: 'PRODUCT', label: 'منتج' },
  { value: 'SERVICE', label: 'خدمة' }
]

export default function AddCategoryPage() {
  const [name, setName] = useState('')
  const [type, setType] = useState(null)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!type) {
      setError('يرجى تحديد نوع التصنيف')
      return
    }
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, type: type.value }),
      })
      if (!response.ok) throw new Error('Failed to create category')
      router.push('/dashboard/categories')
    } catch (error) {
      console.error('Error creating category:', error)
      setError('Failed to create category')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">إضافة تصنيف جديد</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Input
          type="text"
          placeholder="اسم التصنيف"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Select
          options={options}
          value={type}
          onChange={setType}
          placeholder="اختر نوع التصنيف"
          required
        />
        <Button type="submit">إضافة</Button>
      </form>
    </div>
  )
}
