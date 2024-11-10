'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState({
    totalServices: 0,
    totalProducts: 0,
    totalCategories: 0,
    newOrders: 0,
    totalUsers: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats')
        if (!response.ok) throw new Error('Failed to fetch stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-center">
          <div className="h-8 w-32 bg-muted rounded mb-4 mx-auto" />
          <div className="h-4 w-24 bg-muted rounded mx-auto" />
        </div>
      </div>
    )
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>مرحباً {session?.user?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            مرحباً بك في لوحة التحكم الخاصة بمتجر الأزياء الموحد
          </p>
          <Button variant="link" className="mt-4">تحديث الملف الشخصي</Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>إجمالي الخدمات</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalServices}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>إجمالي المنتجات</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalProducts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>إجمالي التصنيفات</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalCategories}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>طلبات جديدة</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.newOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>إجمالي المستخدمين</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <a href='/dashboard/services'>
          <Card>
            <CardHeader>
              <CardTitle>الخدمات</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">إدارة الخدمات المتاحة في المتجر.</p>
            </CardContent>
          </Card>
        </a>
        <a href='/dashboard/products'>
          <Card>
            <CardHeader>
              <CardTitle>المنتجات</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">إدارة المنتجات المتاحة في المتجر.</p>
            </CardContent>
          </Card>
        </a>
        <a href='/dashboard/categories'>
          <Card>
            <CardHeader>
              <CardTitle>التصنيفات</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">إدارة التصنيفات المختلفة للمنتجات والخدمات.</p>
            </CardContent>
          </Card>
        </a>
        <a href='/dashboard/orders'>
          <Card>
            <CardHeader>
              <CardTitle>الطلبات</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">إدارة طلبات العملاء.</p>
            </CardContent>
          </Card>
        </a>
        <a href='/dashboard/users'>
          <Card>
            <CardHeader>
              <CardTitle>المستخدمون</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">إدارة المستخدمين المسجلين في المتجر.</p>
            </CardContent>
          </Card>
        </a>
        <a href='/dashboard/reports'>
          <Card>
            <CardHeader>
              <CardTitle>التقارير</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">عرض التقارير والإحصائيات حول أداء المتجر.</p>
            </CardContent>
          </Card>
        </a>
      </div>
    </div>
  )
}