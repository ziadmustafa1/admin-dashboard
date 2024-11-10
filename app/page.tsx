import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { prisma } from '@/lib/prisma'

async function getLatestProducts() {
  return await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
  })
}

async function getLatestServices() {
  return await prisma.service.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
  })
}

export default async function Home() {
  const latestProducts = await getLatestProducts()
  const latestServices = await getLatestServices()

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">مرحبًا بك في متجر الأزياء الموحد</h1>
        <p className="text-xl text-gray-600 mb-8">اكتشف أحدث الأزياء والخدمات المميزة</p>
        <div className="flex justify-center gap-4">
          <Link href="/products">
            <Button size="lg">تصفح المنتجات</Button>
          </Link>
          <Link href="/services">
            <Button size="lg" variant="outline">استكشف الخدمات</Button>
          </Link>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">أحدث المنتجات</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {latestProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="relative w-full h-48 mb-4">
                  <Image
                    src={product.images[0] || '/placeholder.png'}
                    alt={product.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-primary font-bold">{product.price} ريال</p>
              </CardContent>
              <CardFooter>
                <Link href={`/products/${product.id}`} className="w-full">
                  <Button variant="secondary" className="w-full">عرض التفاصيل</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">أحدث الخدمات</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {latestServices.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="relative w-full h-48 mb-4">
                  <Image
                    src={service.images[0] || '/placeholder.png'}
                    alt={service.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                <p className="text-primary font-bold">{service.price} ريال</p>
              </CardContent>
              <CardFooter>
                <Link href={`/services/${service.id}`} className="w-full">
                  <Button variant="secondary" className="w-full">عرض التفاصيل</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}