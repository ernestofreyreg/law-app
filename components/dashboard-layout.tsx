"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { LayoutDashboard, Users, LogOut, Menu, X } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { authApi } from "@/lib/api"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: authApi.getMe,
    retry: false,
  })

  useEffect(() => {
    if (isError) {
      localStorage.removeItem("token")
      router.push("/auth/login")
    }
  }, [isError, router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    })
    router.push("/auth/login")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Customers", href: "/dashboard/customers", icon: Users },
  ]

  // Function to determine if a navigation item is active
  const isNavItemActive = (href: string) => {
    // For the dashboard, only highlight if it's exactly the dashboard path
    if (href === "/dashboard") {
      return pathname === "/dashboard"
    }
    // For other items, use the startsWith logic
    return pathname.startsWith(href)
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      {/* Mobile menu button */}
      <div className="fixed right-4 top-4 z-50 block md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r bg-card">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5">
            <div className="flex flex-shrink-0 items-center px-4">
              <h1 className="text-xl font-bold">Law Practice</h1>
            </div>
            <div className="mt-5 flex flex-1 flex-col">
              <nav className="flex-1 space-y-1 px-2">
                {navigation.map((item) => {
                  const isActive = isNavItemActive(item.href)
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 flex-shrink-0 ${
                          isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
          <div className="flex flex-shrink-0 border-t p-4">
            <div className="flex flex-1 items-center">
              <div>
                <p className="text-sm font-medium">{user?.firmName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Log out">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-card pt-5">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center">
                <h1 className="text-xl font-bold">Law Practice</h1>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="mt-5 flex flex-1 flex-col">
              <nav className="flex-1 space-y-1 px-2">
                {navigation.map((item) => {
                  const isActive = isNavItemActive(item.href)
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted hover:text-foreground"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 flex-shrink-0 ${
                          isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
            <div className="flex flex-shrink-0 border-t p-4">
              <div className="flex flex-1 items-center">
                <div>
                  <p className="text-sm font-medium">{user?.firmName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Log out">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col md:pl-64">
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
