'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface Category {
  id: string
  name: string
  type: 'PRODUCT' | 'SERVICE'
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (!response.ok) throw new Error('Failed to fetch categories')
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })
      setCategories(categories.filter(category => category.id !== id))
      alert('تم حذف التصنيف بنجاح')
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('حدث خطأ أثناء حذف التصنيف')
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">جاري التحميل...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">التصنيفات</h1>
      <div className="mb-8">
        <Link href="/dashboard/categories/add">
          <Button>إضافة تصنيف جديد</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              <p className="text-gray-600 mb-4">{category.type === 'PRODUCT' ? 'منتج' : 'خدمة'}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href={`/dashboard/categories/edit/${category.id}`} className="w-full">
                <Button className="w-full">تعديل</Button>
              </Link>
              <Button variant="destructive" onClick={() => handleDelete(category.id)}>
                حذف
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
