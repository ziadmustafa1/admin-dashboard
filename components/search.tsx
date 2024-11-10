'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Search as SearchIcon } from 'lucide-react'
import { useDebounce } from '@/lib/hooks/use-debounce'

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('query') || '')
  const debouncedSearch = useDebounce(searchQuery, 300)

  useEffect(() => {
    if (debouncedSearch) {
      router.push(`/search?query=${encodeURIComponent(debouncedSearch)}`)
    }
  }, [debouncedSearch, router])

  return (
    <div className="relative w-full max-w-sm">
      <SearchIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="ابحث عن منتجات وخدمات..."
        className="w-full pl-4 pr-10"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  )
}