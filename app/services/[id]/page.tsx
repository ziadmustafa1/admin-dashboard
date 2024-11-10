'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface Service {
  id: string
  name: string
  description: string
  price: number
  category: string
  images: string[]
  available: boolean
}

export default function ServicePage() {
  const params = useParams()
  const router = useRouter()
  const [service, setService] = useState<Service | null>(null)
  const [similarServices, setSimilarServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/services/${params.id}`)
        if (!response.ok) throw new Error('فشل في جلب بيانات الخدمة')
        const data = await response.json()
        setService(data)
        fetchSimilarServices(data.category)
      } catch (error) {
        console.error('Error fetching service:', error)
        setError('حدث خطأ أثناء جلب بيانات الخدمة')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchService()
    }
  }, [params.id])

  const fetchSimilarServices = async (category: string) => {
    try {
      const response = await fetch(`/api/services?category=${category}`)
      if (!response.ok) throw new Error('فشل في جلب الخدمات المشابهة')
      const data = await response.json()
      setSimilarServices(data.filter((s: Service) => s.id !== params.id).slice(0, 10))
    } catch (error) {
      console.error('Error fetching similar services:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-center">
          <div className="h-8 w-32 bg-muted rounded mb-4 mx-auto" />
          <div className="h-4 w-24 bg-muted rounded mx-auto" />
        </div>
      </div>
    )
  }

  if (error || !service) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
        <AlertDescription>
          {error || 'لم يتم العثور على الخدمة'}
        </AlertDescription>
      </Alert>
    )
  }

  const nextImage = () => {
    setCurrentImage((currentImage + 1) % service.images.length)
  }

  const previousImage = () => {
    setCurrentImage((currentImage - 1 + service.images.length) % service.images.length)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto mb-8">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">{service.name}</CardTitle>
            <Badge variant={service.available ? "default" : "secondary"}>
              {service.available ? 'متاح' : 'غير متاح'}
            </Badge>
          </div>
          <p className="text-2xl font-bold text-primary">{service.price} ريال</p>
        </CardHeader>
        <CardContent className="space-y-8">
          {service.images.length > 0 ? (
            <>
              <div className="relative aspect-video">
                <Image
                  src={service.images[currentImage]}
                  alt={`${service.name} - صورة ${currentImage + 1}`}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <button onClick={previousImage} className="absolute left-1 top-1/2 transform -translate-y-1/2 px-2 py-1 rounded bg-background/50 backdrop-blur-md shadow-sm" ><ArrowLeft /></button>
                <button onClick={nextImage} className="absolute right-1 top-1/2 transform -translate-y-1/2 px-2 py-1 rounded bg-background/50 backdrop-blur-md shadow-sm"><ArrowRight /></button>
              </div>
              <div className="flex overflow-x-auto space-x-2 mt-4">
                {service.images.map((image, index) => (
                  <div key={index} className={`relative aspect-video w-24 cursor-pointer ${currentImage === index ? 'border-2 border-primary' : ''}`} onClick={() => setCurrentImage(index)}>
                    <Image
                      src={image}
                      alt={`${service.name} - صورة مصغرة ${index + 1}`}
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
                <p className="text-gray-600">{service.description}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">الفئة</h3>
                <p className="text-gray-600">{service.category}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 sm:justify-between">
          <Button
            variant="outline"
            onClick={() => router.push('/services')}
            className="w-full sm:w-auto"
          >
            العودة للخدمات
          </Button>
          <Button
            onClick={() => {
              window.open(`https://wa.me/+966XXXXXXXXX?text=استفسار عن خدمة: ${service.name}`, '_blank')
            }}
            className="w-full sm:w-auto"
            disabled={!service.available}
          >
            {service.available ? 'تواصل معنا عبر واتساب' : 'الخدمة غير متاحة حالياً'}
          </Button>
        </CardFooter>
      </Card>

      {similarServices.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">خدمات مشابهة</h2>
          <div className="relative">
            <div className="flex overflow-x-auto space-x-4 pb-4">
              {similarServices.map((similarService) => (
                <Card key={similarService.id} className="flex-shrink-0 w-64">
                  <CardContent className="p-4">
                    <div className="relative aspect-video mb-2">
                      <Image
                        src={similarService.images[0] || '/placeholder.png'}
                        alt={similarService.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="font-semibold">{similarService.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{similarService.price} ريال</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push(`/services/${similarService.id}`)}
                    >
                      عرض التفاصيل
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-background/50 backdrop-blur-md p-2 rounded-full shadow-md"
              onClick={() => {
                const container = document.querySelector('.overflow-x-auto');
                if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
              }}
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-background/50 backdrop-blur-md p-2 rounded-full shadow-md"
              onClick={() => {
                const container = document.querySelector('.overflow-x-auto');
                if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
              }}
            >
              <ArrowRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}