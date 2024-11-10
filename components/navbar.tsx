'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Menu, Search, ShoppingCart, User } from 'lucide-react'
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  type: 'PRODUCT' | 'SERVICE'
}

export function Navbar() {
  const [productCategories, setProductCategories] = useState<Category[]>([])
  const [serviceCategories, setServiceCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (!response.ok) throw new Error('Failed to fetch categories')
        const data = await response.json()
        setProductCategories(data.filter((category: Category) => category.type === 'PRODUCT'))
        setServiceCategories(data.filter((category: Category) => category.type === 'SERVICE'))
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-background"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>متجر الأزياء الموحد</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-4">
                <Link href="/" className="text-lg font-medium">
                  الرئيسية
                </Link>
                <div className="space-y-4">
                  <h3 className="font-medium text-primary">منتجات</h3>
                  {productCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/products?category=${category.name}`}
                      className="block px-2 py-1 text-muted-foreground hover:text-primary"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium text-primary">خدمات</h3>
                  {serviceCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/services?category=${category.name}`}
                      className="block px-2 py-1 text-muted-foreground hover:text-primary"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="text-xl font-bold">
            متجر الأزياء الموحد
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      "px-4 py-2 hover:text-primary",
                      pathname === "/" && "text-primary font-medium"
                    )}
                  >
                    الرئيسية
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>منتجات</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-2 p-4">
                    {productCategories.map((category) => (
                      <li key={category.id}>
                        <Link href={`/products?category=${category.name}`} legacyBehavior passHref>
                          <NavigationMenuLink
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              pathname === `/products?category=${category.name}` && "bg-accent"
                            )}
                          >
                            {category.name}
                          </NavigationMenuLink>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>خدمات</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-2 p-4">
                    {serviceCategories.map((category) => (
                      <li key={category.id}>
                        <Link href={`/services?category=${category.name}`} legacyBehavior passHref>
                          <NavigationMenuLink
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              pathname === `/services?category=${category.name}` && "bg-accent"
                            )}
                          >
                            {category.name}
                          </NavigationMenuLink>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search and Actions */}
          <div className="flex items-center gap-4">
            <form className="hidden md:block relative w-full max-w-sm">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="ابحث عن منتجات وخدمات..."
                className="w-full pl-4 pr-10"
              />
            </form>
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <a href='/dashboard'>
                <User className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden py-2">
          <form className="relative w-full">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="ابحث عن منتجات وخدمات..."
              className="w-full pl-4 pr-10"
            />
          </form>
        </div>
      </div>
    </header>
  )
}
