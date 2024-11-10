'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  quantity: number
  category: string
  images: string[]
}

export default function ProductDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    async function unwrapParams() {
      const resolvedParams = await params
      const { id } = resolvedParams

      const fetchProduct = async () => {
        try {
          const response = await fetch(`/api/products/${id}`)
          if (!response.ok) throw new Error('فشل في جلب بيانات المنتج')
          const data = await response.json()
          setProduct(data)
        } catch (error) {
          console.error('Error fetching product:', error)
          setError('حدث خطأ أثناء جلب بيانات المنتج')
        } finally {
          setIsLoading(false)
        }
      }

      fetchProduct()
    }

    unwrapParams()
  }, [params])

  if (isLoading) {
    return <div className="text-center mt-8">جاري التحميل...</div>
  }

  if (error || !product) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
        <AlertDescription>
          {error || 'لم يتم العثور على المنتج'}
        </AlertDescription>
      </Alert>
    )
  }

  const nextImage = () => {
    setCurrentImage((currentImage + 1) % product.images.length)
  }

  const previousImage = () => {
    setCurrentImage((currentImage - 1 + product.images.length) % product.images.length)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {product.images.length > 0 ? (
            <>
              <div className="relative aspect-video">
                <Image
                  src={product.images[currentImage]}
                  alt={`${product.name} - صورة ${currentImage + 1}`}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <button onClick={previousImage} className="absolute left-1 top-1/2 transform -translate-y-1/2 px-2 py-1 rounded bg-background/50 backdrop-blur-md shadow-sm" ><ArrowLeft /></button>
                <button onClick={nextImage} className="absolute right-1 top-1/2 transform -translate-y-1/2 px-2 py-1 rounded bg-background/50 backdrop-blur-md shadow-sm"><ArrowRight /></button>
              </div>
              <div className="flex overflow-x-auto space-x-2 mt-4">
                {product.images.map((image, index) => (
                  <div key={index} className={`relative aspect-video w-24 cursor-pointer ${currentImage === index ? 'border-2 border-primary' : ''}`} onClick={() => setCurrentImage(index)}>
                    <Image
                      src={image}
                      alt={`${product.name} - صورة مصغرة ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="w-full max-w-xl mx-auto">
              <div className="relative aspect-video">
                <Image
                  src="/placeholder.png"
                  alt="Placeholder"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">الوصف</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">الفئة</h3>
                <p className="text-gray-600">{product.category}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">السعر</h3>
                <p className="text-2xl font-bold text-primary">{product.price} ريال</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">الكمية المتوفرة</h3>
                <p className="text-lg">{product.quantity}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => router.push('/products')}
          >
            العودة للمنتجات
          </Button>
          <Button
            onClick={() => {
              // يمكنك إضافة وظيفة إضافة المنتج إلى السلة هنا
              alert('تم إضافة المنتج إلى السلة')
            }}
          >
            إضافة إلى السلة
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
