'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  image: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const category = searchParams.get('category')
    setSelectedCategory(category)

    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/products${category ? `?category=${category}` : ''}`)
        if (!response.ok) throw new Error('Failed to fetch products')
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [searchParams, router])

  const handleCategoryChange = (value: string) => {
    router.push(`/products${value ? `?category=${value}` : ''}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">المنتجات</h1>
      <div className="mb-6">
        <Select value={selectedCategory || ''} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="اختر الفئة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">جميع الفئات</SelectItem>
            <SelectItem value="shirts">قمصان</SelectItem>
            <SelectItem value="pants">بناطيل</SelectItem>
            <SelectItem value="shoes">أحذية</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-square">
                <Image
                  src={product.image || '/placeholder.png'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start p-4">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.price} ريال</p>
              <Link href={`/products/${product.id}`} passHref>
                <Button className="mt-2 w-full">عرض التفاصيل</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}