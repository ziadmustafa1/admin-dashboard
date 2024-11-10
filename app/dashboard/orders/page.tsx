'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from "@/components/ui/button"

interface Order {
  id: string
  customerName: string
  totalAmount: number
  status: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders')
        if (!response.ok) throw new Error('Failed to fetch orders')
        const data = await response.json()
        setOrders(data)
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">جاري التحميل...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">الطلبات</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle>طلب رقم: {order.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>اسم العميل: {order.customerName}</p>
              <p>المبلغ الإجمالي: {order.totalAmount} ريال</p>
              <p>الحالة: {order.status}</p>
            </CardContent>
            <Button variant="destructive" onClick={() => handleDelete(order.id)}>
              حذف
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
