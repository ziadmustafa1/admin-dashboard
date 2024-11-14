'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Pencil, Trash } from 'lucide-react'

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
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchServices()
  }, [])

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

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
      try {
        const response = await fetch(`/api/services/${id}`, {
          method: 'DELETE',
        })
        if (!response.ok) throw new Error('Failed to delete service')
        fetchServices()
      } catch (error) {
        console.error('Error deleting service:', error)
      }
    }
  }

  if (isLoading) {
    return <div className="text-center mt-8">جاري التحميل...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">الخدمات</h1>
        <Link href="/dashboard/services/add">
          <Button>إضافة خدمة جديدة</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id}>
            <CardContent className="p-4">
              <div className="">
                <Image
                  src={service.image || '/placeholder.png'}
                  alt={service.name}
                  width={50}
                  height={50}
                  className="object-cover rounded-md"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">{service.name}</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">{service.price} ريال</p>
              <p className="mt-1 text-sm text-gray-500">{service.available ? 'متاح' : 'غير متاح'}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/services/edit/${service.id}`)}>
                <Pencil className="h-4 w-4 mr-2" />
                تعديل
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(service.id)}>
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