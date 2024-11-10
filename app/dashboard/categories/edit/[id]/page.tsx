'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Select from 'react-select'
import { Alert, AlertDescription } from "@/components/ui/alert"

const options = [
  { value: 'PRODUCT', label: 'منتج' },
  { value: 'SERVICE', label: 'خدمة' }
]

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params
  const [name, setName] = useState('')
  const [type, setType] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/categories/${id}`)
        if (!response.ok) throw new Error('Failed to fetch category')
        const data = await response.json()
        setName(data.name)
        setType(options.find(option => option.value === data.type))
      } catch (error) {
        console.error('Error fetching category:', error)
        setError('Failed to fetch category')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchCategory()
    }
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!type) {
      setError('يرجى تحديد نوع التصنيف')
      return
    }
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, type: type.value }),
      })
      if (!response.ok) throw new Error('Failed to update category')
      router.push('/dashboard/categories')
    } catch (error) {
      console.error('Error updating category:', error)
      setError('Failed to update category')
    }
  }

  if (isLoading) {
    return <div className="text-center mt-8">جاري التحميل...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">تعديل التصنيف</h1>
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
        <Button type="submit">تعديل</Button>
      </form>
    </div>
  )
}
