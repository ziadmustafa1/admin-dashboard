'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Pencil, Trash } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  quantity: number
  category: string
  images: string[]
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
        })
        if (!response.ok) throw new Error('Failed to delete product')
        fetchProducts()
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  if (isLoading) {
    return <div className="text-center mt-8">جاري التحميل...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">المنتجات</h1>
        <Link href="/dashboard/products/add">
          <Button>إضافة منتج جديد</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
              <Image
  src={product.image || '/placeholder.png'}
  alt={product.name}
  width={50}
  height={50}
  className="object-cover rounded-md"
/>
              </div>
              <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">{product.price} ريال</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/products/edit/${product.id}`)}>
                <Pencil className="h-4 w-4 mr-2" />
                تعديل
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                <Trash className="h-4 w-4 mr-2" />
                حذف
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}