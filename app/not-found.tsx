import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background" dir="rtl">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">عذراً، الصفحة التي تبحث عنها غير موجودة</p>
      <Link href="/dashboard">
        <Button>
          العودة إلى لوحة التحكم
        </Button>
      </Link>
    </div>
  )
}