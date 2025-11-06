"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  ArrowUpDown,
  FileText,
  PieChart,
  Settings,
  Menu,
  Building2,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { NotificationCenter } from "@/components/notification-center"
import type { Notification } from "@/lib/notifications"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transaksi", href: "/dashboard/transactions", icon: ArrowUpDown },
  { name: "Piutang & Hutang", href: "/dashboard/debts", icon: FileText },
  { name: "Laporan", href: "/dashboard/reports", icon: PieChart },
  { name: "Pengaturan", href: "/dashboard/settings", icon: Settings },
]

interface DashboardLayoutProps {
  children: React.ReactNode
  notifications?: Notification[]
}

export function DashboardLayout({ children, notifications = [] }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationList, setNotificationList] = useState<Notification[]>(notifications)

  const handleLogout = () => {
    window.location.href = "/login"
  }

  const handleMarkAsRead = (id: string) => {
    setNotificationList((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center gap-2 border-b">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-lg font-bold">Keuangan UMKM</span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-slate-50",
                          )}
                        >
                          <item.icon className="h-5 w-5 shrink-0" />
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
              <li className="mt-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start gap-2 px-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="flex flex-1 flex-col items-start text-sm">
                        <span className="font-medium">Toko Maju Jaya</span>
                        <span className="text-xs text-muted-foreground">Pemilik</span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profil
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Pengaturan
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Keluar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm lg:hidden">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="-m-2.5">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-lg font-bold">Keuangan UMKM</span>
            </div>
            <nav className="flex flex-1 flex-col px-6 py-4">
              <ul role="list" className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-slate-50",
                        )}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2 flex-1">
          <Building2 className="h-6 w-6 text-primary" />
          <span className="font-semibold">Keuangan UMKM</span>
        </div>
        <NotificationCenter notifications={notificationList} onMarkAsRead={handleMarkAsRead} />
      </div>

      {/* Desktop Header with Notifications */}
      <div className="hidden lg:sticky lg:top-0 lg:z-40 lg:flex lg:items-center lg:justify-end lg:gap-x-6 lg:bg-white lg:px-8 lg:py-4 lg:shadow-sm lg:ml-64">
        <NotificationCenter notifications={notificationList} onMarkAsRead={handleMarkAsRead} />
      </div>

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  )
}
