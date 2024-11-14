'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'

interface Service {
  id: string
  name: string
  description: string
  price: number
  image: string
}

export default function ServicePage({ params }: { params: { id: string } }) {
  const [service, setService] = useState<Service | null>(null)
  const [similarServices, setSimilarServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const fetchService = useCallback(async () => {
    try {
      const response = await fetch(`/api/services/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch service')
      const data = await response.json()
      setService(data)
    } catch (error) {
      console.error('Error fetching service:', error)
    }
  }, [params.id])

  const fetchSimilarServices = useCallback(async () => {
    try {
      const response = await fetch(`/api/services?similar=${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch similar services')
      const data = await response.json()
      setSimilarServices(data)
    } catch (error) {
      console.error('Error fetching similar services:', error)
    } finally {
      setIsLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    fetchService()
    fetchSimilarServices()
  }, [fetchService, fetchSimilarServices])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-center text-muted-foreground">لم يتم العثور على الخدمة</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative aspect-square">
              <Image
                src={service.image || '/placeholder.png'}
                alt={service.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-4">{service.name}</h1>
              <p className="text-muted-foreground mb-4">{service.description}</p>
              <p className="text-2xl font-bold text-primary mb-6">{service.price} ريال</p>
              <Button className="w-full">حجز الخدمة</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">خدمات مشابهة</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {similarServices.map((similarService) => (
          <Card key={similarService.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-square">
                <Image
                  src={similarService.image || '/placeholder.png'}
                  alt={similarService.name}
                  fill
                  className="object-cover"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start p-4">
              <h3 className="font-semibold">{similarService.name}</h3>
              <p className="text-sm text-muted-foreground">{similarService.price} ريال</p>
              <Button
                className="mt-2 w-full"
                onClick={() => router.push(`/services/${similarService.id}`)}
              >
                عرض التفاصيل
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}