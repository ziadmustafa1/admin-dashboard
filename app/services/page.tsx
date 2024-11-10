'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from 'next/image'

interface Service {
  id: string
  name: string
  description: string
  price: number
  category: string
  images: string[]
  available: boolean
}

export default function ServicesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services')
        if (!response.ok) throw new Error('Failed to fetch services')
        const data = await response.json()
        setServices(data)
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchServices()
    }
  }, [status, router])

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      })
      setServices(services.filter(service => service.id !== id))
      alert('تم حذف الخدمة بنجاح')
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('حدث خطأ أثناء حذف الخدمة')
    }
  }

  if (status === 'loading' || isLoading) {
    return <div className="flex items-center justify-center min-h-screen">جاري التحميل...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">خدماتنا</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id}>
            <CardContent className="p-4">
            <div className="">
                <Image
                  src={service.images[0] || '/placeholder.png'}
                  alt={service.name}
                  width={3000}
                  height={3000}
                  className="object-cover object-center"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <p className="text-lg font-medium text-gray-900 mb-4">{service.price} ريال</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href={`/services/${service.id}`} className="w-full">
                <Button className="w-full">المزيد من التفاصيل</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
