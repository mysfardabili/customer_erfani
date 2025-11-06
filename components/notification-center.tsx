"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Bell, AlertCircle, Clock, CheckCircle2 } from "lucide-react"
import type { Notification } from "@/lib/notifications"

interface NotificationCenterProps {
  notifications: Notification[]
  onMarkAsRead?: (id: string) => void
}

export function NotificationCenter({ notifications, onMarkAsRead }: NotificationCenterProps) {
  const [open, setOpen] = useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length

  const getIcon = (type: string) => {
    switch (type) {
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "due-soon":
        return <Clock className="h-4 w-4 text-orange-600" />
      case "reminder":
        return <CheckCircle2 className="h-4 w-4 text-blue-600" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "overdue":
        return "bg-red-50 border-red-200"
      case "due-soon":
        return "bg-orange-50 border-orange-200"
      case "reminder":
        return "bg-blue-50 border-blue-200"
      default:
        return "bg-slate-50 border-slate-200"
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="border-b p-4">
          <h2 className="font-semibold">Notifikasi</h2>
          <p className="text-sm text-muted-foreground">{unreadCount} notifikasi baru</p>
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex items-center justify-center h-full p-4 text-muted-foreground">
              <p>Tidak ada notifikasi</p>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${getTypeColor(notification.type)} ${
                    !notification.read ? "opacity-100" : "opacity-75"
                  }`}
                  onClick={() => {
                    if (onMarkAsRead && !notification.read) {
                      onMarkAsRead(notification.id)
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{notification.title}</p>
                        {!notification.read && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.timestamp.toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
